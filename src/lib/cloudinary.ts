import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Checks if Cloudinary credentials are fully provided in environment
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Uploads a buffer directly to Cloudinary using upload_stream
 */
export async function uploadStreamToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resource_type?: 'video' | 'image' | 'auto';
    public_id?: string;
  } = {}
): Promise<UploadApiResponse> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured in environment variables (.env)');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'mighty-warner/hero',
        resource_type: options.resource_type || 'auto',
        public_id: options.public_id,
        overwrite: true,
      },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('No response returned from Cloudinary upload'));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Extracts publicId from a Cloudinary URL
 * Example: https://res.cloudinary.com/dfrcmd6uz/video/upload/v1792137238/mighty-warner/hero/ocean_1792137238.mp4
 * Returns: "mighty-warner/hero/ocean_1792137238"
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let pathAfterUpload = parts[1];

    // Remove any transformation parameters like c_scale,w_500/ or f_auto,q_auto/
    const segments = pathAfterUpload.split('/');
    const cleanSegments: string[] = [];
    for (const seg of segments) {
      // Skip transformation strings (contain comma or underscore params like w_, h_, c_, q_, f_) or version tags (v123456)
      if (/^v\d+$/.test(seg) || /^[a-z]_[a-z0-9_,-]+$/i.test(seg) || seg.includes(',')) {
        continue;
      }
      cleanSegments.push(seg);
    }

    const fullPathWithExt = cleanSegments.join('/');
    // Strip file extension
    const lastDot = fullPathWithExt.lastIndexOf('.');
    return lastDot !== -1 ? fullPathWithExt.slice(0, lastDot) : fullPathWithExt;
  } catch {
    return null;
  }
}

/**
 * Deletes an asset from Cloudinary storage by its publicId or URL
 */
export async function deleteFromCloudinary(
  publicIdOrUrl: string,
  resourceType: 'video' | 'image' | 'raw' = 'image'
): Promise<{ result: string } | null> {
  if (!isCloudinaryConfigured() || !publicIdOrUrl) return null;

  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('res.cloudinary.com')) {
    const extracted = extractPublicIdFromUrl(publicIdOrUrl);
    if (!extracted) return null;
    publicId = extracted;
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return res;
  } catch (err: any) {
    console.warn(`[Cloudinary] Failed to delete asset '${publicId}':`, err?.message || err);
    return null;
  }
}

/**
 * Generates signature for direct client-side upload to Cloudinary.
 * Bypasses serverless function payload limits (e.g. Vercel 4.5MB limit).
 */
export function generateCloudinarySignature(params: {
  folder?: string;
  resource_type?: 'video' | 'image' | 'auto';
} = {}) {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured in environment variables (.env)');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, any> = {
    timestamp,
  };

  if (params.folder && params.folder.trim()) {
    paramsToSign.folder = params.folder.trim();
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: params.folder ? params.folder.trim() : undefined,
  };
}

export { cloudinary };


/**
 * clientUpload.ts - Unified media uploader with client-side validation
 * and direct-to-Cloudinary upload to bypass Vercel serverless 4.5MB payload limits.
 */

export interface UploadOptions {
  file: File;
  folder?: string;
  resourceType?: 'video' | 'image' | 'auto';
  previousUrl?: string;
  onProgress?: (percent: number) => void;
}

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  duration?: number;
  width?: number;
  height?: number;
  provider: 'cloudinary' | 'local';
}

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB

const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.mkv'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif'];
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/avif',
];

/**
 * Validates file size and format before initiating any network request.
 */
export function validateMediaFile(file: File, expectedType?: 'video' | 'image' | 'auto'): 'video' | 'image' {
  if (!file) {
    throw new Error('Please select a file to upload.');
  }

  if (file.size === 0) {
    throw new Error('The selected file is empty (0 bytes). Please select a valid file.');
  }

  const name = file.name.toLowerCase();
  const ext = name.slice(name.lastIndexOf('.'));
  const mimeType = (file.type || '').toLowerCase();

  const isVideoFile =
    mimeType.startsWith('video/') ||
    ALLOWED_VIDEO_EXTENSIONS.includes(ext);

  if (expectedType === 'video' && !isVideoFile) {
    throw new Error(`Expected a video file, but selected file (${ext || mimeType || 'unknown'}) is not a supported video.`);
  }

  if (expectedType === 'image' && isVideoFile) {
    throw new Error('Expected an image file, but a video file was selected.');
  }

  const isVideo = expectedType === 'video' || (expectedType !== 'image' && isVideoFile);

  if (isVideo) {
    const isValidVideo =
      ALLOWED_VIDEO_TYPES.includes(mimeType) ||
      ALLOWED_VIDEO_EXTENSIONS.includes(ext);

    if (!isValidVideo) {
      throw new Error(
        `Unsupported video format (${ext || mimeType || 'unknown'}). Supported formats: MP4, WebM, MOV.`
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      throw new Error(
        `Video size (${sizeMb} MB) exceeds the maximum allowed limit of 100 MB. Please compress the video before uploading.`
      );
    }

    return 'video';
  } else {
    const isValidImage =
      ALLOWED_IMAGE_TYPES.includes(mimeType) ||
      ALLOWED_IMAGE_EXTENSIONS.includes(ext);

    if (!isValidImage) {
      throw new Error(
        `Unsupported image format (${ext || mimeType || 'unknown'}). Supported formats: JPG, PNG, WebP, SVG, GIF.`
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      throw new Error(
        `Image size (${sizeMb} MB) exceeds the maximum allowed limit of 10 MB. Please choose a smaller image.`
      );
    }

    return 'image';
  }
}

/**
 * Performs direct client-to-Cloudinary upload using XMLHttpRequest for progress tracking.
 */
function uploadToCloudinaryDirect(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const text = xhr.responseText;
        let responseJson: any = null;
        try {
          responseJson = JSON.parse(text);
        } catch {
          // If response is not JSON
          return reject(
            new Error(
              `Cloudinary returned non-JSON response (Status ${xhr.status}): ${text.slice(0, 150)}`
            )
          );
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(responseJson);
        } else {
          const errMsg =
            responseJson?.error?.message ||
            responseJson?.message ||
            `Upload to Cloudinary failed with status ${xhr.status}`;
          reject(new Error(errMsg));
        }
      } catch (err: any) {
        reject(err);
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while uploading to Cloudinary CDN.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload to Cloudinary timed out.'));
    };

    xhr.send(formData);
  });
}

/**
 * Performs local fallback upload to /api/admin/upload using XMLHttpRequest
 */
function uploadToLocalFallback(
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload', true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 413) {
        return reject(
          new Error(
            'Upload payload too large (413). On Vercel, files larger than 4.5MB must use Cloudinary. Please verify Cloudinary environment variables in Vercel settings.'
          )
        );
      }

      try {
        const text = xhr.responseText;
        let json: any = null;
        try {
          json = JSON.parse(text);
        } catch {
          return reject(
            new Error(`Server returned status ${xhr.status}: ${text.slice(0, 100) || xhr.statusText}`)
          );
        }

        if (xhr.status >= 200 && xhr.status < 300 && json.success) {
          resolve(json);
        } else {
          reject(new Error(json?.error || 'Local file upload failed.'));
        }
      } catch (err: any) {
        reject(err);
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error uploading file to server.'));
    };

    xhr.send(formData);
  });
}

/**
 * Main upload entry point.
 * 1. Validates file format and size.
 * 2. Gets a signed upload signature from /api/admin/upload/sign.
 * 3. If Cloudinary is configured, uploads DIRECTLY to Cloudinary API, bypassing Vercel's 4.5MB limit.
 * 4. Records the asset in Neon DB and deletes old asset if replaced.
 */
export async function uploadMedia(options: UploadOptions): Promise<UploadResult> {
  const { file, folder = 'mighty-warner/hero', previousUrl, onProgress } = options;

  // 1. Client-side Validation (Throws immediately if invalid)
  const resourceType = validateMediaFile(file, options.resourceType);

  if (onProgress) onProgress(5);

  // 2. Request Upload Signature from backend
  let signData: any = null;
  try {
    const signRes = await fetch('/api/admin/upload/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder, resourceType }),
    });

    if (signRes.status === 413) {
      throw new Error('Request payload too large (413).');
    }

    const contentType = signRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await signRes.text();
      throw new Error(`Signature endpoint returned status ${signRes.status}: ${text.slice(0, 100)}`);
    }

    signData = await signRes.json();
    if (!signRes.ok || !signData.success) {
      throw new Error(signData.error || 'Failed to authenticate upload signature with server.');
    }
  } catch (signErr: any) {
    console.warn('[Upload] Could not obtain Cloudinary signature:', signErr.message);
  }

  // 3A. Direct-to-Cloudinary Upload (Bypasses Vercel 4.5MB limit completely)
  if (signData && signData.configured && signData.signature && signData.apiKey && signData.cloudName) {
    if (onProgress) onProgress(15);

    const cloudFormData = new FormData();
    cloudFormData.append('file', file);
    cloudFormData.append('api_key', signData.apiKey);
    cloudFormData.append('timestamp', String(signData.timestamp));
    cloudFormData.append('signature', signData.signature);
    if (signData.folder) {
      cloudFormData.append('folder', signData.folder);
    }

    const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;

    const cloudResult = await uploadToCloudinaryDirect(
      cloudinaryEndpoint,
      cloudFormData,
      (percent) => {
        // Map 0-100% network progress to 15-90% overall progress
        if (onProgress) onProgress(Math.round(15 + percent * 0.75));
      }
    );

    if (onProgress) onProgress(92);

    const uploadedUrl = cloudResult.secure_url || cloudResult.url;

    // 4. Record asset in DB and cleanup old asset
    try {
      await fetch('/api/admin/upload/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadedUrl,
          secureUrl: cloudResult.secure_url,
          publicId: cloudResult.public_id,
          format: cloudResult.format,
          width: cloudResult.width,
          height: cloudResult.height,
          bytes: cloudResult.bytes,
          duration: cloudResult.duration,
          folder: signData.folder || folder,
          fileName: file.name,
          previousUrl: previousUrl || '',
          resourceType,
        }),
      });
    } catch (recordErr) {
      console.warn('[Upload] Note: could not record media asset in DB:', recordErr);
    }

    if (onProgress) onProgress(100);

    return {
      url: uploadedUrl,
      secureUrl: cloudResult.secure_url || uploadedUrl,
      publicId: cloudResult.public_id,
      format: cloudResult.format,
      bytes: cloudResult.bytes,
      duration: cloudResult.duration,
      width: cloudResult.width,
      height: cloudResult.height,
      provider: 'cloudinary',
    };
  }

  // 3B. Fallback for Local Development when Cloudinary is not configured
  // Note: On Vercel, requests > 4.5MB will be rejected by Vercel edge.
  if (file.size > 4.5 * 1024 * 1024 && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    throw new Error(
      `Cloudinary CDN is not configured in Vercel environment variables. File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds Vercel's 4.5MB serverless payload limit. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your Vercel deployment.`
    );
  }

  const localFormData = new FormData();
  localFormData.append('file', file);
  localFormData.append('folder', folder);
  localFormData.append('resource_type', resourceType);
  if (previousUrl) {
    localFormData.append('previousUrl', previousUrl);
  }

  const localResult = await uploadToLocalFallback(localFormData, onProgress);
  if (onProgress) onProgress(100);

  return {
    url: localResult.url,
    secureUrl: localResult.url,
    publicId: localResult.publicId,
    format: localResult.format,
    bytes: localResult.bytes,
    provider: localResult.provider || 'local',
  };
}

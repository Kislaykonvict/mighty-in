import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { isCloudinaryConfigured, uploadStreamToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * Removes an existing asset from Cloudinary or local storage and deletes its DB tracking record
 */
async function cleanupPreviousAsset(prevUrl: string, resourceType: 'video' | 'image') {
  if (!prevUrl) return;

  // 1. Cloudinary asset removal
  if (prevUrl.includes('res.cloudinary.com')) {
    try {
      await deleteFromCloudinary(prevUrl, resourceType);
      await prisma.mediaAsset.deleteMany({
        where: {
          OR: [
            { url: prevUrl },
            { secureUrl: prevUrl },
          ],
        },
      });
      console.log(`[Upload API] Deleted previous Cloudinary asset: ${prevUrl}`);
    } catch (e) {
      console.warn(`[Upload API] Could not delete previous Cloudinary asset:`, e);
    }
  }
  // 2. Local fallback storage removal
  else if (prevUrl.startsWith('/uploads/')) {
    try {
      const localFilePath = path.join(process.cwd(), 'public', prevUrl);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      await prisma.mediaAsset.deleteMany({
        where: { url: prevUrl },
      });
      console.log(`[Upload API] Deleted previous local asset: ${prevUrl}`);
    } catch (e) {
      console.warn(`[Upload API] Could not delete previous local asset:`, e);
    }
  }
}

// GET /api/admin/upload - Check Cloudinary configuration status
export async function GET() {
  const configured = isCloudinaryConfigured();
  return NextResponse.json({
    success: true,
    cloudinaryConfigured: configured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
  });
}

// POST /api/admin/upload - Upload file to Cloudinary (with local fallback and previous asset cleanup)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'mighty-warner/hero';
    const previousUrl = (formData.get('previousUrl') as string) || '';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type
    const mimeType = file.type || '';
    const isVideo = mimeType.startsWith('video/') || Boolean(file.name.match(/\.(mp4|webm|mov|mkv)$/i));
    const resourceType: 'video' | 'image' = isVideo ? 'video' : 'image';

    // 1. If Cloudinary is configured, upload directly to Cloudinary
    if (isCloudinaryConfigured()) {
      try {
        const cleanName = path.parse(file.name).name.replace(/[^a-zA-Z0-9_-]/g, '_');
        const publicId = `${cleanName}_${Date.now()}`;

        const uploadResult = await uploadStreamToCloudinary(buffer, {
          folder,
          resource_type: resourceType,
          public_id: publicId,
        });

        // Record in database
        try {
          await prisma.mediaAsset.create({
            data: {
              publicId: uploadResult.public_id,
              url: uploadResult.secure_url,
              secureUrl: uploadResult.secure_url,
              format: uploadResult.format,
              width: uploadResult.width,
              height: uploadResult.height,
              bytes: uploadResult.bytes || buffer.length,
              folder,
              altText: file.name,
              caption: file.name,
            },
          });
        } catch (dbErr) {
          console.warn('Could not record media asset in DB:', dbErr);
        }

        // Remove previous asset from Cloudinary / local storage if one existed
        if (previousUrl && previousUrl !== uploadResult.secure_url) {
          await cleanupPreviousAsset(previousUrl, resourceType);
        }

        return NextResponse.json({
          success: true,
          provider: 'cloudinary',
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          duration: uploadResult.duration,
          width: uploadResult.width,
          height: uploadResult.height,
          message: 'Uploaded to Cloudinary CDN successfully (and removed previous asset)',
        });
      } catch (cloudErr: any) {
        console.error('Cloudinary upload error:', cloudErr);
        return NextResponse.json(
          { success: false, error: cloudErr.message || 'Cloudinary upload failed' },
          { status: 500 }
        );
      }
    }

    // 2. Fallback: Save to /public/uploads/ directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', isVideo ? 'videos' : 'images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.jpg');
    const safeBaseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const finalFileName = `${safeBaseName}_${timestamp}${ext}`;
    const destinationPath = path.join(uploadsDir, finalFileName);

    await fs.promises.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/${isVideo ? 'videos' : 'images'}/${finalFileName}`;

    // Record in database
    try {
      await prisma.mediaAsset.create({
        data: {
          publicId: finalFileName,
          url: publicUrl,
          secureUrl: publicUrl,
          format: ext.replace('.', ''),
          bytes: buffer.length,
          folder: `local/${isVideo ? 'videos' : 'images'}`,
          altText: file.name,
          caption: file.name,
        },
      });
    } catch (dbErr) {
      console.warn('Could not record local media asset in DB:', dbErr);
    }

    // Remove previous asset if replaced
    if (previousUrl && previousUrl !== publicUrl) {
      await cleanupPreviousAsset(previousUrl, resourceType);
    }

    return NextResponse.json({
      success: true,
      provider: 'local',
      url: publicUrl,
      bytes: buffer.length,
      message: 'Saved to local storage (Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env to upload directly to Cloudinary)',
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/upload - Explicit asset deletion from Cloudinary or local storage
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url as string;
    const resourceType = (body.resourceType as 'video' | 'image') || 'image';

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Asset URL is required' },
        { status: 400 }
      );
    }

    await cleanupPreviousAsset(url, resourceType);

    return NextResponse.json({
      success: true,
      message: 'Asset removed successfully',
    });
  } catch (err: any) {
    console.error('Delete handler error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete asset' },
      { status: 500 }
    );
  }
}


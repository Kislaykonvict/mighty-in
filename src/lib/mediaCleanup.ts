import path from 'path';
import fs from 'fs';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/db/prisma';

/**
 * Removes an existing asset from Cloudinary or local storage and deletes its DB tracking record
 */
export async function cleanupPreviousAsset(prevUrl: string, resourceType: 'video' | 'image' = 'image') {
  if (!prevUrl || typeof prevUrl !== 'string') return;

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
      console.log(`[Media Cleanup] Deleted previous Cloudinary asset: ${prevUrl}`);
    } catch (e) {
      console.warn(`[Media Cleanup] Could not delete previous Cloudinary asset:`, e);
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
      console.log(`[Media Cleanup] Deleted previous local asset: ${prevUrl}`);
    } catch (e) {
      console.warn(`[Media Cleanup] Could not delete previous local asset:`, e);
    }
  }
}

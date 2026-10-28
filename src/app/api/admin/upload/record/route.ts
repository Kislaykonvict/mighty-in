import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cleanupPreviousAsset } from '@/lib/mediaCleanup';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url || body.secureUrl;
    const publicId = body.publicId || body.public_id || url;
    const format = body.format || '';
    const width = typeof body.width === 'number' ? body.width : null;
    const height = typeof body.height === 'number' ? body.height : null;
    const bytes = typeof body.bytes === 'number' ? body.bytes : null;
    const folder = body.folder || 'mighty-warner/hero';
    const altText = body.altText || body.fileName || '';
    const caption = body.caption || body.fileName || '';
    const previousUrl = body.previousUrl || '';
    const resourceType = body.resourceType === 'video' ? 'video' : 'image';

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Asset URL is required' },
        { status: 400 }
      );
    }

    // Save in database
    try {
      await prisma.mediaAsset.create({
        data: {
          publicId,
          url,
          secureUrl: body.secureUrl || url,
          format,
          width,
          height,
          bytes,
          folder,
          altText,
          caption,
        },
      });
    } catch (dbErr) {
      console.warn('[Upload Record API] Could not record media asset in DB:', dbErr);
    }

    // Clean up previous asset if replaced
    if (previousUrl && previousUrl !== url) {
      await cleanupPreviousAsset(previousUrl, resourceType);
    }

    return NextResponse.json({
      success: true,
      url,
      message: 'Media asset successfully registered and previous asset removed.',
    });
  } catch (err: any) {
    console.error('[Upload Record Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to record uploaded asset' },
      { status: 500 }
    );
  }
}

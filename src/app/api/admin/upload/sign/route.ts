import { NextRequest, NextResponse } from 'next/server';
import { isCloudinaryConfigured, generateCloudinarySignature } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json({
        success: true,
        configured: false,
        message: 'Cloudinary is not configured in environment variables. Falling back to direct server upload.',
      });
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const folder = body.folder || 'mighty-warner/hero';
    const resourceType = body.resourceType === 'video' ? 'video' : 'image';

    const signData = generateCloudinarySignature({
      folder,
      resource_type: resourceType,
    });

    return NextResponse.json({
      success: true,
      configured: true,
      signature: signData.signature,
      timestamp: signData.timestamp,
      apiKey: signData.apiKey,
      cloudName: signData.cloudName,
      folder: signData.folder,
      resourceType,
    });
  } catch (err: any) {
    console.error('[Upload Sign Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}

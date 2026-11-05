import { NextRequest } from 'next/server';
import { POST as adminUploadPOST, GET as adminUploadGET, DELETE as adminUploadDELETE } from '@/app/api/admin/upload/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  return adminUploadGET();
}

export async function POST(req: NextRequest) {
  return adminUploadPOST(req);
}

export async function DELETE(req: NextRequest) {
  return adminUploadDELETE(req);
}


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAdminToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found or deactivated' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Session verify error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { signAdminToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_OPTIONS } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find admin user in database
    const user = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email address or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'This account has been deactivated. Please contact SuperAdmin.' },
        { status: 403 }
      );
    }

    // Verify password hash
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid email address or password' },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT token
    const token = await signAdminToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS);

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal authentication error' },
      { status: 500 }
    );
  }
}

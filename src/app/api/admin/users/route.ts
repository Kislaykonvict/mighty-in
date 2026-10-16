import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/users - List users with optional role & search filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get('role');
    const searchParam = searchParams.get('q');
    const statusParam = searchParams.get('status');

    const where: any = {};

    if (roleParam && roleParam !== 'ALL' && Object.values(Role).includes(roleParam as Role)) {
      where.role = roleParam as Role;
    }

    if (statusParam && statusParam !== 'ALL') {
      where.isActive = statusParam === 'ACTIVE';
    }

    if (searchParam && searchParam.trim().length > 0) {
      where.OR = [
        { name: { contains: searchParam.trim(), mode: 'insensitive' } },
        { email: { contains: searchParam.trim(), mode: 'insensitive' } },
      ];
    }

    const users = await prisma.adminUser.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, isActive, avatarUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'A user with this email address already exists' }, { status: 409 });
    }

    const validRole = Object.values(Role).includes(role) ? (role as Role) : Role.ADMIN;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.adminUser.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: validRole,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

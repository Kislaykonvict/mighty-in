import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, password, role, isActive, avatarUrl } = body;

    const existingUser = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email && email.trim() && email.includes('@')) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== existingUser.email) {
        const emailTaken = await prisma.adminUser.findUnique({
          where: { email: normalizedEmail },
        });
        if (emailTaken) {
          return NextResponse.json({ error: 'Email is already in use by another account' }, { status: 409 });
        }
        updateData.email = normalizedEmail;
      }
    }

    if (role && Object.values(Role).includes(role)) {
      // If demoting from SUPERADMIN, ensure at least one active SUPERADMIN remains
      if (existingUser.role === Role.SUPERADMIN && role !== Role.SUPERADMIN) {
        const superadminCount = await prisma.adminUser.count({
          where: { role: Role.SUPERADMIN, isActive: true },
        });
        if (superadminCount <= 1) {
          return NextResponse.json(
            { error: 'Cannot demote the only remaining active Superadmin' },
            { status: 400 }
          );
        }
      }
      updateData.role = role as Role;
    }

    if (typeof isActive === 'boolean') {
      // If deactivating a SUPERADMIN, ensure at least one active remains
      if (existingUser.role === Role.SUPERADMIN && !isActive) {
        const activeSuperadminCount = await prisma.adminUser.count({
          where: { role: Role.SUPERADMIN, isActive: true },
        });
        if (activeSuperadminCount <= 1) {
          return NextResponse.json(
            { error: 'Cannot deactivate the only active Superadmin account' },
            { status: 400 }
          );
        }
      }
      updateData.isActive = isActive;
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl ? avatarUrl.trim() : null;
    }

    if (password && password.trim().length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData,
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
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const existingUser = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Safeguard: Prevent deleting the last SUPERADMIN
    if (existingUser.role === Role.SUPERADMIN) {
      const superadminCount = await prisma.adminUser.count({
        where: { role: Role.SUPERADMIN },
      });
      if (superadminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the only Superadmin account in the system' },
          { status: 400 }
        );
      }
    }

    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}

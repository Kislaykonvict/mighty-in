import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const members = await prisma.teamMember.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json({
      success: true,
      members,
      total: members.length,
    });
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, specialty, bio, image, department = 'Leadership', featured = true } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Member name is required' }, { status: 400 });
    }
    if (!role?.trim()) {
      return NextResponse.json({ success: false, error: 'Designation / role is required' }, { status: 400 });
    }
    if (!specialty?.trim()) {
      return NextResponse.json({ success: false, error: 'Title / specialty is required' }, { status: 400 });
    }
    if (!image?.trim()) {
      return NextResponse.json({ success: false, error: 'Picture URL is required' }, { status: 400 });
    }
    if (!bio?.trim()) {
      return NextResponse.json({ success: false, error: 'Description / bio is required' }, { status: 400 });
    }

    const count = await prisma.teamMember.count();

    const member = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        specialty: specialty.trim(),
        bio: bio.trim(),
        image: image.trim(),
        department: department.trim() || 'Leadership',
        featured: Boolean(featured),
        order: body.order !== undefined ? Number(body.order) : count,
      },
    });

    revalidatePath('/team');
    revalidatePath('/about');

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create team member' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if reordering batch
    if (Array.isArray(body.items)) {
      await Promise.all(
        body.items.map((item: { id: string; order: number }) =>
          prisma.teamMember.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );

      revalidatePath('/team');
      revalidatePath('/about');

      return NextResponse.json({ success: true, message: 'Team members reordered' });
    }

    const { id, name, role, specialty, bio, image, department, featured, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Member ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (role !== undefined) updateData.role = role.trim();
    if (specialty !== undefined) updateData.specialty = specialty.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (image !== undefined) updateData.image = image.trim();
    if (department !== undefined) updateData.department = department.trim();
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (order !== undefined) updateData.order = Number(order);

    const member = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/team');
    revalidatePath('/about');

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Member ID is required' }, { status: 400 });
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath('/team');
    revalidatePath('/about');

    return NextResponse.json({ success: true, message: 'Team member deleted' });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete team member' },
      { status: 500 }
    );
  }
}


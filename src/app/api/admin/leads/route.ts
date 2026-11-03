import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const topic = searchParams.get('topic');
    const search = searchParams.get('search')?.trim();

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (topic && topic !== 'ALL') {
      where.topic = topic;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, totalCount, newCount, reviewedCount, contactedCount, archivedCount] =
      await Promise.all([
        prisma.leadSubmission.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
        prisma.leadSubmission.count(),
        prisma.leadSubmission.count({ where: { status: 'NEW' } }),
        prisma.leadSubmission.count({ where: { status: 'REVIEWED' } }),
        prisma.leadSubmission.count({ where: { status: 'CONTACTED' } }),
        prisma.leadSubmission.count({ where: { status: 'ARCHIVED' } }),
      ]);

    return NextResponse.json({
      success: true,
      data: leads,
      counts: {
        total: totalCount,
        new: newCount,
        reviewed: reviewedCount,
        contacted: contactedCount,
        archived: archivedCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['NEW', 'REVIEWED', 'CONTACTED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updated = await prisma.leadSubmission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    await prisma.leadSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

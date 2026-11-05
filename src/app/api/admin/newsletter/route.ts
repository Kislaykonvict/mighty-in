import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }

    const [subscribers, totalCount, activeCount, unsubscribedCount] =
      await Promise.all([
        prisma.newsletterSubscription.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 200,
        }),
        prisma.newsletterSubscription.count(),
        prisma.newsletterSubscription.count({ where: { status: 'ACTIVE' } }),
        prisma.newsletterSubscription.count({ where: { status: 'UNSUBSCRIBED' } }),
      ]);

    return NextResponse.json({
      success: true,
      data: subscribers,
      counts: {
        total: totalCount,
        active: activeCount,
        unsubscribed: unsubscribedCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subscribers' },
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
        { success: false, error: 'Subscriber ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['ACTIVE', 'UNSUBSCRIBED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updated = await prisma.newsletterSubscription.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update subscriber' },
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
        { success: false, error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscription.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageSlug = searchParams.get('pageSlug')?.trim();
    const search = searchParams.get('search')?.trim();

    const where: any = {};

    if (pageSlug && pageSlug !== 'all') {
      where.pageSlug = pageSlug;
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const faqs = await prisma.faqItem.findMany({
      where,
      orderBy: [{ pageSlug: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      faqs,
      total: faqs.length,
    });
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      answer,
      pageSlug = 'global',
      category = 'general',
      order,
      isActive = true,
    } = body;

    if (!question?.trim()) {
      return NextResponse.json({ success: false, error: 'Question is required' }, { status: 400 });
    }
    if (!answer?.trim()) {
      return NextResponse.json({ success: false, error: 'Answer is required' }, { status: 400 });
    }

    // Calculate order if not provided
    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const highest = await prisma.faqItem.findFirst({
        where: { pageSlug: pageSlug.trim() },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      finalOrder = (highest?.order ?? -1) + 1;
    }

    const faq = await prisma.faqItem.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        pageSlug: pageSlug.trim() || 'global',
        category: (category.trim() || 'general').toLowerCase(),
        order: Number(finalOrder) || 0,
        isActive: Boolean(isActive),
      },
    });

    try {
      if (pageSlug && pageSlug !== 'global') {
        revalidatePath(pageSlug);
      }
      revalidatePath('/');
    } catch (e) {
      // Ignore in dev
    }

    return NextResponse.json({ success: true, faq });
  } catch (error: any) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if batch reordering
    if (body.action === 'reorder' && Array.isArray(body.items)) {
      const updates = body.items.map((item: { id: string; order: number }) =>
        prisma.faqItem.update({
          where: { id: item.id },
          data: { order: Number(item.order) },
        })
      );
      await prisma.$transaction(updates);

      try {
        if (body.pageSlug && body.pageSlug !== 'global') {
          revalidatePath(body.pageSlug);
        }
        revalidatePath('/');
      } catch (e) {
        // Ignore in dev
      }

      return NextResponse.json({ success: true, message: 'Reordered successfully' });
    }

    const { id, question, answer, pageSlug, category, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'FAQ id is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined) updateData.answer = answer.trim();
    if (pageSlug !== undefined) updateData.pageSlug = pageSlug.trim() || 'global';
    if (category !== undefined) updateData.category = category.trim().toLowerCase();
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const faq = await prisma.faqItem.update({
      where: { id },
      data: updateData,
    });

    try {
      if (faq.pageSlug && faq.pageSlug !== 'global') {
        revalidatePath(faq.pageSlug);
      }
      revalidatePath('/');
    } catch (e) {
      // Ignore in dev
    }

    return NextResponse.json({ success: true, faq });
  } catch (error: any) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      return NextResponse.json({ success: false, error: 'FAQ id is required' }, { status: 400 });
    }

    const faq = await prisma.faqItem.delete({
      where: { id },
    });

    try {
      if (faq.pageSlug && faq.pageSlug !== 'global') {
        revalidatePath(faq.pageSlug);
      }
      revalidatePath('/');
    } catch (e) {
      // Ignore in dev
    }

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}

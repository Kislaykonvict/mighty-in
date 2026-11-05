import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_INSIGHT_CATEGORIES = [
  'Strategy',
  'Local SEO',
  'Paid Ads',
  'Branding',
  'Social media',
  'Technology',
  'SEO',
  'Talent',
];

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'insights',
          sectionKey: 'categories',
        },
      },
    });

    if (!section) {
      // Find distinct categories from insights if available
      const dbInsights = await prisma.insight.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      const dbCategories = dbInsights
        .map((p) => p.category?.trim())
        .filter((cat): cat is string => Boolean(cat));

      const categories = dbCategories.length > 0 ? dbCategories : DEFAULT_INSIGHT_CATEGORIES;

      return NextResponse.json({
        success: true,
        categories,
      });
    }

    const content = (section.content as any) || {};
    const categories: string[] =
      Array.isArray(content.categories) && content.categories.length > 0
        ? content.categories
        : DEFAULT_INSIGHT_CATEGORIES;

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching insight categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const categories: string[] = Array.isArray(body.categories)
      ? Array.from(new Set(body.categories.map((c: any) => String(c).trim()).filter(Boolean)))
      : [];

    if (categories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one category is required' },
        { status: 400 }
      );
    }

    // Check if any deleted category is connected to existing articles
    const existingSection = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'insights',
          sectionKey: 'categories',
        },
      },
    });

    const existingCategories: string[] = Array.isArray((existingSection?.content as any)?.categories)
      ? (existingSection?.content as any).categories
      : [];

    const removedCategories = existingCategories.filter(
      (oldCat) => !categories.some((newCat) => newCat.toLowerCase() === oldCat.toLowerCase())
    );

    if (removedCategories.length > 0) {
      for (const removed of removedCategories) {
        const connectedArticles = await prisma.insight.findMany({
          where: {
            category: {
              equals: removed,
              mode: 'insensitive',
            },
          },
          select: { title: true },
        });

        if (connectedArticles.length > 0) {
          const sample = connectedArticles.slice(0, 2).map((a) => `"${a.title}"`).join(', ');
          const extra = connectedArticles.length > 2 ? ` and ${connectedArticles.length - 2} more` : '';
          return NextResponse.json(
            {
              success: false,
              error: `Cannot delete category "${removed}". It is currently connected to ${connectedArticles.length} article(s) (${sample}${extra}). Please reassign or delete these articles first.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // If a category was renamed, update all connected articles in the DB
    if (body.renamedFrom && body.renamedTo) {
      const from = String(body.renamedFrom).trim();
      const to = String(body.renamedTo).trim();
      if (from && to && from !== to) {
        await prisma.insight.updateMany({
          where: { category: { equals: from, mode: 'insensitive' } },
          data: { category: to },
        });
      }
    }

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'insights',
          sectionKey: 'categories',
        },
      },
      create: {
        pageSlug: 'insights',
        sectionKey: 'categories',
        name: 'Insight Categories & Topic Taxonomy',
        title: 'TOPICS',
        content: {
          categories,
        },
        isActive: true,
      },
      update: {
        content: {
          categories,
        },
        isActive: true,
      },
    });

    revalidatePath('/insights');
    revalidatePath('/admin/insights');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      categories,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating insight categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update categories' },
      { status: 500 }
    );
  }
}


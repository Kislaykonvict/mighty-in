import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');

    // Single article by slug
    if (slug) {
      const article = await prisma.insight.findUnique({
        where: { slug },
      });
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    const whereClause: any = {};

    if (category && category !== 'All') {
      whereClause.category = {
        equals: category,
        mode: 'insensitive',
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAccent: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const articles = await prisma.insight.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
      ],
    });

    // Get official categories from siteSection if available
    let categories: string[] = [];
    try {
      const catSection = await prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'insights',
            sectionKey: 'categories',
          },
        },
      });

      if (catSection && Array.isArray((catSection.content as any)?.categories)) {
        categories = (catSection.content as any).categories;
      } else {
        const allCategories = await prisma.insight.findMany({
          select: { category: true },
          distinct: ['category'],
        });
        categories = allCategories.map((c) => c.category).filter(Boolean);
      }
    } catch {
      const allCategories = await prisma.insight.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      categories = allCategories.map((c) => c.category).filter(Boolean);
    }

    return NextResponse.json({
      articles,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights', details: error.message },
      { status: 500 }
    );
  }
}


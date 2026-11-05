import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAccent: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { authorName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, totalCount, allCategories] = await Promise.all([
      prisma.insight.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      }),
      prisma.insight.count(),
      prisma.insight.findMany({
        select: { category: true },
        distinct: ['category'],
      }),
    ]);

    const categories = allCategories.map((c) => c.category).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: articles,
      categories,
      totalCount,
    });
  } catch (error: any) {
    console.error('Error fetching admin insights:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      titleAccent,
      subtitle,
      slug: customSlug,
      category,
      readTime,
      publishedAt,
      authorName,
      authorRole,
      authorAvatar,
      coverImage,
      excerpt,
      content,
      keyTakeaways,
      tags,
      featured,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      headCode,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article title is required' },
        { status: 400 }
      );
    }

    if (!category || !category.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category is required (custom category is supported)' },
        { status: 400 }
      );
    }

    // Determine slug
    let finalSlug = customSlug?.trim() ? slugify(customSlug) : slugify(title);
    if (!finalSlug) finalSlug = `article-${Date.now()}`;

    // Ensure slug is unique
    const existing = await prisma.insight.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Format content (supports rich HTML string or array)
    let formattedContent: any = '';
    if (typeof content === 'string') {
      formattedContent = content;
    } else if (Array.isArray(content)) {
      formattedContent = content;
    }

    // Format tags
    let formattedTags: any = [];
    if (Array.isArray(tags)) {
      formattedTags = tags;
    } else if (typeof tags === 'string') {
      formattedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Format key takeaways
    let formattedTakeaways: any = [];
    if (Array.isArray(keyTakeaways)) {
      formattedTakeaways = keyTakeaways;
    } else if (typeof keyTakeaways === 'string') {
      formattedTakeaways = keyTakeaways.split('\n').map((t) => t.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
    }

    const created = await prisma.insight.create({
      data: {
        title: title.trim(),
        titleAccent: titleAccent?.trim() || null,
        subtitle: subtitle?.trim() || '',
        slug: finalSlug,
        category: category.trim(),
        readTime: readTime?.trim() || '5 min read',
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        authorName: authorName?.trim() || 'Team Mighty Warner',
        authorRole: authorRole?.trim() || '',
        authorAvatar: authorAvatar?.trim() || null,
        coverImage: coverImage?.trim() || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85',
        excerpt: excerpt?.trim() || '',
        content: formattedContent,
        keyTakeaways: formattedTakeaways,
        tags: formattedTags,
        featured: !!featured,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
        metaKeywords: metaKeywords?.trim() || null,
        canonicalUrl: canonicalUrl?.trim() || null,
        headCode: headCode?.trim() || null,
      },
    });

    revalidatePath('/insights');
    revalidatePath(`/insights/${created.slug}`);
    revalidatePath('/admin/insights');
    revalidatePath('/');

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error('Error creating insight:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create insight' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required for update' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.titleAccent !== undefined) updateData.titleAccent = data.titleAccent?.trim() || null;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle?.trim() || '';
    if (data.category !== undefined) updateData.category = data.category.trim();
    if (data.readTime !== undefined) updateData.readTime = data.readTime.trim();
    if (data.publishedAt !== undefined) updateData.publishedAt = new Date(data.publishedAt);
    if (data.authorName !== undefined) updateData.authorName = data.authorName.trim();
    if (data.authorRole !== undefined) updateData.authorRole = data.authorRole.trim();
    if (data.authorAvatar !== undefined) updateData.authorAvatar = data.authorAvatar?.trim() || null;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage.trim();
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt.trim();
    if (data.featured !== undefined) updateData.featured = !!data.featured;

    if (data.slug !== undefined && data.slug.trim()) {
      updateData.slug = slugify(data.slug);
    }

    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    if (data.tags !== undefined) {
      updateData.tags = Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === 'string'
        ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];
    }

    if (data.keyTakeaways !== undefined) {
      updateData.keyTakeaways = Array.isArray(data.keyTakeaways)
        ? data.keyTakeaways
        : typeof data.keyTakeaways === 'string'
        ? data.keyTakeaways.split('\n').map((t: string) => t.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
        : [];
    }

    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle?.trim() || null;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription?.trim() || null;
    if (data.metaKeywords !== undefined) updateData.metaKeywords = data.metaKeywords?.trim() || null;
    if (data.canonicalUrl !== undefined) updateData.canonicalUrl = data.canonicalUrl?.trim() || null;
    if (data.headCode !== undefined) updateData.headCode = data.headCode?.trim() || null;

    const updated = await prisma.insight.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/insights');
    revalidatePath(`/insights/${updated.slug}`);
    revalidatePath('/admin/insights');
    revalidatePath('/');

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating insight:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update insight' },
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
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    await prisma.insight.delete({
      where: { id },
    });

    revalidatePath('/insights');
    revalidatePath('/admin/insights');
    revalidatePath('/');

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting insight:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete insight' },
      { status: 500 }
    );
  }
}


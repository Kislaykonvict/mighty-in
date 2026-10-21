import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { defaultPolicyPages } from '@/data/defaultPolicyPages';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slugs = ['terms-and-conditions', 'disclaimer', 'privacy-policy', 'refund-policy'];
    const existing = await prisma.policyPage.findMany({
      orderBy: { order: 'asc' },
    });

    const existingMap = new Map(existing.map((p) => [p.slug, p]));

    // Auto-seed missing pages
    for (const slug of slugs) {
      if (!existingMap.has(slug)) {
        const def = defaultPolicyPages[slug];
        if (def) {
          try {
            const created = await prisma.policyPage.create({
              data: {
                slug: def.slug,
                title: def.title,
                heroImage: def.heroImage,
                heroTitle: def.heroTitle,
                heroSubtitle: def.heroSubtitle,
                heroBadge: def.heroBadge,
                content: def.content,
                metaTitle: def.metaTitle,
                metaDescription: def.metaDescription,
                isActive: def.isActive,
                order: def.order ?? 0,
              },
            });
            existingMap.set(slug, created);
          } catch (seedErr) {
            console.warn(`Could not seed page ${slug}:`, seedErr);
          }
        }
      }
    }

    const pages = slugs
      .map((slug) => existingMap.get(slug) || defaultPolicyPages[slug])
      .filter(Boolean);

    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    console.error('Error fetching policy pages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch policy pages' },
      { status: 500 }
    );
  }
}

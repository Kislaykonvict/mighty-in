import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import {
  TestimonialsSectionData,
  defaultTestimonialsSectionData,
  TestimonialCard,
} from '@/types/testimonialsSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'testimonials',
        },
      },
    });

    if (!section) {
      // Check if DB has seeded testimonials in Testimonial model
      try {
        const dbTestimonials = await prisma.testimonial.findMany({
          orderBy: { order: 'asc' },
        });

        if (dbTestimonials && dbTestimonials.length > 0) {
          const cards: TestimonialCard[] = dbTestimonials.map((t, idx) => ({
            id: t.id,
            clientName: t.clientName,
            role: t.role,
            company: t.company,
            industry: t.industry,
            quote: t.quote,
            fullQuote: t.fullQuote || undefined,
            verticalId: (t.verticalId || 'technology') as 'digital-growth' | 'technology' | 'talent-solutions',
            relatedProjectSlug: t.relatedProjectSlug || undefined,
            relatedProjectTitle: t.relatedProjectTitle || undefined,
            avatarUrl: t.avatarUrl || undefined,
            rating: t.rating ?? 5,
            highlightedPhrase: t.highlightedPhrase || '',
            featured: t.featured ?? true,
            order: t.order ?? idx,
          }));

          return NextResponse.json({
            success: true,
            data: {
              ...defaultTestimonialsSectionData,
              cards,
            },
          });
        }
      } catch (dbErr) {
        console.warn('Could not query prisma.testimonial fallback:', dbErr);
      }

      return NextResponse.json({
        success: true,
        data: defaultTestimonialsSectionData,
      });
    }

    const content = (section.content as any) || {};
    const rawCards: any[] = Array.isArray(content.cards) && content.cards.length > 0
      ? content.cards
      : defaultTestimonialsSectionData.cards;

    const cards: TestimonialCard[] = rawCards.map((item, idx) => ({
      id: item.id || `testimonial-${Date.now()}-${idx}`,
      clientName: item.clientName ?? '',
      role: item.role ?? '',
      company: item.company ?? '',
      industry: item.industry ?? '',
      quote: item.quote ?? '',
      fullQuote: item.fullQuote || undefined,
      verticalId: (item.verticalId || 'technology') as 'digital-growth' | 'technology' | 'talent-solutions',
      relatedProjectSlug: item.relatedProjectSlug || undefined,
      relatedProjectTitle: item.relatedProjectTitle || undefined,
      avatarUrl: item.avatarUrl || undefined,
      rating: typeof item.rating === 'number' ? item.rating : 5,
      highlightedPhrase: item.highlightedPhrase || '',
      featured: item.featured !== false,
      order: typeof item.order === 'number' ? item.order : idx,
    }));

    const data: TestimonialsSectionData = {
      badge: section.badge !== null && section.badge !== undefined ? section.badge : '',
      title: section.title !== null && section.title !== undefined ? section.title : '',
      subtitle: section.subtitle !== null && section.subtitle !== undefined ? section.subtitle : '',
      isActive: section.isActive ?? true,
      cards,
    };

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err: any) {
    console.error('Error fetching testimonials section:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch testimonials configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: TestimonialsSectionData = await request.json();

    const badge = typeof body.badge === 'string' ? body.badge.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const subtitle = typeof body.subtitle === 'string' ? body.subtitle.trim() : '';
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    const cards: TestimonialCard[] = Array.isArray(body.cards)
      ? body.cards.map((c, index) => ({
          id: c.id || `testimonial-${Date.now()}-${index}`,
          clientName: (c.clientName || '').trim(),
          role: (c.role || '').trim(),
          company: (c.company || '').trim(),
          industry: (c.industry || '').trim(),
          quote: (c.quote || '').trim(),
          fullQuote: c.fullQuote ? c.fullQuote.trim() : undefined,
          verticalId: c.verticalId || 'technology',
          relatedProjectSlug: c.relatedProjectSlug ? c.relatedProjectSlug.trim() : undefined,
          relatedProjectTitle: c.relatedProjectTitle ? c.relatedProjectTitle.trim() : undefined,
          avatarUrl: c.avatarUrl ? c.avatarUrl.trim() : undefined,
          rating: typeof c.rating === 'number' ? Math.min(5, Math.max(1, c.rating)) : 5,
          highlightedPhrase: (c.highlightedPhrase || '').trim(),
          featured: c.featured !== false,
          order: typeof c.order === 'number' ? c.order : index,
        }))
      : [];

    const content = {
      cards,
    };

    // 1. Upsert into SiteSection for fast SSR retrieval on storefront
    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'testimonials',
        },
      },
      update: {
        name: 'Testimonials & Social Proof',
        badge,
        title,
        subtitle,
        isActive,
        content: content as any,
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'testimonials',
        name: 'Testimonials & Social Proof',
        badge,
        title,
        subtitle,
        isActive,
        content: content as any,
        order: 5,
      },
    });

    // 2. Synchronize cards with prisma.testimonial table
    try {
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        await prisma.testimonial.upsert({
          where: { id: c.id },
          update: {
            clientName: c.clientName,
            role: c.role,
            company: c.company,
            industry: c.industry,
            quote: c.quote,
            fullQuote: c.fullQuote || null,
            verticalId: c.verticalId,
            relatedProjectSlug: c.relatedProjectSlug || null,
            relatedProjectTitle: c.relatedProjectTitle || null,
            avatarUrl: c.avatarUrl || null,
            rating: c.rating ?? 5,
            highlightedPhrase: c.highlightedPhrase || '',
            featured: c.featured ?? true,
            order: i,
          },
          create: {
            id: c.id,
            clientName: c.clientName,
            role: c.role,
            company: c.company,
            industry: c.industry,
            quote: c.quote,
            fullQuote: c.fullQuote || null,
            verticalId: c.verticalId,
            relatedProjectSlug: c.relatedProjectSlug || null,
            relatedProjectTitle: c.relatedProjectTitle || null,
            avatarUrl: c.avatarUrl || null,
            rating: c.rating ?? 5,
            highlightedPhrase: c.highlightedPhrase || '',
            featured: c.featured ?? true,
            order: i,
          },
        });
      }
    } catch (syncErr) {
      console.warn('Could not sync with prisma.testimonial table:', syncErr);
    }

    try {
      revalidatePath('/');
      revalidatePath('/admin/testimonials');
    } catch {
      // Ignore during development
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Testimonials section updated and published live to storefront!',
        data: {
          badge: updated.badge,
          title: updated.title,
          subtitle: updated.subtitle,
          isActive: updated.isActive,
          cards,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err: any) {
    console.error('Error updating testimonials section:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update testimonials section' },
      { status: 500 }
    );
  }
}

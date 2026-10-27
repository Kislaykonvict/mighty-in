import { Metadata } from 'next';
import { constructDynamicMetadata } from '@/lib/utils/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { HeroSection } from '@/components/hero/HeroSection';
import { TrustSection } from '@/components/trust/TrustSection';
import { CoreBusinessShowcaseSection } from '@/components/businesses/CoreBusinessShowcaseSection';
import { WorkSection } from '@/components/work/WorkSection';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { GlobalOfficesSection } from '@/components/globe/GlobalOfficesSection';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { prisma } from '@/lib/db/prisma';
import { defaultHeroData, HeroData } from '@/types/hero';
import { defaultCoreBusinessData, CoreBusinessData } from '@/types/coreBusiness';
import {
  defaultTestimonialsSectionData,
  TestimonialsSectionData,
  TestimonialCard,
} from '@/types/testimonialsSection';
import { defaultHomepageWorkData, HomepageWorkData } from '@/types/homepageWork';
import { projectsData } from '@/data/projects';

export const revalidate = 0;

async function getHeroData(): Promise<HeroData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'hero',
        },
      },
    });

    if (!section || !section.isActive) return defaultHeroData;

    const content = (section.content as any) || {};

    return {
      badge: section.badge || defaultHeroData.badge,
      title: section.title || defaultHeroData.title,
      subtitle: section.subtitle || defaultHeroData.subtitle,
      ctaText: section.ctaText || defaultHeroData.ctaText,
      ctaLink: section.ctaLink || defaultHeroData.ctaLink,
      secondaryCtaText: content.secondaryCtaText || defaultHeroData.secondaryCtaText,
      secondaryCtaLink: content.secondaryCtaLink || defaultHeroData.secondaryCtaLink,
      videoUrl: content.videoUrl || defaultHeroData.videoUrl,
      fallbackImageUrl: content.fallbackImageUrl || defaultHeroData.fallbackImageUrl,
      overlayOpacity: typeof content.overlayOpacity === 'number' ? content.overlayOpacity : defaultHeroData.overlayOpacity,
      isActive: section.isActive ?? true,
    };
  } catch (err) {
    return defaultHeroData;
  }
}

async function getCoreBusinessData(): Promise<CoreBusinessData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'core_business',
        },
      },
    });

    if (!section || !section.isActive) return defaultCoreBusinessData;

    const content = (section.content as any) || {};

    const rawCards: any[] = Array.isArray(content.cards) && content.cards.length > 0
      ? content.cards
      : defaultCoreBusinessData.cards;

    return {
      title: section.title || defaultCoreBusinessData.title,
      badge: section.badge || defaultCoreBusinessData.badge,
      subtitle: section.subtitle || defaultCoreBusinessData.subtitle,
      cards: rawCards,
      isActive: section.isActive ?? true,
    };
  } catch (err) {
    return defaultCoreBusinessData;
  }
}

async function getTestimonialsData(): Promise<TestimonialsSectionData> {
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
      // Check fallback in prisma.testimonial table
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

          return {
            ...defaultTestimonialsSectionData,
            cards,
          };
        }
      } catch {
        // Fallback to defaults
      }

      return defaultTestimonialsSectionData;
    }

    const content = (section.content as any) || {};
    const rawCards: any[] =
      Array.isArray(content.cards) && content.cards.length > 0
        ? content.cards
        : defaultTestimonialsSectionData.cards;

    return {
      badge: section.badge !== null && section.badge !== undefined ? section.badge : '',
      title: section.title !== null && section.title !== undefined ? section.title : '',
      subtitle: section.subtitle !== null && section.subtitle !== undefined ? section.subtitle : '',
      cards: rawCards,
      isActive: section.isActive ?? true,
    };
  } catch (err) {
    return defaultTestimonialsSectionData;
  }
}

async function getHomepageWorkData(): Promise<HomepageWorkData> {
  try {
    const [section, dbProjects] = await Promise.all([
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'home',
            sectionKey: 'work',
          },
        },
      }),
      prisma.project.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    const fallbackProjects = dbProjects.length > 0 ? (dbProjects as any) : projectsData;

    if (!section) {
      return {
        ...defaultHomepageWorkData,
        projects: fallbackProjects.slice(0, 6),
      };
    }

    const content = (section.content as any) || {};
    const selectedIds: string[] = Array.isArray(content.selectedProjectIds)
      ? content.selectedProjectIds
      : [];
    const maxDisplay = typeof content.maxDisplay === 'number' ? content.maxDisplay : 6;

    let orderedProjects: any[] = [];
    if (selectedIds.length > 0 && dbProjects.length > 0) {
      const map = new Map<string, any>();
      dbProjects.forEach((p) => map.set(p.id, p));
      orderedProjects = selectedIds.map((id) => map.get(id)).filter(Boolean);
    }

    if (orderedProjects.length === 0) {
      orderedProjects = fallbackProjects.slice(0, 6);
    }

    return {
      badge:
        section.badge !== null && section.badge !== undefined
          ? section.badge
          : defaultHomepageWorkData.badge,
      title:
        section.title !== null && section.title !== undefined
          ? section.title
          : defaultHomepageWorkData.title,
      subtitle:
        section.subtitle !== null && section.subtitle !== undefined
          ? section.subtitle
          : defaultHomepageWorkData.subtitle,
      ctaText:
        section.ctaText !== null && section.ctaText !== undefined
          ? section.ctaText
          : defaultHomepageWorkData.ctaText,
      ctaLink:
        section.ctaLink !== null && section.ctaLink !== undefined
          ? section.ctaLink
          : defaultHomepageWorkData.ctaLink,
      selectedProjectIds: selectedIds,
      maxDisplay: orderedProjects.length,
      isActive: section.isActive ?? true,
      projects: orderedProjects,
    };
  } catch (err) {
    return {
      ...defaultHomepageWorkData,
      projects: projectsData.slice(0, 6),
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return constructDynamicMetadata('/', {
    title: 'One Company. Multiple Ways to Move Your Business Forward',
    description:
      'Mighty Warner unites Digital & Growth, Technology, and Talent Solutions under one connected ecosystem. Discover how we build brands, software platforms, and elite engineering teams.',
    canonical: '/',
  });
}

export default async function HomePage() {
  const [heroData, coreBusinessData, testimonialsData, workData] = await Promise.all([
    getHeroData(),
    getCoreBusinessData(),
    getTestimonialsData(),
    getHomepageWorkData(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic SEO Custom Header Scripts, Meta Tags & Schema */}
      <CustomHeadCode path="/" />

      {/* 1. Signature Dynamic Full-Width Video Hero */}
      <HeroSection data={heroData} />

      {/* 2. Verified Trust & Client Credibility */}
      <TrustSection />

      {/* 3. Core Business Showcase: Scroll Stacking Cards */}
      <CoreBusinessShowcaseSection initialData={coreBusinessData} />

      {/* 4. Proof: Verified Portfolio & Case Studies */}
      <WorkSection data={workData} />

      {/* 5. Social Proof: Executive Endorsements & Reviews */}
      <TestimonialsSection initialData={testimonialsData} />

      {/* 6. Global Footprint: Interactive 3D Globe with Pinpoint Offices */}
      <GlobalOfficesSection />

      {/* 7. Conversion: Final What's Next CTA */}
      <FinalCtaSection />
    </div>
  );
}

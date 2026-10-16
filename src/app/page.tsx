import { Metadata } from 'next';
import { constructDynamicMetadata } from '@/lib/utils/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { HeroSection } from '@/components/hero/HeroSection';
import { TrustSection } from '@/components/trust/TrustSection';
import { BusinessCardsSection } from '@/components/businesses/BusinessCardsSection';
import { WorkSection } from '@/components/work/WorkSection';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { GlobalOfficesSection } from '@/components/globe/GlobalOfficesSection';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { prisma } from '@/lib/db/prisma';
import { defaultHeroData, HeroData } from '@/types/hero';

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

export async function generateMetadata(): Promise<Metadata> {
  return constructDynamicMetadata('/', {
    title: 'One Company. Multiple Ways to Move Your Business Forward',
    description:
      'Mighty Warner unites Digital & Growth, Technology, and Talent Solutions under one connected ecosystem. Discover how we build brands, software platforms, and elite engineering teams.',
    canonical: '/',
  });
}

export default async function HomePage() {
  const heroData = await getHeroData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic SEO Custom Header Scripts, Meta Tags & Schema */}
      <CustomHeadCode path="/" />

      {/* 1. Signature Dynamic Full-Width Video Hero */}
      <HeroSection data={heroData} />

      {/* 2. Verified Trust & Client Credibility */}
      <TrustSection />

      {/* 3. Core Business Pillars: 3 Major Disciplines */}
      <BusinessCardsSection />

      {/* 4. Proof: Verified Portfolio & Case Studies */}
      <WorkSection />

      {/* 5. Social Proof: Executive Endorsements & Reviews */}
      <TestimonialsSection />

      {/* 6. Global Footprint: Interactive 3D Globe with Pinpoint Offices */}
      <GlobalOfficesSection />

      {/* 7. Conversion: Final What's Next CTA */}
      <FinalCtaSection />
    </div>
  );
}

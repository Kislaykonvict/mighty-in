import React from 'react';
import { prisma } from '@/lib/db/prisma';
import {
  BusinessSlug,
  businessVerticalDefaults,
  createDefaultVerticalData,
  BusinessHeroData,
  BusinessPhilosophyData,
  BusinessVerticalData,
} from '@/types/businessVertical';
import { BusinessHeroSection } from './BusinessHeroSection';
import { BusinessPhilosophySection } from './BusinessPhilosophySection';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

interface BusinessDetailViewProps {
  slug: BusinessSlug;
}

async function getBusinessData(slug: BusinessSlug): Promise<{
  hero: BusinessHeroData;
  philosophy: BusinessPhilosophyData;
}> {
  let baseData: BusinessVerticalData = businessVerticalDefaults[slug];

  if (!baseData) {
    let name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    let tagline = `${name} solutions and architecture`;
    try {
      const dbVertical = await prisma.businessVertical.findUnique({
        where: { slug },
      });
      if (dbVertical) {
        name = dbVertical.name;
        tagline = dbVertical.tagline || tagline;
      }
    } catch (e) {
      console.error(`Error loading BusinessVertical record for ${slug}:`, e);
    }
    baseData = createDefaultVerticalData(slug, name, tagline);
  }

  const pageSlug = `business-${slug}`;

  try {
    const [heroSection, philosophySection] = await Promise.all([
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug,
            sectionKey: 'hero',
          },
        },
      }),
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug,
            sectionKey: 'philosophy',
          },
        },
      }),
    ]);

    let hero: BusinessHeroData = baseData.hero;
    if (heroSection) {
      const content = (heroSection.content as any) || {};
      hero = {
        headline: heroSection.title || content.headline || baseData.hero.headline,
        subheadline: heroSection.subtitle || content.subheadline || baseData.hero.subheadline,
        ctaText: heroSection.ctaText || content.ctaText || baseData.hero.ctaText,
        ctaLink: heroSection.ctaLink || content.ctaLink || baseData.hero.ctaLink,
        backgroundImage: content.backgroundImage || baseData.hero.backgroundImage,
        imageAlt: content.imageAlt || baseData.hero.imageAlt,
        scrollTarget: content.scrollTarget || baseData.hero.scrollTarget,
        isActive: heroSection.isActive ?? true,
      };
    }

    let philosophy: BusinessPhilosophyData = baseData.philosophy;
    if (philosophySection) {
      const content = (philosophySection.content as any) || {};
      philosophy = {
        badge: philosophySection.badge || content.badge || baseData.philosophy.badge,
        title: philosophySection.title || content.title || baseData.philosophy.title,
        subtitle: philosophySection.subtitle || content.subtitle || baseData.philosophy.subtitle,
        cards:
          Array.isArray(content.cards) && content.cards.length > 0
            ? content.cards
            : baseData.philosophy.cards,
        isActive: philosophySection.isActive ?? true,
      };
    }

    return { hero, philosophy };
  } catch (error) {
    console.error(`Error loading business data for ${slug}, using defaults:`, error);
    return {
      hero: baseData.hero,
      philosophy: baseData.philosophy,
    };
  }
}

export async function BusinessDetailView({ slug }: BusinessDetailViewProps) {
  const { hero, philosophy } = await getBusinessData(slug);

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#080C14]">
      {/* 1. Versett-Style Text Over Picture Hero (Dynamic) */}
      <BusinessHeroSection data={hero} />

      {/* 2. Philosophy & Craft Narrative Cards (Dynamic) */}
      <BusinessPhilosophySection data={philosophy} />

      {/* 3. Common Global Conversion CTA (Growth Accelerator) */}
      <FinalCtaSection />
    </div>
  );
}

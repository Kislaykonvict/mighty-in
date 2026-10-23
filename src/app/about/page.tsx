import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { prisma } from '@/lib/db/prisma';
import { AboutHeroVersett } from '@/components/about/AboutHeroVersett';
import { InnovativeTrajectorySection } from '@/components/about/InnovativeTrajectorySection';
import { AboutStorySection } from '@/components/about/AboutStorySection';
import { PeopleSection } from '@/components/people/PeopleSection';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { AboutHeroData, defaultAboutHeroData } from '@/types/aboutHero';
import { TrajectoryData, defaultTrajectoryData } from '@/types/trajectory';
import { AboutStoryData, defaultAboutStoryData } from '@/types/aboutStory';

export const revalidate = 60; // Incremental Static Regeneration

export const metadata = constructMetadata({
  title: 'About Mighty Warner | Building Businesses Since 2013',
  description:
    'Learn about Mighty Warner’s journey since 2013: our multidisciplinary team, founding vision, and connected business ecosystem across strategy, technology, and talent.',
  canonical: '/about',
});

async function getHeroData(): Promise<AboutHeroData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'hero',
        },
      },
    });

    if (!section || !section.content) {
      return defaultAboutHeroData;
    }

    const content = section.content as any;

    return {
      headline: section.title || content.headline || defaultAboutHeroData.headline,
      subheadline: section.subtitle || content.subheadline || defaultAboutHeroData.subheadline,
      ctaText: section.ctaText || content.ctaText || defaultAboutHeroData.ctaText,
      ctaLink: section.ctaLink || content.ctaLink || defaultAboutHeroData.ctaLink,
      backgroundImage: content.backgroundImage || defaultAboutHeroData.backgroundImage,
      imageAlt: content.imageAlt || defaultAboutHeroData.imageAlt,
      scrollTarget: content.scrollTarget || defaultAboutHeroData.scrollTarget,
      isActive: section.isActive ?? true,
    };
  } catch (error) {
    console.error('Error fetching dynamic about hero data, using defaults:', error);
    return defaultAboutHeroData;
  }
}

async function getTrajectoryData(): Promise<TrajectoryData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'trajectory',
        },
      },
    });

    if (!section || !section.content) {
      return defaultTrajectoryData;
    }

    const content = section.content as any;

    return {
      badge: section.badge || content.badge || defaultTrajectoryData.badge,
      title: section.title || content.title || defaultTrajectoryData.title,
      subtitle: section.subtitle || content.subtitle || defaultTrajectoryData.subtitle,
      epochs: Array.isArray(content.epochs) && content.epochs.length > 0
        ? content.epochs
        : defaultTrajectoryData.epochs,
      isActive: section.isActive ?? true,
    };
  } catch (error) {
    console.error('Error fetching dynamic trajectory data, using defaults:', error);
    return defaultTrajectoryData;
  }
}

async function getStoryData(): Promise<AboutStoryData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'about',
          sectionKey: 'story',
        },
      },
    });

    if (!section || !section.content) {
      return defaultAboutStoryData;
    }

    const content = section.content as any;

    return {
      badge: section.badge || content.badge || defaultAboutStoryData.badge,
      title: section.title || content.title || defaultAboutStoryData.title,
      subtitle: section.subtitle || content.subtitle || defaultAboutStoryData.subtitle,
      cards: Array.isArray(content.cards) && content.cards.length > 0
        ? content.cards
        : defaultAboutStoryData.cards,
      isActive: section.isActive ?? true,
    };
  } catch (error) {
    console.error('Error fetching dynamic story data, using defaults:', error);
    return defaultAboutStoryData;
  }
}

export default async function AboutPage() {
  const [heroData, trajectoryData, storyData] = await Promise.all([
    getHeroData(),
    getTrajectoryData(),
    getStoryData(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#080C14]">
      {/* 1. Versett-Style Text Over Picture Hero (Dynamic) */}
      <AboutHeroVersett initialData={heroData} />

      {/* 2. Innovative Dynamic Brand Trajectory Engine (Dynamic) */}
      <InnovativeTrajectorySection initialData={trajectoryData} />

      {/* 3. Story & Philosophy (Photo + Narrative Cards, Dynamic) */}
      <AboutStorySection initialData={storyData} />

      {/* 4. Leadership & Culture */}
      <PeopleSection />

      {/* 5. Final Call to Action */}
      <FinalCtaSection />
    </div>
  );
}

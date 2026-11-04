import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/utils/seo';
import { BusinessDetailView } from '@/components/businesses/BusinessDetailView';
import { prisma } from '@/lib/db/prisma';
import { businessVerticalDefaults } from '@/types/businessVertical';

interface BusinessVerticalPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: BusinessVerticalPageProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check known defaults
  if (businessVerticalDefaults[slug]) {
    const d = businessVerticalDefaults[slug];
    return constructMetadata({
      title: `${d.title} | Mighty Warner`,
      description: d.hero.subheadline || d.tagline,
      canonical: `/businesses/${slug}`,
    });
  }

  // 2. Check database BusinessVertical
  try {
    const dbVertical = await prisma.businessVertical.findUnique({
      where: { slug },
    });
    if (dbVertical) {
      return constructMetadata({
        title: `${dbVertical.name} | Mighty Warner`,
        description: dbVertical.subheadline || dbVertical.description || dbVertical.tagline,
        canonical: `/businesses/${slug}`,
      });
    }

    // 3. Check database SiteSection
    const heroSection = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: `business-${slug}`,
          sectionKey: 'hero',
        },
      },
    });
    if (heroSection) {
      return constructMetadata({
        title: `${heroSection.title || slug} | Mighty Warner`,
        description: heroSection.subtitle || undefined,
        canonical: `/businesses/${slug}`,
      });
    }
  } catch (err) {
    console.error(`Error generating metadata for /businesses/${slug}:`, err);
  }

  return constructMetadata({
    title: 'Business Vertical | Mighty Warner',
    canonical: `/businesses/${slug}`,
  });
}

export default async function DynamicBusinessVerticalPage({
  params,
}: BusinessVerticalPageProps) {
  const { slug } = await params;

  // Verify that the vertical exists
  let exists = Boolean(businessVerticalDefaults[slug]);

  if (!exists) {
    try {
      const [dbVertical, section] = await Promise.all([
        prisma.businessVertical.findUnique({
          where: { slug },
        }),
        prisma.siteSection.findFirst({
          where: { pageSlug: `business-${slug}` },
        }),
      ]);
      exists = Boolean(dbVertical || section);
    } catch (err) {
      console.error(`Error validating business vertical ${slug}:`, err);
    }
  }

  if (!exists) {
    notFound();
  }

  return <BusinessDetailView slug={slug} />;
}


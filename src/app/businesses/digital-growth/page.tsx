import React from 'react';
import { Metadata } from 'next';
import { getPageSEO, formatPageMetadata } from '@/lib/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { BusinessDetailView } from '@/components/businesses/BusinessDetailView';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/businesses/digital-growth');
  return formatPageMetadata(seo, {
    title: 'Digital & Growth | High-Performance Brand & SEO Engine',
    description:
      'Brand strategy, high-speed Next.js web experiences, technical SEO, and conversion optimization designed to attract high-intent buyers and turn attention into revenue.',
    canonical: '/businesses/digital-growth',
  });
}

export default function DigitalGrowthPage() {
  return (
    <>
      <CustomHeadCode path="/businesses/digital-growth" />
      <BusinessDetailView slug="digital-growth" />
    </>
  );
}

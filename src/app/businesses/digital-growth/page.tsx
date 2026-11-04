import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { BusinessDetailView } from '@/components/businesses/BusinessDetailView';

export const revalidate = 60;

export const metadata = constructMetadata({
  title: 'Digital & Growth | Make Your Business Impossible to Ignore',
  description:
    'Brand strategy, high-speed Next.js web experiences, technical SEO, and conversion optimization designed to attract high-intent buyers and turn attention into revenue.',
  canonical: '/businesses/digital-growth',
});

export default function DigitalGrowthPage() {
  return <BusinessDetailView slug="digital-growth" />;
}

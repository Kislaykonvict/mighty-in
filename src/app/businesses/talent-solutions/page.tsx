import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { BusinessDetailView } from '@/components/businesses/BusinessDetailView';

export const revalidate = 60;

export const metadata = constructMetadata({
  title: 'Talent Solutions | Build the Team Behind the Business',
  description:
    'Dedicated engineering pods, contingent technical staffing, direct hire executive recruitment, and embedded talent acquisition for ambitious technology companies.',
  canonical: '/businesses/talent-solutions',
});

export default function TalentSolutionsPage() {
  return <BusinessDetailView slug="talent-solutions" />;
}

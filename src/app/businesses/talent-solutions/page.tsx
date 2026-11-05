import React from 'react';
import { Metadata } from 'next';
import { getPageSEO, formatPageMetadata } from '@/lib/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { BusinessDetailView } from '@/components/businesses/BusinessDetailView';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/businesses/talent-solutions');
  return formatPageMetadata(seo, {
    title: 'Talent Solutions | Build the Team Behind the Business',
    description:
      'Dedicated engineering pods, contingent technical staffing, direct hire executive recruitment, and embedded talent acquisition for ambitious technology companies.',
    canonical: '/businesses/talent-solutions',
  });
}

export default function TalentSolutionsPage() {
  return (
    <>
      <CustomHeadCode path="/businesses/talent-solutions" />
      <BusinessDetailView slug="talent-solutions" />
    </>
  );
}

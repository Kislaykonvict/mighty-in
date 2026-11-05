import React from 'react';
import { Metadata } from 'next';
import { getPageSEO, formatPageMetadata } from '@/lib/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { BusinessDetailView } from '@/components/businesses/BusinessDetailView';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/businesses/technology');
  return formatPageMetadata(seo, {
    title: 'Technology & Custom Software | Build the Systems You Need Next',
    description:
      'Full-stack web application engineering, custom enterprise platforms, high-throughput microservices, API integrations, and workflow automation.',
    canonical: '/businesses/technology',
  });
}

export default function TechnologyPage() {
  return (
    <>
      <CustomHeadCode path="/businesses/technology" />
      <BusinessDetailView slug="technology" />
    </>
  );
}

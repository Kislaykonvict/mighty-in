import React from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { BusinessDetailView } from '@/components/businesses/BusinessDetailView';

export const revalidate = 60;

export const metadata = constructMetadata({
  title: 'Technology & Custom Software | Build the Systems You Need Next',
  description:
    'Full-stack web application engineering, custom enterprise platforms, high-throughput microservices, API integrations, and workflow automation.',
  canonical: '/businesses/technology',
});

export default function TechnologyPage() {
  return <BusinessDetailView slug="technology" />;
}

import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPolicyPage } from '@/lib/policies';
import { PolicyPageView } from '@/components/policies/PolicyPageView';
import { constructMetadata } from '@/lib/utils/seo';

export const revalidate = 60; // Incremental Static Regeneration

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPolicyPage('disclaimer');
  if (!page) {
    return constructMetadata({
      title: 'Disclaimer | Mighty Warner',
      description: 'Official legal disclaimer for Mighty Warner digital and technology platforms.',
      canonical: '/disclaimer',
    });
  }

  return constructMetadata({
    title: page.metaTitle || `${page.title} | Mighty Warner`,
    description: page.metaDescription || 'Official legal disclaimer for Mighty Warner digital and technology platforms.',
    canonical: '/disclaimer',
  });
}

export default async function DisclaimerPage() {
  const page = await getPolicyPage('disclaimer');

  if (!page || !page.isActive) {
    notFound();
  }

  return <PolicyPageView page={page} />;
}

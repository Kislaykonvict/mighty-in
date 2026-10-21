import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPolicyPage } from '@/lib/policies';
import { PolicyPageView } from '@/components/policies/PolicyPageView';
import { constructMetadata } from '@/lib/utils/seo';

export const revalidate = 60; // Incremental Static Regeneration

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPolicyPage('terms-and-conditions');
  if (!page) {
    return constructMetadata({
      title: 'Terms and Conditions | Mighty Warner',
      description: 'Official Terms and Conditions governing use of Mighty Warner services and solutions.',
      canonical: '/terms-and-conditions',
    });
  }

  return constructMetadata({
    title: page.metaTitle || `${page.title} | Mighty Warner`,
    description: page.metaDescription || 'Official Terms and Conditions governing use of Mighty Warner services and solutions.',
    canonical: '/terms-and-conditions',
  });
}

export default async function TermsAndConditionsPage() {
  const page = await getPolicyPage('terms-and-conditions');

  if (!page || !page.isActive) {
    notFound();
  }

  return <PolicyPageView page={page} />;
}

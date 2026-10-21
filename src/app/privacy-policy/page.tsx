import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPolicyPage } from '@/lib/policies';
import { PolicyPageView } from '@/components/policies/PolicyPageView';
import { constructMetadata } from '@/lib/utils/seo';

export const revalidate = 60; // Incremental Static Regeneration

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPolicyPage('privacy-policy');
  if (!page) {
    return constructMetadata({
      title: 'Privacy Policy | Mighty Warner',
      description: 'Official Privacy Policy detailing how Mighty Warner protects and processes your data.',
      canonical: '/privacy-policy',
    });
  }

  return constructMetadata({
    title: page.metaTitle || `${page.title} | Mighty Warner`,
    description: page.metaDescription || 'Official Privacy Policy detailing how Mighty Warner protects and processes your data.',
    canonical: '/privacy-policy',
  });
}

export default async function PrivacyPolicyPage() {
  const page = await getPolicyPage('privacy-policy');

  if (!page || !page.isActive) {
    notFound();
  }

  return <PolicyPageView page={page} />;
}

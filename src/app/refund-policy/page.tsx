import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPolicyPage } from '@/lib/policies';
import { PolicyPageView } from '@/components/policies/PolicyPageView';
import { constructMetadata } from '@/lib/utils/seo';

export const revalidate = 60; // Incremental Static Regeneration

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPolicyPage('refund-policy');
  if (!page) {
    return constructMetadata({
      title: 'Refund Policy | Mighty Warner',
      description: 'Official Refund and Cancellation Policy for Mighty Warner services.',
      canonical: '/refund-policy',
    });
  }

  return constructMetadata({
    title: page.metaTitle || `${page.title} | Mighty Warner`,
    description: page.metaDescription || 'Official Refund and Cancellation Policy for Mighty Warner services.',
    canonical: '/refund-policy',
  });
}

export default async function RefundPolicyPage() {
  const page = await getPolicyPage('refund-policy');

  if (!page || !page.isActive) {
    notFound();
  }

  return <PolicyPageView page={page} />;
}

import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { FaqAccordionClient } from './FaqAccordionClient';
import { FaqItemData } from '@/types/faq';

export interface FaqSectionProps {
  pageSlug: string;
  badge?: string;
  title?: string;
  highlightedTitle?: string;
  subtitle?: string;
  includeGlobal?: boolean;
  className?: string;
}

export async function FaqSection({
  pageSlug,
  badge = 'CLEAR ANSWERS • ZERO AMBIGUITY',
  title = 'Frequently Asked',
  highlightedTitle = 'Questions.',
  subtitle = 'Everything you need to know about our execution model, technical standards, and commercial partnership.',
  includeGlobal = true,
  className = '',
}: FaqSectionProps) {
  let faqs: FaqItemData[] = [];

  try {
    const records = await prisma.faqItem.findMany({
      where: {
        isActive: true,
        OR: [
          { pageSlug },
          ...(includeGlobal && pageSlug !== 'global' ? [{ pageSlug: 'global' }] : []),
        ],
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    faqs = records.map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      pageSlug: r.pageSlug || 'global',
      category: r.category || 'general',
      order: r.order,
      isActive: r.isActive,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error(`[FaqSection] Error loading FAQs for page ${pageSlug}:`, error);
    return null;
  }

  // Gracefully render nothing if no FAQs exist for this page
  if (faqs.length === 0) {
    return null;
  }

  // Build Google FAQPage structured JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section
      className={`py-20 sm:py-28 bg-[#DBDBDB] dark:bg-[#080C14] relative overflow-hidden transition-colors duration-200 ${className}`}
    >
      {/* Google FAQPage JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <SectionContainer width="default" paddingY="none" className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          {badge && (
            <Badge variant="subtle" dot className="mb-2">
              {badge}
            </Badge>
          )}

          <h2 className="text-display-h2 font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}{' '}
            {highlightedTitle && (
              <span className="gradient-text-brand">{highlightedTitle}</span>
            )}
          </h2>

          {subtitle && (
            <p className="text-body-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion Component */}
        <div className="max-w-4xl mx-auto">
          <FaqAccordionClient faqs={faqs} />
        </div>
      </SectionContainer>
    </section>
  );
}

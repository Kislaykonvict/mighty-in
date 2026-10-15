import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { constructMetadata } from '@/lib/utils/seo';
import { insightsData } from '@/data/insights';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatters';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

export const metadata = constructMetadata({
  title: 'Insights & Thought Leadership',
  description:
    'Strategic insights, engineering architectures, and growth playbooks by Mighty Warner leadership and practitioners.',
  canonical: '/insights',
});

export default function InsightsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-20 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />
        <SectionContainer width="default" paddingY="none">
          <Badge variant="subtle" dot className="mb-4">
            PERSPECTIVES & PLAYBOOKS
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Thinking beyond the <span className="gradient-text-brand">next campaign.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl leading-relaxed mb-4">
            Deep dives into enterprise architecture, brand positioning moats, conversion mechanics, and talent pod scaling.
          </p>
        </SectionContainer>
      </section>

      {/* Articles Grid */}
      <SectionContainer width="default" paddingY="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insightsData.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-[#0F1626] border border-white/8 hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="subtle" dot>
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3">
                    <span>{formatDate(item.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
                    <Link href={`/insights/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {item.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 pt-2">
                <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    By <strong className="text-slate-200">{item.author.name}</strong>
                  </span>

                  <Link
                    href={`/insights/${item.slug}`}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      <FinalCtaSection />
    </div>
  );
}

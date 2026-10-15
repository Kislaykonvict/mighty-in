'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { insightsData } from '@/data/insights';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/formatters';

export function InsightsPreviewSection() {
  const featured = insightsData[0];
  const supporting = insightsData.slice(1, 3);

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Growth':
        return 'growth';
      case 'Technology':
        return 'tech';
      case 'Talent':
        return 'talent';
      default:
        return 'subtle';
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#080C14] relative border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            eyebrow="PERSPECTIVES & THOUGHT LEADERSHIP"
            badgeVariant="subtle"
            title="Thinking beyond the next campaign."
            subtitle="Deep architectural analysis, growth strategies, and leadership playbooks written by our practitioners."
            className="mb-0 max-w-2xl"
          />

          <Button
            href="/insights"
            variant="outline"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            All Insights
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Article */}
          {featured && (
            <div className="lg:col-span-7 group rounded-3xl bg-[#0F1626] border border-white/8 hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4">
                  <Badge variant={getCategoryBadgeVariant(featured.category) as any} dot>
                    {featured.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3">
                    <span>{formatDate(featured.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
                    <Link href={`/insights/${featured.slug}`}>
                      {featured.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-400">
                    By <span className="text-slate-200">{featured.author.name}</span>
                  </div>

                  <Link
                    href={`/insights/${featured.slug}`}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Articles Stack */}
          <div className="lg:col-span-5 space-y-6">
            {supporting.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0F1626] border border-white/8 hover:border-white/20 transition-all group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={getCategoryBadgeVariant(item.category) as any} dot size="sm">
                      {item.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.readTime}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    <Link href={`/insights/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">
                    {formatDate(item.publishedAt)}
                  </span>
                  <Link
                    href={`/insights/${item.slug}`}
                    className="font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

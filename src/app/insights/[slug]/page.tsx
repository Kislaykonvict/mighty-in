import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock, Calendar, CheckCircle2, User, Share2 } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { insightsData } from '@/data/insights';
import { constructDynamicMetadata } from '@/lib/utils/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/formatters';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';

interface InsightArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return insightsData.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: InsightArticlePageProps): Promise<Metadata> {
  const article = insightsData.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Article Not Found' };

  let dbInsight = null;
  try {
    dbInsight = await prisma.insight.findUnique({
      where: { slug: params.slug },
      select: {
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        canonicalUrl: true,
      },
    });
  } catch (e) {
    // Fallback if db offline or during static build
  }

  const fallbackKeywords = dbInsight?.metaKeywords
    ? dbInsight.metaKeywords.split(',').map((k) => k.trim())
    : undefined;

  return constructDynamicMetadata(`/insights/${article.slug}`, {
    title: dbInsight?.metaTitle || `${article.title} | Mighty Warner Insights`,
    description: dbInsight?.metaDescription || article.excerpt,
    canonical: dbInsight?.canonicalUrl || `/insights/${article.slug}`,
    keywords: fallbackKeywords,
    ogImage: article.coverImage,
  });
}

export default async function InsightArticlePage({ params }: InsightArticlePageProps) {
  const article = insightsData.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  let dbHeadCode: string | null = null;
  try {
    const dbInsight = await prisma.insight.findUnique({
      where: { slug: params.slug },
      select: { headCode: true },
    });
    dbHeadCode = dbInsight?.headCode || null;
  } catch (e) {
    // Fallback gracefully
  }

  const related = insightsData
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Custom Head Scripts, Meta Tags & Schema (Head Code) */}
      <CustomHeadCode path={`/insights/${article.slug}`} rawHeadCode={dbHeadCode} />

      {/* Article Header */}
      <section className="pt-12 pb-16 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <SectionContainer width="narrow" paddingY="none">
          <div className="mb-6">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all insights</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="subtle" dot>
              {article.category}
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              {formatDate(article.publishedAt)} • {article.readTime}
            </span>
          </div>

          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-6">
            {article.title}
          </h1>

          <p className="text-body-lg text-slate-300 leading-relaxed mb-8">
            {article.subtitle}
          </p>

          {/* Author Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F1626] border border-white/8">
            {article.author.avatarUrl && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                <Image
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-white">{article.author.name}</div>
              <div className="text-xs text-slate-400">{article.author.role}</div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Hero Cover Image */}
      <section className="py-8 bg-[#060910]">
        <SectionContainer width="narrow" paddingY="none">
          <div className="relative h-[320px] sm:h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </SectionContainer>
      </section>

      {/* Key Takeaways Box */}
      <SectionContainer width="narrow" paddingY="sm">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-sky-500/25 shadow-xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
            KEY EXECUTIVE TAKEAWAYS
          </div>
          <div className="space-y-2.5">
            {article.keyTakeaways.map((takeaway) => (
              <div key={takeaway} className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Article Content Paragraphs */}
      <SectionContainer width="narrow" paddingY="sm">
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
          {article.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="pt-10 mt-10 border-t border-white/10 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </SectionContainer>

      {/* Related Reading */}
      {related.length > 0 && (
        <section className="py-16 bg-[#060A12] border-t border-white/8 mt-12">
          <SectionContainer width="default" paddingY="none">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Related Perspectives</h3>
              <Link href="/insights" className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1">
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((item) => (
                <div key={item.id} className="p-6 rounded-2xl bg-[#0F1626] border border-white/8">
                  <span className="text-xs font-mono text-slate-400 block mb-2">{item.category} • {item.readTime}</span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    <Link href={`/insights/${item.slug}`} className="hover:text-sky-300 transition-colors">
                      {item.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4">{item.excerpt}</p>
                  <Link href={`/insights/${item.slug}`} className="text-xs font-bold text-sky-400 flex items-center gap-1">
                    <span>Read article</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </SectionContainer>
        </section>
      )}

      <FinalCtaSection />
    </div>
  );
}

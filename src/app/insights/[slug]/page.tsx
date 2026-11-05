import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { insightsData } from '@/data/insights';
import { constructDynamicMetadata } from '@/lib/utils/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import MightyBlogDetail, { DetailedInsightArticle } from '@/components/blog/MightyBlogDetail';

interface InsightArticlePageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const dbArticles = await prisma.insight.findMany({
      select: { slug: true },
    });
    if (dbArticles.length > 0) {
      return dbArticles.map((a) => ({ slug: a.slug }));
    }
  } catch {
    // Fallback if db is offline at build time
  }
  return insightsData.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: InsightArticlePageProps): Promise<Metadata> {
  let dbArticle: any = null;
  try {
    dbArticle = await prisma.insight.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {
    // Fallback
  }

  const fallback = insightsData.find((a) => a.slug === params.slug);
  const article = dbArticle || fallback;

  if (!article) {
    return { title: 'Article Not Found | Mighty Warner' };
  }

  const titleWithAccent = article.titleAccent
    ? `${article.title} ${article.titleAccent}`
    : article.title;

  const fallbackKeywords = article.metaKeywords
    ? article.metaKeywords.split(',').map((k: string) => k.trim())
    : Array.isArray(article.tags)
    ? article.tags
    : undefined;

  return constructDynamicMetadata(`/insights/${article.slug}`, {
    title: article.metaTitle || `${titleWithAccent} | The Mighty Blog`,
    description: article.metaDescription || article.excerpt,
    canonical: article.canonicalUrl || `/insights/${article.slug}`,
    keywords: fallbackKeywords,
    ogImage: article.coverImage,
  });
}

export default async function InsightArticlePage({ params }: InsightArticlePageProps) {
  let dbArticle: any = null;
  try {
    dbArticle = await prisma.insight.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {
    // Fallback
  }

  const fallback = insightsData.find((a) => a.slug === params.slug);
  const rawArticle = dbArticle || fallback;

  if (!rawArticle) {
    notFound();
  }

  // Normalize article structure
  const article: DetailedInsightArticle = {
    id: rawArticle.id,
    slug: rawArticle.slug,
    title: rawArticle.title,
    titleAccent: rawArticle.titleAccent || null,
    subtitle: rawArticle.subtitle || null,
    category: rawArticle.category,
    readTime: rawArticle.readTime,
    publishedAt: rawArticle.publishedAt,
    authorName: rawArticle.authorName || rawArticle.author?.name || 'Team Mighty Warner',
    authorRole: rawArticle.authorRole || rawArticle.author?.role || null,
    authorAvatar: rawArticle.authorAvatar || rawArticle.author?.avatarUrl || null,
    coverImage: rawArticle.coverImage,
    excerpt: rawArticle.excerpt,
    content: rawArticle.content,
    keyTakeaways: rawArticle.keyTakeaways,
    tags: rawArticle.tags,
  };

  return (
    <div className="w-full pt-[76px] sm:pt-[84px] bg-[#DBDBDB] dark:bg-[#080C14] transition-colors duration-200">
      {/* Custom Head Scripts, Meta Tags & Schema (Head Code) */}
      <CustomHeadCode path={`/insights/${article.slug}`} rawHeadCode={rawArticle.headCode || null} />

      {/* Shared Blog Detail View */}
      <MightyBlogDetail article={article} />
    </div>
  );
}

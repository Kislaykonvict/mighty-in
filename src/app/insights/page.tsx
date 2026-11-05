import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { insightsData } from '@/data/insights';
import { getPageSEO, formatPageMetadata } from '@/lib/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import MightyBlog, { BlogPostItem } from '@/components/blog/MightyBlog';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/insights');
  return formatPageMetadata(seo, {
    title: 'The Mighty Blog | Insights & Thought Leadership',
    description: 'A practical look at how SEO, performance ads, engineering, and brand strategy work together to drive compounding growth.',
    canonical: '/insights',
  });
}

export default async function InsightsPage() {
  let posts: BlogPostItem[] = [];

  try {
    const dbPosts = await prisma.insight.findMany({
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
      ],
    });

    if (dbPosts && dbPosts.length > 0) {
      posts = dbPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        category: p.category,
        title: p.title,
        titleAccent: p.titleAccent,
        excerpt: p.excerpt,
        publishedAt: p.publishedAt,
        readTime: p.readTime,
        coverImage: p.coverImage,
        featured: p.featured,
        tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
      }));
    }
  } catch (err) {
    console.error('Error fetching insights from DB:', err);
  }

  // Fallback to static insightsData if DB was empty
  if (posts.length === 0) {
    posts = insightsData.map((p) => ({
      id: p.id,
      slug: p.slug,
      category: p.category,
      title: p.title,
      titleAccent: null,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      readTime: p.readTime,
      coverImage: p.coverImage,
      featured: p.featured,
      tags: p.tags,
    }));
  }

  // Extract categories (prioritize official taxonomy from siteSection)
  let categories: string[] = [];
  try {
    const catSection = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'insights',
          sectionKey: 'categories',
        },
      },
    });
    if (catSection && Array.isArray((catSection.content as any)?.categories)) {
      categories = (catSection.content as any).categories;
    }
  } catch (err) {
    console.error('Error fetching insight categories:', err);
  }

  if (categories.length === 0) {
    categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  }

  return (
    <div className="w-full pt-[76px] sm:pt-[84px] bg-[#DBDBDB] dark:bg-[#080C14] transition-colors duration-200">
      <CustomHeadCode path="/insights" />
      <MightyBlog
        initialPosts={posts}
        allCategories={categories}
        title="The Mighty"
        titleAccent="Blog"
      />
    </div>
  );
}

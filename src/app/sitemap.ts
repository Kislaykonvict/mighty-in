import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db/prisma';
import { insightsData } from '@/data/insights';
import { businessesData } from '@/data/businesses';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mightywarner.com';
  const currentDate = new Date().toISOString();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/work`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/approach`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/assessment`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/growth-lab`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
  ];

  try {
    const [dbVerticals, dbInsights] = await Promise.all([
      prisma.businessVertical.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.insight.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const sitemapMap = new Map<string, MetadataRoute.Sitemap[number]>();

    for (const r of staticRoutes) {
      sitemapMap.set(r.url, r);
    }

    // Dynamic Business Verticals
    const verticals = dbVerticals.length > 0 ? dbVerticals : businessesData;
    for (const b of verticals) {
      const url = `${baseUrl}/businesses/${b.slug}`;
      sitemapMap.set(url, {
        url,
        lastModified: 'updatedAt' in b && b.updatedAt ? (b.updatedAt as Date).toISOString() : currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }

    // Dynamic Insights
    const insights = dbInsights.length > 0 ? dbInsights : insightsData;
    for (const ins of insights) {
      const url = `${baseUrl}/insights/${ins.slug}`;
      sitemapMap.set(url, {
        url,
        lastModified: 'updatedAt' in ins && ins.updatedAt ? (ins.updatedAt as Date).toISOString() : currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    return Array.from(sitemapMap.values());
  } catch (error) {
    console.error('Error generating dynamic sitemap from database:', error);

    const businessRoutes: MetadataRoute.Sitemap = businessesData.map((b) => ({
      url: `${baseUrl}/businesses/${b.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    const insightRoutes: MetadataRoute.Sitemap = insightsData.map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...businessRoutes, ...insightRoutes];
  }
}

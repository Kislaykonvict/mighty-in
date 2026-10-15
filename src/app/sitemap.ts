import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db/prisma';
import { projectsData } from '@/data/projects';
import { insightsData } from '@/data/insights';
import { businessesData } from '@/data/businesses';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mightywarner.com';
  const currentDate = new Date().toISOString();

  try {
    const [seoPages, dbProjects, dbInsights] = await Promise.all([
      prisma.pageSeo.findMany({ where: { noIndex: false } }),
      prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.insight.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    const sitemapMap = new Map<string, MetadataRoute.Sitemap[number]>();

    // 1. Add PageSeo records
    for (const p of seoPages) {
      let priority = 0.8;
      if (p.path === '/') priority = 1.0;
      else if (p.path.startsWith('/businesses') || p.path === '/contact') priority = 0.9;
      else if (p.path.startsWith('/work')) priority = 0.85;

      const url = `${baseUrl}${p.path === '/' ? '' : p.path}`;
      sitemapMap.set(url, {
        url,
        lastModified: p.updatedAt ? p.updatedAt.toISOString() : currentDate,
        changeFrequency: 'weekly',
        priority,
      });
    }

    // 2. Add projects (if not already defined in PageSeo)
    for (const proj of dbProjects) {
      const url = `${baseUrl}/work/${proj.slug}`;
      if (!sitemapMap.has(url)) {
        sitemapMap.set(url, {
          url,
          lastModified: proj.updatedAt ? proj.updatedAt.toISOString() : currentDate,
          changeFrequency: 'weekly',
          priority: 0.85,
        });
      }
    }

    // 3. Add insights (if not already defined in PageSeo)
    for (const ins of dbInsights) {
      const url = `${baseUrl}/insights/${ins.slug}`;
      if (!sitemapMap.has(url)) {
        sitemapMap.set(url, {
          url,
          lastModified: ins.updatedAt ? ins.updatedAt.toISOString() : currentDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }

    if (sitemapMap.size > 0) {
      return Array.from(sitemapMap.values());
    }
  } catch (error) {
    console.error('Error fetching dynamic sitemap from database:', error);
  }

  // Fallback if DB is unavailable
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/businesses`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/approach`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/assessment`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/growth-lab`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
  ];

  const businessRoutes: MetadataRoute.Sitemap = businessesData.map((b) => ({
    url: `${baseUrl}/businesses/${b.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectsData.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const insightRoutes: MetadataRoute.Sitemap = insightsData.map((i) => ({
    url: `${baseUrl}/insights/${i.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...businessRoutes, ...projectRoutes, ...insightRoutes];
}

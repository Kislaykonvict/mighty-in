import { prisma } from '@/lib/db/prisma';
import { defaultPolicyPages } from '@/data/defaultPolicyPages';
import { PolicyPageData } from '@/types/policyPage';

export async function getPolicyPage(slug: string): Promise<PolicyPageData | null> {
  try {
    const page = await prisma.policyPage.findUnique({
      where: { slug },
    });

    if (page) {
      return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        heroImage: page.heroImage,
        heroTitle: page.heroTitle,
        heroSubtitle: page.heroSubtitle,
        heroBadge: page.heroBadge,
        content: page.content,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        isActive: page.isActive,
        order: page.order,
        updatedAt: page.updatedAt,
        createdAt: page.createdAt,
      };
    }

    // Fallback to default if not yet seeded in DB
    const defaultData = defaultPolicyPages[slug];
    if (defaultData) {
      // Try to seed into DB asynchronously for subsequent calls
      try {
        const created = await prisma.policyPage.create({
          data: {
            slug: defaultData.slug,
            title: defaultData.title,
            heroImage: defaultData.heroImage,
            heroTitle: defaultData.heroTitle,
            heroSubtitle: defaultData.heroSubtitle,
            heroBadge: defaultData.heroBadge,
            content: defaultData.content,
            metaTitle: defaultData.metaTitle,
            metaDescription: defaultData.metaDescription,
            isActive: defaultData.isActive,
            order: defaultData.order ?? 0,
          },
        });
        return {
          id: created.id,
          ...defaultData,
          updatedAt: created.updatedAt,
          createdAt: created.createdAt,
        };
      } catch {
        // If DB creation fails or race condition, return defaultData
        return defaultData;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching policy page for slug '${slug}':`, error);
    return defaultPolicyPages[slug] || null;
  }
}

export async function getAllPolicyPages(): Promise<PolicyPageData[]> {
  const slugs = ['terms-and-conditions', 'disclaimer', 'privacy-policy', 'refund-policy'];
  const pages: PolicyPageData[] = [];

  for (const slug of slugs) {
    const page = await getPolicyPage(slug);
    if (page) {
      pages.push(page);
    }
  }

  return pages;
}

import { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { siteConfig } from '@/config/site';

export interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  keywords = [
    'Mighty Warner',
    'Digital Agency',
    'Technology Consulting',
    'Talent Solutions',
    'Web Development',
    'Digital Growth',
    'Software Engineering',
    'B2B Enterprise',
  ],
  canonical,
  ogImage = siteConfig.ogImage,
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | Build. Grow. Scale.`;
  const url = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@mightywarner',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

/**
 * Fetch dynamic SEO record for any path from Neon PostgreSQL database
 */
export async function getDynamicPageSeo(path: string) {
  try {
    return await prisma.pageSeo.findUnique({
      where: { path },
    });
  } catch (error) {
    console.error(`Error fetching dynamic SEO for path ${path}:`, error);
    return null;
  }
}

/**
 * Construct Next.js Metadata dynamically from Neon DB PageSeo record
 */
export async function constructDynamicMetadata(path: string, fallback?: MetadataProps): Promise<Metadata> {
  const seo = await getDynamicPageSeo(path);

  if (!seo) {
    return constructMetadata(fallback);
  }

  const metaTitle = seo.metaTitle || (fallback?.title ? `${fallback.title} | ${siteConfig.name}` : siteConfig.name);
  const metaDescription = seo.metaDescription || fallback?.description || siteConfig.description;
  const canonical = seo.canonicalUrl || (fallback?.canonical ? `${siteConfig.url}${fallback.canonical}` : `${siteConfig.url}${path}`);
  const ogImage = seo.ogImage || fallback?.ogImage || siteConfig.ogImage;

  const keywordsArray = seo.metaKeywords
    ? seo.metaKeywords.split(',').map((k) => k.trim())
    : fallback?.keywords || [];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywordsArray,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.ogTitle || metaTitle,
      description: seo.ogDescription || metaDescription,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || metaTitle,
      description: seo.ogDescription || metaDescription,
      images: [ogImage],
      creator: '@mightywarner',
    },
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
      googleBot: {
        index: !seo.noIndex,
        follow: !seo.noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

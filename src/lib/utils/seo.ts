import { Metadata } from 'next';
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
 * Kept for backward compatibility. Returns null as PageSeo has been removed.
 */
export async function getDynamicPageSeo(_path: string) {
  return null;
}

/**
 * Construct Next.js Metadata dynamically using fallback props
 */
export async function constructDynamicMetadata(_path: string, fallback?: MetadataProps): Promise<Metadata> {
  return constructMetadata(fallback);
}

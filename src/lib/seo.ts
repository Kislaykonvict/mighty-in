import { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { siteConfig } from '@/config/site';

export interface PageSeo {
  id?: string;
  pageRoute: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  metaImage: string;
  canonicalUrl: string;
  customHeadScripts: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export const DEFAULT_PAGE_SEO_DATA: PageSeo[] = [
  {
    pageRoute: '/',
    pageName: 'Homepage',
    metaTitle: 'Mighty Warner | Strategy • Technology • Talent Solutions',
    metaDescription:
      'Mighty Warner unites Digital & Growth, Technology, and Talent Solutions under one connected ecosystem. Discover how we build brands, software platforms, and elite engineering teams.',
    metaKeywords: [
      'Mighty Warner',
      'Digital Growth',
      'Custom Software Development',
      'Talent Solutions',
      'Engineering Pods',
      'Enterprise Tech',
      'Performance Marketing',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/`,
    customHeadScripts: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Mighty Warner",
  "url": "https://mightywarner.com",
  "logo": "https://mightywarner.com/images/mw-logo.webp",
  "foundingDate": "2013",
  "description": "One company. Multiple ways to move your business forward."
}
</script>`,
  },
  {
    pageRoute: '/about',
    pageName: 'About Us',
    metaTitle: 'About Us | Building Businesses Since 2013 | Mighty Warner',
    metaDescription:
      "Learn about Mighty Warner's journey from inception in 2013 to a global multi-disciplinary commercial partner across North America, EMEA, and APAC.",
    metaKeywords: [
      'About Mighty Warner',
      'Leadership',
      'Company History',
      'Global Offices',
      'Executive Team',
      'Digital Transformation',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/about`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/work',
    pageName: 'Selected Work & Portfolio',
    metaTitle: 'Selected Work & Case Studies | Mighty Warner Portfolio',
    metaDescription:
      'Verified client case studies across fintech, enterprise SaaS, logistics, and digital commerce. Proven ROI, performance lifts, and architectural triumphs.',
    metaKeywords: [
      'Case Studies',
      'Client Portfolio',
      'Digital Transformation',
      'Software Case Studies',
      'Fintech',
      'E-commerce',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/work`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/approach',
    pageName: 'Our Approach & Methodology',
    metaTitle: 'Our Methodology & Approach | The Mighty Warner Method',
    metaDescription:
      'Explore our battle-tested 5-stage framework (Discover, Define, Build, Activate, Optimize) designed to de-risk investments and compound commercial velocity.',
    metaKeywords: [
      'Mighty Warner Method',
      'Growth Framework',
      'Product Strategy',
      'Software Architecture',
      'Agile Delivery',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/approach`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/businesses/digital-growth',
    pageName: 'Digital & Growth Vertical',
    metaTitle: 'Digital & Growth | High-Performance Brand & SEO Engine | Mighty Warner',
    metaDescription:
      'Make your business impossible to ignore with category-defining brand identity, Next.js web applications, authority SEO, and paid performance.',
    metaKeywords: [
      'Brand Strategy',
      'Web Design & Dev',
      'SEO Topic Clusters',
      'CRO',
      'Performance Paid Ads',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/businesses/digital-growth`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/businesses/technology',
    pageName: 'Technology & Software Vertical',
    metaTitle: 'Technology & Software Platforms | Scalable Web Architecture | Mighty Warner',
    metaDescription:
      'Engineer scalable web applications, event-driven microservices, API integrations, and cloud platforms with sub-second performance.',
    metaKeywords: [
      'Custom Software',
      'Web Apps',
      'Microservices',
      'Cloud Architecture',
      'API Integrations',
      'Next.js',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/businesses/technology`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/businesses/talent-solutions',
    pageName: 'Talent Solutions Vertical',
    metaTitle: 'Talent Solutions & Engineering Pods | Direct Hire & Staffing | Mighty Warner',
    metaDescription:
      'Deploy dedicated senior engineering pods, contingent technical specialists, and executive hires to accelerate your roadmap with zero lag.',
    metaKeywords: [
      'SOW Dedicated Pods',
      'Contingent Staffing',
      'Technical Recruitment',
      'Executive Search',
      'Engineering Teams',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/businesses/talent-solutions`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/growth-lab',
    pageName: 'Interactive Growth Lab',
    metaTitle: 'Interactive Growth Lab & Simulation Engines | Mighty Warner',
    metaDescription:
      'Interactive toolset including the 90-Day Strategy Blueprint synthesizer, ROI revenue impact simulator, and persona diagnostic.',
    metaKeywords: [
      'ROI Calculator',
      '90-Day Strategy Builder',
      'Growth Simulation',
      'Interactive Tools',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/growth-lab`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/insights',
    pageName: 'Insights & Perspectives',
    metaTitle: 'Insights & Strategic Perspectives | Mighty Warner',
    metaDescription:
      'Actionable thought leadership on decoupled web architecture, organic search authority, and modern enterprise scaling.',
    metaKeywords: [
      'B2B Strategy',
      'Engineering Insights',
      'Organic Search Authority',
      'Tech Articles',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/insights`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/contact',
    pageName: 'Contact & Global Desks',
    metaTitle: 'Contact & Global Desks | Start a Conversation | Mighty Warner',
    metaDescription:
      'Connect with our executive partners in Dubai, New York, London, Singapore, and Sydney. 24-hour response guarantee.',
    metaKeywords: [
      'Contact Mighty Warner',
      'Global Offices',
      'RFP Submission',
      'Direct Inquiries',
      'Consultation',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/contact`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/assessment',
    pageName: 'Growth Diagnostic Assessment',
    metaTitle: 'Growth Diagnostic Assessment | Calculate Your Momentum Score | Mighty Warner',
    metaDescription:
      'Take our rapid diagnostic assessment to benchmark your brand positioning, software stack, and talent readiness.',
    metaKeywords: [
      'Growth Diagnostic',
      'Momentum Score',
      'Business Audit',
      'Digital Assessment',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/assessment`,
    customHeadScripts: '',
  },
  {
    pageRoute: '/faqs',
    pageName: 'Frequently Asked Questions',
    metaTitle: 'Frequently Asked Questions | Mighty Warner Knowledge Base',
    metaDescription:
      'Find answers to common questions about our digital growth strategies, custom software engineering, and dedicated talent pods.',
    metaKeywords: [
      'Mighty Warner FAQs',
      'Agency Questions',
      'Pricing Models',
      'Engagement Terms',
    ],
    metaImage: '/images/og/mighty-warner-og.jpg',
    canonicalUrl: `${siteConfig.url}/faqs`,
    customHeadScripts: '',
  },
];

/**
 * Normalize a given route string:
 * - Ensure leading slash
 * - Trim trailing slashes unless root "/"
 * - Lowercase
 */
export function normalizeRoute(route: string): string {
  if (!route) return '/';
  let cleaned = route.trim().toLowerCase();
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.replace(/\/+$/, '');
  }
  return cleaned;
}

/**
 * Generate a clean human-readable name from a route path
 */
export function formatRouteName(route: string): string {
  if (route === '/') return 'Homepage';
  const parts = route
    .split('/')
    .filter(Boolean)
    .map((p) => p.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  return parts.join(' - ');
}

/**
 * Fetch dynamic SEO record for a route from PostgreSQL.
 * If record does not exist in DB:
 * 1. Checks DEFAULT_PAGE_SEO_DATA (or creates sensible default).
 * 2. Auto-inserts the record into PostgreSQL.
 * 3. Returns the record.
 * If DB throws an error, gracefully catches it and returns the fallback in-memory object.
 */
export async function getPageSEO(route: string): Promise<PageSeo> {
  const normalized = normalizeRoute(route);

  // In-memory fallback
  const fallback =
    DEFAULT_PAGE_SEO_DATA.find((d) => d.pageRoute === normalized) || {
      pageRoute: normalized,
      pageName: formatRouteName(normalized),
      metaTitle: `${formatRouteName(normalized)} | ${siteConfig.name}`,
      metaDescription: siteConfig.description,
      metaKeywords: ['Mighty Warner', 'Digital Growth', 'Software Engineering'],
      metaImage: siteConfig.ogImage || '/og.jpg',
      canonicalUrl: `${siteConfig.url}${normalized === '/' ? '' : normalized}`,
      customHeadScripts: '',
    };

  try {
    const existing = await prisma.pageSeo.findUnique({
      where: { pageRoute: normalized },
    });

    if (existing) {
      return {
        id: existing.id,
        pageRoute: existing.pageRoute,
        pageName: existing.pageName,
        metaTitle: existing.metaTitle,
        metaDescription: existing.metaDescription,
        metaKeywords: Array.isArray(existing.metaKeywords) ? existing.metaKeywords : [],
        metaImage: existing.metaImage || '/og.jpg',
        canonicalUrl: existing.canonicalUrl,
        customHeadScripts: existing.customHeadScripts || '',
        createdAt: existing.createdAt,
        updatedAt: existing.updatedAt,
      };
    }

    // Auto-seed this route into PostgreSQL
    try {
      const created = await prisma.pageSeo.create({
        data: {
          pageRoute: fallback.pageRoute,
          pageName: fallback.pageName,
          metaTitle: fallback.metaTitle,
          metaDescription: fallback.metaDescription,
          metaKeywords: fallback.metaKeywords,
          metaImage: fallback.metaImage,
          canonicalUrl: fallback.canonicalUrl,
          customHeadScripts: fallback.customHeadScripts,
        },
      });

      return {
        id: created.id,
        pageRoute: created.pageRoute,
        pageName: created.pageName,
        metaTitle: created.metaTitle,
        metaDescription: created.metaDescription,
        metaKeywords: Array.isArray(created.metaKeywords) ? created.metaKeywords : [],
        metaImage: created.metaImage || '/og.jpg',
        canonicalUrl: created.canonicalUrl,
        customHeadScripts: created.customHeadScripts || '',
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
    } catch (insertError) {
      console.warn(`[getPageSEO] Could not auto-seed ${normalized}:`, insertError);
      return fallback;
    }
  } catch (error) {
    console.warn(`[getPageSEO] Database query failed for ${normalized}, using fallback:`, error);
    return fallback;
  }
}

/**
 * Format PageSeo record into a standard Next.js Metadata object
 */
export function formatPageMetadata(
  seo?: Partial<PageSeo> | null,
  fallback?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    noIndex?: boolean;
  }
): Metadata {
  const rawTitle =
    seo?.metaTitle?.trim() ||
    (fallback?.title ? `${fallback.title}` : siteConfig.name);

  // Use absolute title if the title already includes the brand name to avoid duplicate template suffixing
  const title = rawTitle.includes(siteConfig.name)
    ? { absolute: rawTitle }
    : rawTitle;

  const description =
    seo?.metaDescription?.trim() || fallback?.description || siteConfig.description;

  const rawKeywords =
    seo?.metaKeywords && seo.metaKeywords.length > 0
      ? seo.metaKeywords
      : fallback?.keywords || [
          'Mighty Warner',
          'Digital Agency',
          'Technology Consulting',
          'Talent Solutions',
        ];

  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords
    : String(rawKeywords).split(',').map((k) => k.trim());

  const canonical =
    seo?.canonicalUrl?.trim() ||
    (fallback?.canonical
      ? `${siteConfig.url}${fallback.canonical}`
      : `${siteConfig.url}${seo?.pageRoute && seo.pageRoute !== '/' ? seo.pageRoute : ''}`);

  const imageUrl = seo?.metaImage?.trim() || fallback?.ogImage || siteConfig.ogImage || '/og.jpg';

  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${siteConfig.url}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
    },
    openGraph: {
      title: rawTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: rawTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: rawTitle,
      description,
      images: [fullImageUrl],
      creator: '@mightywarner',
    },
    robots: {
      index: !fallback?.noIndex,
      follow: !fallback?.noIndex,
      googleBot: {
        index: !fallback?.noIndex,
        follow: !fallback?.noIndex,
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


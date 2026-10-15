import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StickyBottomCta } from '@/components/layout/StickyBottomCta';
import { GrowthTerminal } from '@/components/interactive/GrowthTerminal';
import { siteConfig } from '@/config/site';

export const viewport: Viewport = {
  themeColor: '#080C14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Strategy • Technology • Talent Solutions`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    'Mighty Warner',
    'Digital Growth',
    'Custom Software Development',
    'Talent Solutions',
    'Engineering Pods',
    'Web Application Development',
    'SEO & Performance Marketing',
    'B2B Ecosystem',
    'Staff Augmentation',
  ],
  authors: [{ name: 'Mighty Warner Inc.' }],
  creator: 'Mighty Warner',
  publisher: 'Mighty Warner',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `${siteConfig.name} | Strategy • Technology • Talent Solutions`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Connected Business Ecosystem`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Strategy • Technology • Talent Solutions`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@mightywarner',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/mw-logo.webp`,
    foundingDate: '2013',
    description: siteConfig.description,
    sameAs: [siteConfig.links.linkedin, siteConfig.links.twitter],
    knowsAbout: [
      'Digital Strategy',
      'Web Development',
      'Software Architecture',
      'Contingent Staffing',
      'Direct Hire',
      'Search Engine Optimization',
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#080C14] text-[#F8FAFC] antialiased selection:bg-sky-500/30 selection:text-white flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
        <StickyBottomCta />
        <GrowthTerminal />
      </body>
    </html>
  );
}

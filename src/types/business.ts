export type BusinessVerticalId = 'digital-growth' | 'technology' | 'talent-solutions';

export interface ServiceItem {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  deliverables?: string[];
  technologies?: string[];
  iconName?: string;
}

export interface BusinessVertical {
  id: BusinessVerticalId;
  slug: string;
  name: string;
  pillarHeadline: string; // e.g., "Build a brand"
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  themeColor: 'growth' | 'tech' | 'talent';
  accentHex: string;
  gradient: string;
  bgGradient: string;
  heroImage: string;
  audiences?: {
    label: string;
    description: string;
    ctaText: string;
    ctaHref: string;
  }[];
  services: ServiceItem[];
  outcomes: {
    metric: string;
    label: string;
    context: string;
  }[];
  featuredProjectSlugs: string[];
  coreCapabilities: string[];
}

export interface CoreBusinessCard {
  id: string;
  indexNumber: string; // e.g. "01", "02", "03"
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string | null;
  diagramType?: 'sitemap' | 'flowchart' | 'network' | 'custom';
}

export interface CoreBusinessData {
  title: string; // Main top headline, e.g. "CORE BUSINESSES"
  badge?: string; // Optional eyebrow badge
  subtitle?: string; // Optional subtitle
  cards: CoreBusinessCard[];
  isActive: boolean;
}

export const defaultCoreBusinessData: CoreBusinessData = {
  title: 'CORE BUSINESSES',
  badge: '',
  subtitle: '',
  isActive: true,
  cards: [
    {
      id: 'digital-growth',
      indexNumber: '01',
      title: 'Digital & Growth',
      description:
        'Make your business impossible to ignore with brand repositioning, high-speed modern web experiences, aggressive organic SEO, and ROI-positive customer acquisition funnels.',
      ctaText: 'more information',
      ctaLink: '/businesses/digital-growth',
      imageUrl: null,
      diagramType: 'sitemap',
    },
    {
      id: 'technology',
      indexNumber: '02',
      title: 'Technology & Software',
      description:
        'Build the systems your business needs next. We design and deliver high-throughput cloud platforms, mission-critical web and mobile applications, microservices, and AI workflow automations.',
      ctaText: 'more information',
      ctaLink: '/businesses/technology',
      imageUrl: null,
      diagramType: 'flowchart',
    },
    {
      id: 'talent-solutions',
      indexNumber: '03',
      title: 'Talent Solutions',
      description:
        'Scale your engineering and leadership velocity with specialized contingent tech staffing, dedicated SOW engineering pods, and executive talent acquisition.',
      ctaText: 'more information',
      ctaLink: '/businesses/talent-solutions',
      imageUrl: null,
      diagramType: 'network',
    },
  ],
};

export interface BusinessHeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  imageAlt: string;
  scrollTarget: string;
  isActive?: boolean;
}

export interface BusinessPhilosophyCard {
  id: string;
  badge?: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
}

export interface BusinessPhilosophyData {
  badge?: string;
  title: string;
  subtitle: string;
  cards: BusinessPhilosophyCard[];
  isActive?: boolean;
}

export interface BusinessVerticalData {
  slug: string;
  title: string;
  tagline: string;
  hero: BusinessHeroData;
  philosophy: BusinessPhilosophyData;
  isCustom?: boolean;
}

export interface VerticalListItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  isCustom: boolean;
}

export const DEFAULT_BUSINESS_SLUGS = ['digital-growth', 'technology', 'talent-solutions'] as const;
export const BUSINESS_SLUGS = DEFAULT_BUSINESS_SLUGS;
export type BusinessSlug = string;

export function createDefaultVerticalData(
  slug: string,
  title: string,
  tagline?: string
): BusinessVerticalData {
  return {
    slug,
    title,
    tagline: tagline || `${title} solutions and engineering`,
    isCustom: true,
    hero: {
      headline: `${title}. Engineered for measurable impact.`,
      subheadline:
        tagline ||
        `Dedicated strategic solutions, custom architectures, and elite delivery pods focused on scaling ${title}.`,
      ctaText: 'Explore Our Method',
      ctaLink: '#philosophy',
      backgroundImage: '/images/about/verssett-hero-bg.jpg',
      imageAlt: `${title} strategy and delivery team at work`,
      scrollTarget: '#philosophy',
      isActive: true,
    },
    philosophy: {
      badge: 'OUR PHILOSOPHY & CRAFT',
      title: `A deliberate approach to ${title}`,
      subtitle:
        'We eliminate complexity and operational friction through high-velocity execution, human-in-the-loop systems, and deliberate product strategy.',
      isActive: true,
      cards: [
        {
          id: `${slug}-capability-1`,
          badge: '01 / ARCHITECTURE & STRATEGY',
          title: 'Strategic depth and precision execution',
          paragraphs: [
            `Every ${title} engagement begins with structural alignment to your commercial goals, eliminating wasted cycles and ensuring immediate velocity.`,
            'Our multidisciplinary squads embed directly into your workflows to deliver durable, high-impact outcomes without operational compromise.',
          ],
          image: '/images/about/story-engineer.jpg',
          imageAlt: `${title} architectural planning and delivery`,
        },
        {
          id: `${slug}-capability-2`,
          badge: '02 / UNCOMPROMISING CRAFT',
          title: 'Built for enterprise resilience and scale',
          paragraphs: [
            'We pair modern tooling with rigorous craftsmanship, ensuring every system performs reliably under real-world commercial volume.',
            'Continuous optimization and stewardship ensure long-term stability with zero technical debt.',
          ],
          image: '/images/about/story-designer.jpg',
          imageAlt: `${title} design systems and production code`,
        },
      ],
    },
  };
}

export const businessVerticalDefaults: Record<string, BusinessVerticalData> = {
  'digital-growth': {
    slug: 'digital-growth',
    title: 'Digital & Growth',
    tagline: 'Brand strategy, web development & SEO dominance',
    isCustom: false,
    hero: {
      headline: 'Make your business impossible to ignore.',
      subheadline:
        'Brand strategy, high-speed Next.js web experiences, and technical SEO designed to attract high-intent buyers and turn attention into scalable revenue.',
      ctaText: 'Explore Our Method',
      ctaLink: '#philosophy',
      backgroundImage: '/images/about/story-designer.jpg',
      imageAlt: 'Mighty Warner digital growth and brand strategy team at work',
      scrollTarget: '#philosophy',
      isActive: true,
    },
    philosophy: {
      badge: 'OUR PHILOSOPHY & CRAFT',
      title: 'A deliberate approach to digital dominance',
      subtitle:
        'We eliminate disjointed marketing tactics by aligning your positioning, web architecture, and organic demand capture into one continuous conversion engine.',
      isActive: true,
      cards: [
        {
          id: 'brand-architecture',
          badge: '01 / BRAND ARCHITECTURE',
          title: 'Positioning that commands immediate authority',
          paragraphs: [
            'From visual identity systems and voice guidelines to modular design languages, we build brand foundations that communicate enterprise credibility from the first touchpoint.',
            'Every asset is calibrated to separate you decisively from competitors, creating an undeniable market presence that attracts elite clients.',
          ],
          image: '/images/about/story-designer.jpg',
          imageAlt: 'Designer refining visual identity and brand tokens',
        },
        {
          id: 'conversion-velocity',
          badge: '02 / HIGH-VELOCITY CONVERSION',
          title: 'Web experiences engineered for extreme performance',
          paragraphs: [
            'We deploy lightning-fast Next.js digital platforms with edge rendering, frictionless user journeys, and uncompromising design craft.',
            'By marrying aesthetic beauty with data-backed conversion optimization, our platforms turn organic discovery into measurable commercial growth.',
          ],
          image: '/images/about/story-engineer.jpg',
          imageAlt: 'Software engineer building modern high-performance web experience',
        },
      ],
    },
  },
  technology: {
    slug: 'technology',
    title: 'Technology',
    tagline: 'Custom software platforms, web & mobile applications',
    isCustom: false,
    hero: {
      headline: 'Engineered for speed. Built for scale.',
      subheadline:
        'Custom software engineering, cloud architectures, and scalable web platforms crafted with zero technical debt.',
      ctaText: 'Explore Our Engineering',
      ctaLink: '#philosophy',
      backgroundImage: '/images/about/verssett-hero-bg.jpg',
      imageAlt: 'Mighty Warner software engineering architecture',
      scrollTarget: '#philosophy',
      isActive: true,
    },
    philosophy: {
      badge: 'OUR PHILOSOPHY & CRAFT',
      title: 'Clean code craftsmanship without compromise',
      subtitle:
        'We design and deploy distributed systems, mission-critical applications, and modern cloud architectures built to withstand enterprise volume.',
      isActive: true,
      cards: [
        {
          id: 'systemic-depth',
          badge: '01 / SYSTEMIC DEPTH',
          title: 'Architectures designed for resilience and velocity',
          paragraphs: [
            'We engineer custom full-stack solutions with modern TypeScript, Next.js, and containerized microservices built for high throughput and modular evolution.',
            'Our multidisciplinary engineering pods embed directly into your workflow, eliminating friction and delivering production-ready code with automated CI/CD pipelines.',
          ],
          image: '/images/about/story-engineer.jpg',
          imageAlt: 'Lead engineer analyzing cloud infrastructure and code quality',
        },
        {
          id: 'cloud-scale',
          badge: '02 / MODERN CLOUD STACK',
          title: 'Future-proof infrastructure with zero technical debt',
          paragraphs: [
            'We leverage cloud-native standards, secure multi-tenant databases, and serverless compute to deliver scalable reliability.',
            'From complex APIs to data-intensive dashboards, we build platforms that scale seamlessly alongside your business expansion.',
          ],
          image: '/images/about/verssett-hero-bg.jpg',
          imageAlt: 'Engineers discussing distributed architecture and high availability',
        },
      ],
    },
  },
  'talent-solutions': {
    slug: 'talent-solutions',
    title: 'Talent Solutions',
    tagline: 'Dedicated engineering pods, direct hire & staffing',
    isCustom: false,
    hero: {
      headline: 'Elite talent that accelerates your roadmap.',
      subheadline:
        'Vetted senior engineering squads, product leaders, and dedicated contingent talent integrated seamlessly into your workflow.',
      ctaText: 'Explore Talent Solutions',
      ctaLink: '#philosophy',
      backgroundImage: '/images/about/story-engineer.jpg',
      imageAlt: 'Senior software engineering squad collaborating in office',
      scrollTarget: '#philosophy',
      isActive: true,
    },
    philosophy: {
      badge: 'OUR PHILOSOPHY & CRAFT',
      title: 'High-caliber teams without hiring friction',
      subtitle:
        'Scale your delivery capabilities with pre-vetted specialists who execute from day one.',
      isActive: true,
      cards: [
        {
          id: 'embedded-pods',
          badge: '01 / EMBEDDED PODS',
          title: 'Autonomous squads aligned to your commercial objectives',
          paragraphs: [
            'We match you with pre-vetted software engineers, architects, and technical leads who adopt your tooling, agile rituals, and development standards immediately.',
            'Eliminate months of recruiter overhead and costly onboarding cycles with dedicated talent ready to ship mission-critical features on day one.',
          ],
          image: '/images/about/story-designer.jpg',
          imageAlt: 'Collaborative technical planning session with senior engineering squad',
        },
        {
          id: 'continuous-excellence',
          badge: '02 / CONTINUOUS EXCELLENCE',
          title: 'Rigorous vetting and ongoing quality stewardship',
          paragraphs: [
            'Top 1% technical vetting ensures every engineer brings proven architectural expertise, algorithmic rigor, and collaborative mastery.',
            'We support each squad with continuous engineering leadership, performance reviews, and proactive technical oversight.',
          ],
          image: '/images/about/story-engineer.jpg',
          imageAlt: 'Technical squad reviewing architecture and deployment metrics',
        },
      ],
    },
  },
};

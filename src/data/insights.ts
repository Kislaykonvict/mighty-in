import { Insight } from '@/types/insight';

export const insightsData: Insight[] = [
  {
    id: 'i-ecosystem-advantage',
    slug: 'the-ecosystem-advantage-why-isolated-agencies-fail-modern-b2b',
    title: 'The Ecosystem Advantage: Why Isolated Agencies Fail Modern B2B Companies',
    subtitle: 'When brand strategy, software engineering, and talent acquisition operate in silos, growth stalls.',
    category: 'Business',
    verticalId: 'digital-growth',
    readTime: '6 min read',
    publishedAt: '2024-09-15',
    author: {
      name: 'Alexander Warner',
      role: 'Founding Partner & Strategic Director',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'The modern enterprise cannot afford to have marketing agencies that don’t understand system architecture or software engineers detached from commercial conversion goals.',
    keyTakeaways: [
      'Digital campaigns fail when the underlying technology platform cannot handle conversion spikes or personalized user journeys.',
      'Software engineering without sharp market positioning results in products nobody knows how to buy.',
      'An integrated approach connecting People + Technology + Growth eliminates hand-off friction and compounds enterprise momentum.',
    ],
    tags: ['Ecosystem Strategy', 'B2B Growth', 'Organizational Scaling'],
    content: [
      'For decades, enterprise leadership treated agency services as fragmented commodities: hire a marketing agency for branding, an IT outsourcing shop for software, and a headhunting firm for hiring. But in modern digital commerce, these three disciplines are irrevocably intertwined.',
      'Consider the classic friction: a marketing team invests $200k in a demand generation blitz, only for incoming traffic to land on a clunky legacy portal with high latency and poor mobile responsiveness. Or conversely, an engineering team spends nine months building a sophisticated product feature that fails commercially because no one engineered the positioning, onboarding narrative, or search intent architecture.',
      'When you unify strategy, technology, and talent under one roof, something remarkable happens. Tech stacks are built with SEO and conversion analytics from day one. Brand campaigns are powered by custom interactive software experiences. And when ambitious roadmaps demand talent, dedicated pods are deployed seamlessly without 4-month hiring lags.',
      'This is what we call the Ecosystem Advantage: People + Technology + Growth = Unstoppable Business Momentum.',
    ],
    featured: true,
  },
  {
    id: 'i-headless-web-performance',
    slug: 'engineering-sub-second-b2b-web-platforms-nextjs-tailwind',
    title: 'Engineering Sub-Second B2B Web Platforms: Beyond Basic Core Web Vitals',
    subtitle: 'How modern architectural patterns turn enterprise websites into high-speed conversion engines.',
    category: 'Technology',
    verticalId: 'technology',
    readTime: '8 min read',
    publishedAt: '2024-08-28',
    author: {
      name: 'Vikram Mehta',
      role: 'Principal Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'Every 100ms of latency costs enterprise B2B sites up to 7% in lead conversion. Here is how we architect Next.js App Router applications for instant perceived responsiveness.',
    keyTakeaways: [
      'Server Components (RSC) drastically reduce client-side bundle size, preserving bandwidth for interactive widgets.',
      'Predictive prefetching and intelligent edge caching eliminate transition lag on key conversion pages.',
      'Accessible, clean UI components with zero heavy dependencies outperform bloated UI kits every time.',
    ],
    tags: ['Next.js', 'Web Performance', 'React', 'Architecture'],
    content: [
      'Website speed in enterprise B2B is no longer a technical vanity metric—it is a critical revenue driver. High-intent decision makers evaluating enterprise solutions have zero tolerance for layout shifts, sluggish navigation, or clunky animations.',
      'By transitioning from legacy CMS monoliths to modern decoupled architectures utilizing Next.js, React Server Components, and optimized styling tokens, we routinely achieve sub-second Largest Contentful Paint (LCP) scores and perfect Lighthouse audits.',
      'Key architectural principles include streaming SSR for dynamic pricing calculators, static generation for educational topic clusters, and strict modularization of client components.',
    ],
    featured: false,
  },
  {
    id: 'i-contingent-vs-sow-pods',
    slug: 'contingent-staffing-vs-dedicated-sow-pods-choosing-the-right-model',
    title: 'Contingent Staffing vs. SOW Pods: Choosing the Right Scaling Model',
    subtitle: 'A strategic guide for CTOs and VPs of Engineering navigating rapid product expansions.',
    category: 'Talent',
    verticalId: 'talent-solutions',
    readTime: '5 min read',
    publishedAt: '2024-08-10',
    author: {
      name: 'Samantha Reed',
      role: 'Director of Talent Solutions',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'When is individual staff augmentation ideal, and when should you deploy a self-governing Statement of Work (SOW) cross-functional team?',
    keyTakeaways: [
      'Staff augmentation works best when existing engineering leads have clear backlog tickets and capacity for direct supervision.',
      'SOW pods are superior for greenfield modules or mission-critical initiatives that require dedicated product leadership.',
      'Pre-vetted talent networks shorten recruitment cycles from months to under 14 days.',
    ],
    tags: ['Talent Strategy', 'Engineering Leadership', 'Staffing Models'],
    content: [
      'Engineering leaders frequently face a dilemma when ambitious quarterly roadmaps exceed internal hiring velocity. Bringing in contract developers without a coherent operational strategy often creates management drag rather than velocity.',
      'We break down when to use individual contingent staff augmentation versus deploying autonomous SOW squads with embedded tech leads, automated QA, and milestone-linked accountability.',
    ],
    featured: false,
  },
  {
    id: 'i-search-intent-2025',
    slug: 'the-death-of-keyword-stuffing-semantic-search-authority-playbook',
    title: 'The Semantic Authority Playbook: Outranking Legacy Competitors in B2B Search',
    subtitle: 'Why topic clusters, structured data, and original subject-matter depth dominate modern search engines.',
    category: 'Growth',
    verticalId: 'digital-growth',
    readTime: '7 min read',
    publishedAt: '2024-07-19',
    author: {
      name: 'Alexander Warner',
      role: 'Founding Partner & Strategic Director',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'Search engines have evolved to reward genuine expertise and structured knowledge graphs. Here is how we build programmatic topic clusters that capture enterprise intent.',
    keyTakeaways: [
      'Semantic topical clusters establish domain authority far faster than standalone disparate blog posts.',
      'Structured schema markup connects your services, case studies, and team credentials directly to search knowledge graphs.',
      'Zero-click search results require strategic content formatting that drives high-intent clicks.',
    ],
    tags: ['SEO', 'Content Strategy', 'B2B Demand Gen'],
    content: [
      'The era of chasing superficial keyword density is over. Search engines now evaluate content through large language models and semantic knowledge graphs, prioritizing entities, authoritativeness, and genuine utility.',
      'To build an enduring organic moat, B2B companies must create exhaustive topic clusters that solve real problems across the entire buyer journey—from initial problem discovery to technical vendor comparison.',
    ],
    featured: false,
  },
];

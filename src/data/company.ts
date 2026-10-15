export interface MethodStep {
  stepNumber: string;
  name: string;
  headline: string;
  description: string;
  deliverables: string[];
}

export interface CompanyMilestone {
  year: string;
  title: string;
  description: string;
  badge?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  specialty: string;
  avatarUrl: string;
  linkedinUrl?: string;
}

export const methodSteps: MethodStep[] = [
  {
    stepNumber: '01',
    name: 'DISCOVER',
    headline: 'Understand the business, audience, and opportunity.',
    description:
      'We dive deep into your commercial economics, customer journey friction points, competitive moats, and technical landscape to uncover the highest-leverage growth opportunities.',
    deliverables: ['Stakeholder Deep-Dives', 'Market & Competitor Audit', 'Technical Stack Analysis', 'User Persona Mapping'],
  },
  {
    stepNumber: '02',
    name: 'DEFINE',
    headline: 'Identify strategy, priorities, and direction.',
    description:
      'We construct a cohesive blueprint that translates business goals into actionable roadmaps across brand positioning, system architecture, and talent allocation.',
    deliverables: ['Strategic Growth Roadmap', 'Information Architecture', 'System Architecture Specs', 'KPI & Attribution Framework'],
  },
  {
    stepNumber: '03',
    name: 'BUILD',
    headline: 'Create the brand, technology, or experience.',
    description:
      'Our multidisciplinary squads engineer clean code, craft high-precision visual design systems, and build robust software platforms tailored to enterprise scale.',
    deliverables: ['Production Next.js / Full-Stack Apps', 'Design System Library', 'Custom API Integrations', 'Content & Creative Assets'],
  },
  {
    stepNumber: '04',
    name: 'ACTIVATE',
    headline: 'Put it into the market.',
    description:
      'Zero-downtime deployment, targeted demand generation blitzes, and multi-channel launch campaigns designed to capture immediate market attention.',
    deliverables: ['Seamless Production Launch', 'Multi-Channel Campaign Launch', 'SEO & Schema Activation', 'Analytics & Attribution Setup'],
  },
  {
    stepNumber: '05',
    name: 'OPTIMIZE',
    headline: 'Measure, learn, and improve.',
    description:
      'Launch is just day one. We continuously analyze conversion data, test hypotheses, scale winning channels, and evolve systems as your market expands.',
    deliverables: ['A/B Conversion Testing', 'Performance Monitoring', 'Continuous Feature Sprints', 'Quarterly Growth Reviews'],
  },
];

export const companyMilestones: CompanyMilestone[] = [
  {
    year: '2013',
    title: 'Founded with a Vision for Unified Growth',
    description: 'Mighty Warner was established to bridge the gap between creative branding and rigorous digital execution.',
    badge: 'Inception',
  },
  {
    year: '2016',
    title: 'Expansion into Full-Stack Software Engineering',
    description: 'Scaled internal engineering teams to build custom web applications, cloud architectures, and enterprise platforms.',
  },
  {
    year: '2019',
    title: 'Launch of Dedicated Talent Solutions Practice',
    description: 'Introduced contingent staffing, direct hire, and dedicated SOW engineering pods to solve enterprise hiring bottlenecks.',
  },
  {
    year: '2022',
    title: 'Global Office & Multi-Market Expansion',
    description: 'Expanded operations across North America, EMEA, and APAC, supporting clients across 25+ global markets.',
  },
  {
    year: 'Today',
    title: 'The Connected Business Ecosystem',
    description: 'A united powerhouse providing Strategy + Technology + Talent to over 450+ companies worldwide.',
    badge: 'Present',
  },
];

export const leadershipTeam: TeamMember[] = [
  {
    name: 'Alexander Warner',
    role: 'Managing Director & Strategic Lead',
    specialty: 'Enterprise Strategy & Brand Architecture',
    bio: '15+ years guiding Fortune 500 and high-growth scale-ups through high-stakes brand repositioning and commercial expansion.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Vikram Mehta',
    role: 'Chief Technology Officer',
    specialty: 'Distributed Systems & Cloud Architecture',
    bio: 'Former principal cloud architect with extensive background in microservices, real-time data pipelines, and scalable web apps.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Samantha Reed',
    role: 'Head of Talent Solutions',
    specialty: 'Executive Recruiting & Global Pod Scaling',
    bio: 'Pioneered rapid engineering deployment frameworks, placing over 1,200+ specialized engineers and leaders worldwide.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Julian Hayes',
    role: 'Director of Growth & Performance',
    specialty: 'Paid Media & Conversion Rate Optimization',
    bio: 'Data strategist overseeing multi-million dollar performance budgets with proprietary attribution models and CRO testing.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
];

export const coreValues = [
  {
    title: 'ONE ECOSYSTEM',
    subtitle: 'Strategy, technology, and talent under one roof.',
    description:
      'We eliminate hand-off friction between siloed vendors. Your brand narrative, code repository, and hiring pipeline work in absolute harmony.',
    iconName: 'Network',
  },
  {
    title: 'BUSINESS-FIRST',
    subtitle: 'Start with the problem rather than a predefined package.',
    description:
      'We do not sell cookie-cutter retainers. Every engagement is reverse-engineered from your commercial economics and revenue objectives.',
    iconName: 'Target',
  },
  {
    title: 'BUILT TO EVOLVE',
    subtitle: 'Launch, learn, optimize, and build what’s next.',
    description:
      'Markets change rapidly. We architect codebases, brands, and staffing models designed to scale flexibly as your enterprise expands.',
    iconName: 'Zap',
  },
];

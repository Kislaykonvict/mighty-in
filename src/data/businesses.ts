import { BusinessVertical } from '@/types/business';

export const businessesData: BusinessVertical[] = [
  {
    id: 'digital-growth',
    slug: 'digital-growth',
    name: 'Digital & Growth',
    pillarHeadline: 'Build a brand',
    tagline: 'Make your business impossible to ignore.',
    headline: 'Make your business impossible to ignore.',
    subheadline: 'Attract the right audience and turn attention into measurable enterprise momentum.',
    description:
      'Strategy, branding, digital experiences, and high-velocity growth marketing engineered to build enduring brand equity, outrank competitors, and maximize customer acquisition efficiency.',
    themeColor: 'growth',
    accentHex: '#FF5E3A',
    gradient: 'from-orange-500 via-rose-500 to-amber-500',
    bgGradient: 'from-orange-950/40 via-brand-surface to-brand-bg',
    heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=80',
    coreCapabilities: [
      'Digital Strategy',
      'Branding & Visual Identity',
      'Web Design & UI/UX',
      'Web Development',
      'Search Engine Optimization (SEO)',
      'Paid Media & Performance Ads',
      'Social Media & Community',
      'Content Production & Editorial',
      'Conversion Rate Optimization (CRO)',
    ],
    outcomes: [
      {
        metric: '340%',
        label: 'Average Organic Traffic Growth',
        context: 'Across multi-channel SEO & content strategy programs',
      },
      {
        metric: '4.8x',
        label: 'ROAS on Paid Performance',
        context: 'Multi-touch B2B and enterprise customer acquisition',
      },
      {
        metric: '62%',
        label: 'Lift in MQL Conversion Rates',
        context: 'Through targeted brand redesigns & CRO funnel architecture',
      },
    ],
    services: [
      {
        id: 'digital-strategy',
        name: 'Digital Strategy',
        shortDescription: 'Market positioning, competitive intelligence, and unified growth blueprints.',
        fullDescription:
          'We decode your market landscape, customer journey friction points, and untapped channels to build a high-impact digital roadmap aligned directly with revenue targets.',
        deliverables: ['Go-To-Market Roadmap', 'Audience Persona Architecture', 'Channel Prioritization Matrix', 'Competitor Benchmark Report'],
        technologies: ['HubSpot', 'Google Analytics 4', 'Semrush', 'Hotjar'],
        iconName: 'Compass',
      },
      {
        id: 'branding-identity',
        name: 'Branding & Identity',
        shortDescription: 'Distinctive visual systems and messaging frameworks that command authority.',
        fullDescription:
          'From logo systems and tone of voice to complete design language systems, we craft memorable brand identities that differentiate you from day one.',
        deliverables: ['Brand Guidelines', 'Typography & Color Tokens', 'Messaging & Tone Framework', 'Design Asset Toolkit'],
        technologies: ['Figma', 'Adobe Creative Suite', 'Illustrator'],
        iconName: 'Sparkles',
      },
      {
        id: 'web-design-dev',
        name: 'Web Design & Development',
        shortDescription: 'High-performance, beautifully engineered websites built for conversion.',
        fullDescription:
          'Award-winning aesthetics backed by clean code, lightning-fast Core Web Vitals, accessible UI components, and intuitive CMS content workflows.',
        deliverables: ['Responsive Web Design', 'Custom Next.js / Headless CMS Build', 'Design System Library', 'Interaction & Micro-Animations'],
        technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Sanity/Strapi'],
        iconName: 'Layout',
      },
      {
        id: 'seo-organic',
        name: 'Search Engine Optimization (SEO)',
        shortDescription: 'Technical optimization, content hubs, and sustainable top-tier rankings.',
        fullDescription:
          'Dominate search intent with programmatic SEO, semantic architecture, rigorous schema markup, backlink acquisition, and high-authority editorial content.',
        deliverables: ['Technical SEO Audit', 'Keyword Intent Architecture', 'Content Cluster Strategy', 'Schema & Core Web Vitals Tuning'],
        technologies: ['Ahrefs', 'Semrush', 'Google Search Console', 'Screaming Frog'],
        iconName: 'Search',
      },
      {
        id: 'paid-media',
        name: 'Paid Media & Performance Marketing',
        shortDescription: 'Scalable paid search, social, and programmatic demand capture campaigns.',
        fullDescription:
          'Data-driven media planning, creative testing, and multi-touch attribution that maximize ROI across Google Ads, LinkedIn, Meta, and niche industry networks.',
        deliverables: ['Campaign Setup & Structure', 'Dynamic Ad Creative Production', 'Bid Optimization & Testing', 'Real-time ROI Dashboards'],
        technologies: ['Google Ads', 'LinkedIn Campaign Manager', 'Meta Ads', 'Looker Studio'],
        iconName: 'TrendingUp',
      },
      {
        id: 'cro-optimization',
        name: 'Conversion Optimization (CRO)',
        shortDescription: 'A/B testing, user friction analysis, and high-velocity landing page refinement.',
        fullDescription:
          'Systematic experimentation programs designed to transform raw visitor traffic into high-intent leads and loyal customers.',
        deliverables: ['Heatmap & Session Analysis', 'A/B Testing Experiments', 'Friction Point Audit', 'High-Converting Landing Pages'],
        technologies: ['VWO', 'Optimizely', 'Hotjar', 'Google Optimize alternatives'],
        iconName: 'Gauge',
      },
    ],
    featuredProjectSlugs: ['strata-financial-brand-transformation', 'elevate-health-scale'],
  },
  {
    id: 'technology',
    slug: 'technology',
    name: 'Technology',
    pillarHeadline: 'Build a product',
    tagline: 'Build the systems your business needs next.',
    headline: 'Build the systems your business needs next.',
    subheadline: 'Engineering scalable web apps, custom software platforms, cloud architectures, and intelligent integrations.',
    description:
      'From mission-critical web applications to custom software platforms and seamless API integrations, we architect and engineer reliable technology designed around real business workflows.',
    themeColor: 'tech',
    accentHex: '#3B82F6',
    gradient: 'from-blue-500 via-indigo-500 to-cyan-400',
    bgGradient: 'from-blue-950/40 via-brand-surface to-brand-bg',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    coreCapabilities: [
      'Web Applications',
      'Mobile Applications (iOS & Android)',
      'Custom Enterprise Software',
      'SaaS Platforms & Multi-Tenancy',
      'APIs & Integrations',
      'Workflow Automation & AI Tooling',
      'Cloud Architecture & DevOps',
      'Technology Consulting & Code Audits',
    ],
    outcomes: [
      {
        metric: '99.99%',
        label: 'Production Uptime Architecture',
        context: 'High-availability microservices and cloud deployments',
      },
      {
        metric: '10x',
        label: 'System Throughput Scalability',
        context: 'Modernized legacy platforms into event-driven serverless & container stacks',
      },
      {
        metric: '45%',
        label: 'Operational Cost Reduction',
        context: 'Through custom workflow automation and smart API integrations',
      },
    ],
    services: [
      {
        id: 'web-apps',
        name: 'Web Applications',
        shortDescription: 'Fast, secure, responsive enterprise-grade web applications.',
        fullDescription:
          'End-to-end web product engineering combining resilient backend architecture with intuitive, polished frontend user experiences.',
        deliverables: ['Full-stack Application Architecture', 'Interactive Dashboard & Data Viz', 'Role-Based Access Control (RBAC)', 'REST & GraphQL APIs'],
        technologies: ['React', 'Next.js', 'NestJS', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
        iconName: 'Code',
      },
      {
        id: 'mobile-apps',
        name: 'Mobile Applications',
        shortDescription: 'Cross-platform and native iOS and Android apps with silky performance.',
        fullDescription:
          'High-retention mobile experiences that leverage device capabilities, offline sync, real-time push notifications, and seamless biometric authentication.',
        deliverables: ['iOS & Android Native/Cross-platform Apps', 'App Store Submission & Compliance', 'Offline-First Data Sync', 'Push Notification Pipeline'],
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        iconName: 'Smartphone',
      },
      {
        id: 'custom-software',
        name: 'Custom Software & Platforms',
        shortDescription: 'Tailored platforms engineered around proprietary business logic.',
        fullDescription:
          'Replace clunky legacy spreadsheets and rigid off-the-shelf software with purpose-built software platforms that adapt to your exact operational workflows.',
        deliverables: ['Custom ERP / CRM Modules', 'Multi-tenant SaaS Architecture', 'Automated Invoicing & Billing Workflows', 'Audit Logging & Compliance'],
        technologies: ['NestJS', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'AWS'],
        iconName: 'Server',
      },
      {
        id: 'apis-integrations',
        name: 'APIs & Integrations',
        shortDescription: 'Unify disjointed software ecosystems into synchronous, real-time pipelines.',
        fullDescription:
          'Connect your CRMs, ERPs, payment gateways, marketing tools, and internal microservices through secure, rate-limited, well-documented API ecosystems.',
        deliverables: ['API Gateway Design & Implementation', 'Webhook Event-Driven Architecture', 'Third-Party SaaS Integrations', 'OpenAPI / Swagger Documentation'],
        technologies: ['Node.js', 'NestJS', 'Stripe', 'Salesforce', 'Zapier/Make', 'Kafka/RabbitMQ'],
        iconName: 'Workflow',
      },
      {
        id: 'automation-ai',
        name: 'Automation & AI Tooling',
        shortDescription: 'Streamline repetitive manual workflows with intelligent automation systems.',
        fullDescription:
          'Harness modern LLM APIs, OCR pipelines, and event-driven automation to eradicate human error and accelerate operational throughput.',
        deliverables: ['Intelligent Document Processing', 'Custom AI Copilots & Agents', 'Automated Data Reconciliation', 'ETL Data Pipelines'],
        technologies: ['OpenAI / Anthropic APIs', 'LangChain', 'Python', 'Celery', 'PostgreSQL pgvector'],
        iconName: 'Cpu',
      },
      {
        id: 'tech-consulting',
        name: 'Technology Consulting',
        shortDescription: 'Architectural reviews, security audits, and fractional CTO advisory.',
        fullDescription:
          'Unbiased technical leadership to help executive teams evaluate tech stacks, mitigate technical debt, plan cloud migrations, and enforce security best practices.',
        deliverables: ['Codebase Health Audit', 'Cloud Infrastructure Cost Optimization', 'SOC2 / HIPAA Readiness Prep', 'Technical Roadmap Planning'],
        technologies: ['AWS', 'Google Cloud', 'Terraform', 'Datadog', 'Snyk'],
        iconName: 'ShieldCheck',
      },
    ],
    featuredProjectSlugs: ['quantum-saas-platform-modernization', 'nexus-supply-chain-api-mesh'],
  },
  {
    id: 'talent-solutions',
    slug: 'talent-solutions',
    name: 'Talent Solutions',
    pillarHeadline: 'Build a team',
    tagline: 'Build the team behind the business.',
    headline: 'Build the team behind the business.',
    subheadline: 'Connecting ambitious companies with elite engineering, marketing, and executive talent to accelerate growth.',
    description:
      'Execution requires the right people in the right seats. We provide agile contingent staffing, dedicated direct hire, statement of work (SOW) teams, and embedded talent acquisition.',
    themeColor: 'talent',
    accentHex: '#10B981',
    gradient: 'from-emerald-500 via-teal-500 to-green-400',
    bgGradient: 'from-emerald-950/40 via-brand-surface to-brand-bg',
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
    coreCapabilities: [
      'Contingent Staffing & Staff Augmentation',
      'Direct Hire & Permanent Placement',
      'Statement of Work (SOW) Dedicated Pods',
      'Executive & Fractional Leadership',
      'Embedded Talent Acquisition (RPO)',
      'Global Remote Team Scaling',
      'Vetted Technical & Creative Talent',
    ],
    audiences: [
      {
        label: "I'm an Employer",
        description: 'Need to hire senior developers, marketing directors, or complete technical pods quickly?',
        ctaText: 'Hire Top Talent →',
        ctaHref: '/contact?topic=talent-solutions&type=employer',
      },
      {
        label: "I'm a Candidate",
        description: 'Looking for high-impact roles at top-tier technology companies and high-growth brands?',
        ctaText: 'Explore Career Opportunities →',
        ctaHref: '/contact?topic=talent-solutions&type=candidate',
      },
    ],
    outcomes: [
      {
        metric: '< 14 Days',
        label: 'Average Time to Shortlist',
        context: 'Pre-screened, rigorously vetted senior candidates',
      },
      {
        metric: '94%',
        label: 'First-Year Retention Rate',
        context: 'Carefully matched culture, technical fit, and team chemistry',
      },
      {
        metric: '1,200+',
        label: 'Placements & Specialists Deployed',
        context: 'Across software engineering, product, data, and growth marketing',
      },
    ],
    services: [
      {
        id: 'contingent-staffing',
        name: 'Contingent Staffing',
        shortDescription: 'Flexible contract specialists to scale your team during critical product sprints.',
        fullDescription:
          'Rapidly inject senior software engineers, UI/UX designers, DevOps specialists, and growth marketers without lengthy recruiting lag.',
        deliverables: ['Rapid Candidate Matching', 'Pre-Vetted Technical Assessments', 'Flexible Hourly / Monthly Contracts', 'Seamless Onboarding Support'],
        technologies: ['Full-Stack Devs', 'Cloud Engineers', 'Product Designers', 'Data Analysts'],
        iconName: 'Users',
      },
      {
        id: 'direct-hire',
        name: 'Direct Hire',
        shortDescription: 'Executive search and permanent hires matched for cultural and technical excellence.',
        fullDescription:
          'End-to-end recruitment for critical full-time positions. We source, screen, interview, and assist with offer negotiation to secure top 5% talent.',
        deliverables: ['Custom Role Profiling', 'Passive Talent Sourcing', 'Rigorous Multi-Stage Screening', 'Offer & Compensation Advisory'],
        technologies: ['Engineering Leads', 'Chief Marketing Officers', 'VP of Product', 'Principal Architects'],
        iconName: 'UserCheck',
      },
      {
        id: 'sow-project-teams',
        name: 'Statement of Work (SOW) Pods',
        shortDescription: 'Turnkey cross-functional teams dedicated to delivering milestone-driven projects.',
        fullDescription:
          'A cohesive squad of product managers, designers, frontend and backend engineers managed against transparent deliverables and agreed timelines.',
        deliverables: ['Dedicated Squad Leadership', 'Bi-Weekly Sprint Deliverables', 'Transparent Milestone Tracking', 'Knowledge Transfer & Documentation'],
        technologies: ['Full Project Pods', 'Agile Scrum Teams', 'Design Systems Squads'],
        iconName: 'Briefcase',
      },
      {
        id: 'talent-acquisition-rpo',
        name: 'Talent Acquisition (RPO)',
        shortDescription: 'Embedded recruitment specialists acting as an extension of your internal HR team.',
        fullDescription:
          'Scale up your hiring capacity on demand with our experienced technical recruiters, modern ATS tooling, and employer branding playbooks.',
        deliverables: ['Embedded Recruiter Deployment', 'Hiring Pipeline Optimization', 'Interview Framework Design', 'Employer Branding Collateral'],
        technologies: ['Greenhouse', 'Lever', 'Workable', 'LinkedIn Recruiter'],
        iconName: 'Award',
      },
    ],
    featuredProjectSlugs: ['fintech-scaleup-engineering-pod', 'healthtech-global-team-expansion'],
  },
];

import { Project } from '@/types/project';

export const projectsData: Project[] = [
  {
    id: 'strata-financial',
    slug: 'strata-financial-brand-transformation',
    title: 'Strata Financial: Complete Brand Repositioning & Growth Engine',
    client: 'Strata Financial Group',
    industry: 'Financial Services & Wealth Management',
    verticalId: 'digital-growth',
    verticalName: 'Digital & Growth',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    ],
    tagline: 'Modernizing a legacy advisory firm into a digital-first market leader.',
    shortDescription:
      'Brand redesign, custom headless web platform, and targeted SEO strategy driving a 210% surge in qualified high-net-worth inquiries.',
    summary:
      'Strata Financial needed to break out of legacy financial advisory tropes. Mighty Warner redefined their visual narrative, engineered a Next.js digital experience with interactive wealth planning calculators, and executed an organic search dominance strategy.',
    challenge:
      'Strata Financial was losing ground to agile fintech competitors due to an outdated 2015-era WordPress site, unclear value proposition, and non-existent organic search presence for high-value wealth management queries.',
    objectives: [
      'Establish a prestigious, contemporary brand identity that commands institutional trust.',
      'Build a sub-second page load web application featuring interactive portfolio calculators.',
      'Capture top 3 search rankings for key wealth planning keywords across North America.',
      'Increase qualified inbound lead submissions by over 150% within 6 months.',
    ],
    strategy: [
      'Conducted 30+ client interviews to isolate emotional drivers and advisor trust factors.',
      'Architected an editorial-grade design system emphasizing clarity, whitespace, and prestige.',
      'Engineered a headless Next.js frontend integrated with an interactive risk-profiling engine.',
      'Developed 45+ topic cluster content assets addressing complex estate and tax optimization questions.',
    ],
    solution:
      'We launched the redesigned Strata Financial brand with a responsive design system, tailored client portals, dynamic interactive planning tools, and a programmatic SEO content engine.',
    technologiesUsed: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HubSpot CMS API', 'Google Analytics 4'],
    metrics: [
      {
        value: '+210%',
        label: 'Inbound MQL Increase',
        description: 'Verified increase in qualified private wealth leads',
      },
      {
        value: '0.6s',
        label: 'Average LCP Speed',
        description: 'Core Web Vitals in 99th percentile across financial sector',
      },
      {
        value: '42',
        label: 'Page 1 Keyword Rankings',
        description: 'Dominating competitive national wealth queries',
      },
      {
        value: '$140M+',
        label: 'Pipeline Value Generated',
        description: 'Tracked directly from new digital acquisition channels',
      },
    ],
    featured: true,
    testimonialId: 't-strata',
    liveUrl: 'https://stratafinancial.example.com',
  },
  {
    id: 'quantum-saas',
    slug: 'quantum-saas-platform-modernization',
    title: 'Quantum Cloud: Multi-Tenant Enterprise SaaS Modernization',
    client: 'Quantum Cloud Systems',
    industry: 'Enterprise B2B Cloud & Logistics',
    verticalId: 'technology',
    verticalName: 'Technology',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    ],
    tagline: 'Re-architecting legacy monoliths into high-throughput cloud microservices.',
    shortDescription:
      'Next-generation web portal, microservice API gateway, and real-time telematics dashboard handling 5M+ daily transactions.',
    summary:
      'Quantum Cloud engaged Mighty Warner to rebuild their core enterprise telematics platform. We engineered a scalable React and NestJS microservices suite with sub-50ms WebSocket telemetry streaming.',
    challenge:
      'A bloated PHP monolith was crashing during peak logistics shifts, causing telemetry delays of up to 4 minutes and throttling customer onboarding for enterprise logistics fleets.',
    objectives: [
      'Decouple the monolithic codebase into high-performance NestJS microservices.',
      'Deliver real-time telematics telemetry streaming under 100ms latency.',
      'Achieve 99.99% system availability with automated failover and zero-downtime deployments.',
      'Enable seamless multi-tenant self-service enterprise onboarding.',
    ],
    strategy: [
      'Designed an event-driven architecture using Kafka, Redis caching, and PostgreSQL.',
      'Implemented GraphQL & REST API gateways with role-based fine-grained permissions.',
      'Crafted a high-density analytics dashboard using custom virtualized data grids.',
      'Automated CI/CD pipelines on AWS with automated load and security testing.',
    ],
    solution:
      'A state-of-the-art enterprise logistics cloud platform with live fleet telemetry, automated invoice generation, and predictive maintenance anomaly alerts.',
    technologiesUsed: ['NestJS', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'AWS ECS', 'Tailwind CSS'],
    metrics: [
      {
        value: '99.99%',
        label: 'Production Uptime',
        description: 'Zero unscheduled downtime over past 12 months',
      },
      {
        value: '< 45ms',
        label: 'Telemetry Latency',
        description: 'Real-time WebSocket event delivery to 20,000+ connected vehicles',
      },
      {
        value: '8.5x',
        label: 'Throughput Increase',
        description: 'Handling 5M+ daily API events with minimal server footprint',
      },
      {
        value: '-52%',
        label: 'Cloud Infrastructure Cost',
        description: 'Achieved through intelligent auto-scaling and Redis caching',
      },
    ],
    featured: true,
    testimonialId: 't-quantum',
    liveUrl: 'https://quantumcloud.example.com',
  },
  {
    id: 'fintech-engineering-pod',
    slug: 'fintech-scaleup-engineering-pod',
    title: 'AuraPay: Rapid Scale-Up of Core Payments Engineering Pod',
    client: 'AuraPay Global',
    industry: 'Fintech & Cross-Border Payments',
    verticalId: 'talent-solutions',
    verticalName: 'Talent Solutions',
    year: '2023 - 2024',
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    ],
    tagline: 'Deploying a 12-person senior engineering pod in 18 days to beat compliance deadline.',
    shortDescription:
      'Provided a dedicated Statement of Work (SOW) engineering pod that built and launched AuraPay’s European payment gateway 3 weeks ahead of schedule.',
    summary:
      'When AuraPay secured Series B funding to expand into the EU, internal hiring bottlenecks threatened their banking license deadline. Mighty Warner assembled and deployed a turnkey team of senior payment engineers, DevOps architects, and QA specialists.',
    challenge:
      'AuraPay had 90 days to achieve full PSD2 compliance and launch their SEPA instant payments module or face regulatory delays costing over $2M.',
    objectives: [
      'Deploy 12 senior engineers with direct fintech and payments gateway experience within 3 weeks.',
      'Achieve 100% compliance with European regulatory standards (PSD2, GDPR, Strong Customer Auth).',
      'Deliver the SEPA instant payments engine ahead of regulatory audit deadlines.',
    ],
    strategy: [
      'Leveraged Mighty Warner’s pre-vetted talent pool of senior distributed engineers.',
      'Conducted custom technical scenario interviews evaluating cryptography, idempotency, and ISO 20022 schemas.',
      'Integrated the pod directly into AuraPay’s Jira, Slack, and GitHub workflows with a dedicated tech lead.',
    ],
    solution:
      'An embedded, high-velocity engineering squad that delivered 6 major payment microservices, integrated with 3 European clearing houses, and established automated regression testing suites.',
    technologiesUsed: ['Go', 'TypeScript', 'Node.js', 'PostgreSQL', 'Kafka', 'Terraform', 'Vault', 'Docker'],
    metrics: [
      {
        value: '18 Days',
        label: 'Time to Full Deployment',
        description: 'From signed agreement to 12 engineers committing production code',
      },
      {
        value: '100%',
        label: 'Audit Compliance',
        description: 'Passed PSD2 & European banking audit with zero non-conformances',
      },
      {
        value: '3 Weeks',
        label: 'Ahead of Schedule',
        description: 'Launched EU gateway well before regulatory deadline',
      },
      {
        value: '95%',
        label: 'Contract-to-Perm Conversion',
        description: 'Client subsequently retained key leads permanently',
      },
    ],
    featured: true,
    testimonialId: 't-aurapay',
  },
  {
    id: 'elevate-health',
    slug: 'elevate-health-scale',
    title: 'Elevate Health: D2C Digital Growth & Conversion Optimization',
    client: 'Elevate Health Technologies',
    industry: 'HealthTech & Personalized Wellness',
    verticalId: 'digital-growth',
    verticalName: 'Digital & Growth',
    year: '2024',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    tagline: 'Scaling customer acquisition while cutting CAC by 38%.',
    shortDescription:
      'Omnichannel performance marketing, custom interactive quiz onboarding, and landing page conversion optimization engine.',
    summary:
      'Elevate Health needed to scale customer acquisition for their personalized wellness subscription. Mighty Warner engineered a dynamic diagnostic quiz funnel and multi-channel paid media campaigns.',
    challenge:
      'Elevate Health’s customer acquisition cost (CAC) was creeping upwards on Meta ads, and their generic Shopify checkout was seeing a 68% drop-off rate.',
    objectives: [
      'Design an engaging, frictionless diagnostic onboarding quiz.',
      'Cut blended customer acquisition costs by at least 25%.',
      'Increase recurring subscription conversion rate by 40%.',
    ],
    strategy: [
      'Built a 6-step interactive lifestyle assessment funnel with personalized product recommendations.',
      'Restructured paid search and social campaigns around high-intent health search terms.',
      'Executed 24 rigorous A/B copy and visual layout tests.',
    ],
    solution:
      'A gamified wellness assessment integrated directly with Stripe and Klaviyo, backed by automated retargeting sequences and high-converting landing pages.',
    technologiesUsed: ['React', 'Next.js', 'Tailwind CSS', 'Stripe Elements', 'Klaviyo API', 'Meta CAPI', 'VWO'],
    metrics: [
      {
        value: '-38%',
        label: 'CAC Reduction',
        description: 'Lower cost per acquired subscriber across all paid channels',
      },
      {
        value: '+74%',
        label: 'Funnel Completion Rate',
        description: 'High engagement across interactive diagnostic steps',
      },
      {
        value: '3.4x',
        label: 'Monthly Recurring Revenue',
        description: 'Growth achieved in 9 months of partnership',
      },
    ],
    featured: false,
    testimonialId: 't-elevate',
  },
  {
    id: 'nexus-supply-chain',
    slug: 'nexus-supply-chain-api-mesh',
    title: 'Nexus Logistics: Global Supply Chain API Mesh & Automation',
    client: 'Nexus Supply Chain Solutions',
    industry: 'Freight, Logistics & Warehousing',
    verticalId: 'technology',
    verticalName: 'Technology',
    year: '2023',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    tagline: 'Connecting 40+ carriers and 12 warehouses through unified event streams.',
    shortDescription:
      'Automated customs documentation, EDI translation engine, and carrier dispatch webhook pipeline processing 100K+ shipments monthly.',
    summary:
      'Nexus operated disparate warehouse systems that required hours of manual spreadsheet reconciliation. Mighty Warner built an automated API middleware mesh that synchronizes inventory and orders in real-time.',
    challenge:
      'Data silos between legacy ERPs and modern freight APIs caused shipping delays, missed SLA fines, and excessive manual overhead.',
    objectives: [
      'Eliminate manual data entry across shipping manifests and customs filings.',
      'Provide real-time inventory visibility across all 12 global fulfillment centers.',
      'Achieve sub-second webhook processing for tracking updates.',
    ],
    strategy: [
      'Constructed a resilient NestJS microservice mesh with RabbitMQ message queues.',
      'Implemented automated EDI (X12/EDIFACT) parser pipelines.',
      'Built a centralized administrative portal with role-based access and automated error recovery.',
    ],
    solution:
      'A real-time logistics middleware platform that automated 92% of customs documentation and reduced manual data reconciliation to zero.',
    technologiesUsed: ['NestJS', 'PostgreSQL', 'TypeScript', 'RabbitMQ', 'Docker', 'AWS SQS', 'Next.js'],
    metrics: [
      {
        value: '92%',
        label: 'Automation Rate',
        description: 'Shipment documents generated and submitted with zero human touch',
      },
      {
        value: '100K+',
        label: 'Monthly Shipments',
        description: 'Processed with 99.98% successful delivery tracking accuracy',
      },
      {
        value: '$480K',
        label: 'Annual Labor Savings',
        description: 'Diverted operational staff to client relationship management',
      },
    ],
    featured: false,
    testimonialId: 't-nexus',
  },
  {
    id: 'healthtech-expansion',
    slug: 'healthtech-global-team-expansion',
    title: 'MedVance: Scaling an FDA-Compliant Software Engineering Organization',
    client: 'MedVance Diagnostics',
    industry: 'MedTech & Clinical Software',
    verticalId: 'talent-solutions',
    verticalName: 'Talent Solutions',
    year: '2023 - 2024',
    heroImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    tagline: 'Recruiting 24 specialized medical device software engineers.',
    shortDescription:
      'Embedded RPO talent solution delivering specialized C++, Python, and IEC 62304 regulatory software engineers.',
    summary:
      'MedVance was developing an AI-driven clinical ultrasound device. Finding software engineers with rigorous ISO 13485 and FDA verification experience was holding back clinical trials. Mighty Warner embedded a talent acquisition team that filled all 24 positions in 4 months.',
    challenge:
      'Standard recruiters struggled to evaluate specialized clinical software and algorithmic engineering requirements.',
    objectives: [
      'Source and hire 24 senior embedded and machine learning engineers with medical compliance background.',
      'Reduce average time-to-hire from 75 days to under 30 days.',
      'Maintain candidate offer acceptance rate above 90%.',
    ],
    strategy: [
      'Deployed an embedded technical recruiter and medical software subject matter advisor.',
      'Standardized the screening scorecard against FDA 21 CFR Part 820 quality standards.',
      'Constructed a competitive talent pipeline across North America and Europe.',
    ],
    solution:
      'A dedicated talent acquisition partnership that built MedVance’s core clinical platform team, accelerating their FDA 510(k) submission timeline by 5 months.',
    technologiesUsed: ['C++', 'Python', 'CUDA', 'IEC 62304', 'ISO 13485', 'Greenhouse ATS'],
    metrics: [
      {
        value: '24',
        label: 'Specialists Hired',
        description: 'All 24 specialized medical software engineering roles filled',
      },
      {
        value: '26 Days',
        label: 'Average Time to Hire',
        description: 'Down from 75+ days prior to Mighty Warner engagement',
      },
      {
        value: '93%',
        label: 'Offer Acceptance Rate',
        description: 'Driven by personalized candidate journey and compensation benchmarking',
      },
    ],
    featured: false,
    testimonialId: 't-medvance',
  },
];

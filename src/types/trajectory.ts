export interface TrajectoryPillar {
  title: string;
  subtitle: string;
  tag?: string;
}

export interface TrajectoryEpoch {
  id: string;
  year: string;
  epochNumber: string; // e.g. "01", "02", "03"
  phaseTitle: string;  // e.g. "Genesis & Brand Foundation"
  headline: string;    // e.g. "Forged at the Intersection of Strategy & Code"
  narrative: string;   // detailed description
  primaryMetric: {
    value: string;
    label: string;
  };
  secondaryMetric: {
    value: string;
    label: string;
  };
  pillars: TrajectoryPillar[];
  themeColor: 'rose' | 'indigo' | 'sky' | 'emerald' | 'amber';
  hubLocation: string;
}

export interface TrajectoryData {
  badge: string;
  title: string;
  subtitle: string;
  epochs: TrajectoryEpoch[];
  isActive: boolean;
}

export const defaultTrajectoryData: TrajectoryData = {
  badge: 'CHRONOLOGICAL EVOLUTION • 2014 TO BEYOND',
  title: 'Our Evolution Through Time',
  subtitle:
    'From a focused digital marketing and web development agency in 2014 to an integrated multi-national powerhouse uniting Strategy, Technology, and Global Staffing.',
  isActive: true,
  epochs: [
    {
      id: 'epoch-2014',
      year: '2014',
      epochNumber: '01',
      phaseTitle: 'The Genesis & Foundation',
      headline: 'Founded to Unite Creative Branding, Semantic SEO, and Full-Stack Web Development',
      narrative:
        'Established in July 2014 with a core mission: revolutionize the digital agency space by bridging the divide between high-conversion brand design, organic search optimization, and robust web development. We deployed cross-functional squads to engineer digital growth platforms that drive tangible commercial revenue.',
      primaryMetric: {
        value: '100+',
        label: 'Inaugural Brand Platforms Launched',
      },
      secondaryMetric: {
        value: '100%',
        label: 'Organic Client Growth & Retention',
      },
      pillars: [
        {
          title: 'Integrated Growth Squads',
          subtitle: 'Uniting creative designers, SEO specialists, and web architects under one roof.',
          tag: 'Brand + Tech',
        },
        {
          title: 'Semantic SEO Architecture',
          subtitle: 'Performance-driven organic discoverability built directly into source code.',
          tag: 'SEO Dominance',
        },
        {
          title: 'Agile Delivery Standards',
          subtitle: 'Clean code craftsmanship with zero technical debt from day one.',
          tag: 'Engineering',
        },
      ],
      themeColor: 'sky',
      hubLocation: 'Noida, NCR • India Hub',
    },
    {
      id: 'epoch-2016',
      year: '2016–17',
      epochNumber: '02',
      phaseTitle: 'Software & Cloud Engineering',
      headline: 'Architecting Custom Web Applications, B2B Portals & Scalable Cloud Solutions',
      narrative:
        'As our enterprise clients scaled, Mighty Warner expanded beyond marketing websites into complex custom software development, cloud infrastructure, and mobile app platforms. We built scalable database architectures, automated workflows, and high-throughput web systems designed for enterprise reliability.',
      primaryMetric: {
        value: '350+',
        label: 'Custom Web & Mobile Platforms',
      },
      secondaryMetric: {
        value: '99.9%',
        label: 'Cloud Infrastructure Uptime SLA',
      },
      pillars: [
        {
          title: 'Custom Web & Mobile Systems',
          subtitle: 'Bespoke business portals, enterprise dashboards, and mobile apps.',
          tag: 'Full-Stack',
        },
        {
          title: 'API & Microservices Architecture',
          subtitle: 'Decoupled, modular backends engineered for enterprise data scale.',
          tag: 'Cloud & Code',
        },
        {
          title: 'Cloud DevOps Pipelines',
          subtitle: 'Automated CI/CD deployments and real-time infrastructure monitoring.',
          tag: 'DevOps',
        },
      ],
      themeColor: 'indigo',
      hubLocation: 'NCR Engineering Studios • India',
    },
    {
      id: 'epoch-2019',
      year: '2019–20',
      epochNumber: '03',
      phaseTitle: 'US Staffing & Talent Solutions',
      headline: 'Pioneering On-Demand Technical Talent Pods, Contingent Staffing & SOW Delivery',
      narrative:
        'Recognizing that enterprise scale is fundamentally constrained by access to top-tier technical talent, Mighty Warner launched its dedicated US Staffing and Talent Solutions division. We deployed dedicated Statement of Work (SOW) engineering pods, contingent technical specialists, and direct-hire leaders across North America.',
      primaryMetric: {
        value: '1,200+',
        label: 'Specialized Engineers & Leaders Deployed',
      },
      secondaryMetric: {
        value: '14 Days',
        label: 'Average Dedicated Pod Ramp-Up Time',
      },
      pillars: [
        {
          title: 'Dedicated SOW Engineering Pods',
          subtitle: 'Autonomous sprint squads aligned directly with enterprise product roadmaps.',
          tag: 'SOW Pods',
        },
        {
          title: 'Rigorous Technical Vetting',
          subtitle: 'Multi-stage code challenges and architecture evaluations ensuring top 3% talent.',
          tag: 'Top 3% Vetted',
        },
        {
          title: 'US & Global Staffing Delivery',
          subtitle: 'Contingent IT staffing, direct-hire placement, and scalable RPO services.',
          tag: 'US Staffing',
        },
      ],
      themeColor: 'emerald',
      hubLocation: 'Albany, NY • USA Office',
    },
    {
      id: 'epoch-2022',
      year: '2022–23',
      epochNumber: '04',
      phaseTitle: 'MENA Expansion & Dubai HQ',
      headline: 'Establishing Our Middle East Executive Headquarters in Business Bay, Dubai',
      narrative:
        'Mighty Warner established its primary regional headquarters at Office #816, The Burlington Tower, Marasi Drive, Business Bay, Dubai. This positioned our team at the epicenter of the UAE’s digital and real estate boom, delivering high-performance PropTech portals, luxury development showcases, and enterprise ICT solutions across the Gulf.',
      primaryMetric: {
        value: '25+',
        label: 'Global Markets Actively Served',
      },
      secondaryMetric: {
        value: '4 Hubs',
        label: 'Dubai • Albany • Mississauga • Noida',
      },
      pillars: [
        {
          title: 'MENA Regional Executive Hub',
          subtitle: 'Strategic digital ICT transformation for UAE enterprises, developers, and institutions.',
          tag: 'Dubai HQ',
        },
        {
          title: 'PropTech & Real Estate Platforms',
          subtitle: 'Ultra-fast vector map interfaces, luxury property portals, and CRM automation.',
          tag: 'PropTech Lead',
        },
        {
          title: '24/7 Follow-the-Sun Operations',
          subtitle: 'Continuous hand-off delivery across EST, GST, and IST time zones.',
          tag: 'Global Delivery',
        },
      ],
      themeColor: 'rose',
      hubLocation: 'Business Bay, Dubai • UAE HQ',
    },
    {
      id: 'epoch-2024',
      year: '2024',
      epochNumber: '05',
      phaseTitle: 'The Connected Ecosystem',
      headline: 'Uniting Strategy, Technology, and Talent as One Synchronized Global Engine',
      narrative:
        'Mighty Warner evolved into a connected business powerhouse, surpassing 1,500+ delivered brand ecosystems worldwide. By uniting brand strategy, Next.js engineering, performance marketing, and global talent pods under one roof, we eliminated vendor silos and dramatically accelerated go-to-market speed for partners.',
      primaryMetric: {
        value: '1,500+',
        label: 'Global Projects & Brands Delivered',
      },
      secondaryMetric: {
        value: '250+',
        label: 'In-House Engineers, Strategists & Recruiters',
      },
      pillars: [
        {
          title: 'Unified Tri-Pillar Engine',
          subtitle: 'Strategy, technology, and talent synchronized to eliminate agency hand-off friction.',
          tag: 'Connected Model',
        },
        {
          title: 'Next.js & Edge Web Dominance',
          subtitle: 'Sub-second web experiences with App Router, server components, and edge caching.',
          tag: 'Next.js Core',
        },
        {
          title: 'Enterprise SLAs & Governance',
          subtitle: 'Robust multi-jurisdiction compliance, data privacy, and zero-downtime deployments.',
          tag: 'Enterprise SLA',
        },
      ],
      themeColor: 'amber',
      hubLocation: 'Worldwide Distributed Network',
    },
    {
      id: 'epoch-2025',
      year: '2025+',
      epochNumber: '06',
      phaseTitle: 'AI Studio & Future Horizons',
      headline: 'Pioneering Autonomous AI Workflows, Predictive Intelligence & Self-Optimizing Systems',
      narrative:
        'Leading the frontier of modern enterprise transformation, Mighty Warner is integrating dedicated AI Studios, custom LLM fine-tuning, autonomous workflow agents, and predictive growth engines. We empower businesses to operate with 10x agility, self-optimizing platforms, and automated intelligence built for the next decade.',
      primaryMetric: {
        value: '99.4%',
        label: 'Verified Enterprise Delivery Index',
      },
      secondaryMetric: {
        value: '10x',
        label: 'Operational Velocity with AI Workflows',
      },
      pillars: [
        {
          title: 'AI Studio & Agentic Automation',
          subtitle: 'Autonomous customer workflows, LLM toolchains, and intelligent business agents.',
          tag: 'AI Workflows',
        },
        {
          title: 'Edge Micro-Architectures',
          subtitle: 'Globally distributed microservices and real-time streaming architectures.',
          tag: 'Edge Cloud',
        },
        {
          title: 'Future-Proof Growth Horizon',
          subtitle: 'Continuous evolutionary pods engineering tomorrow’s competitive advantages.',
          tag: 'Next Horizon',
        },
      ],
      themeColor: 'rose',
      hubLocation: 'Global Innovation Pods',
    },
  ],
};

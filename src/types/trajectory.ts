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
  badge: 'CHRONOLOGICAL EVOLUTION • 2013 TO BEYOND',
  title: 'Our Trajectory Through Time',
  subtitle:
    'From a boutique digital consultancy in 2013 to an integrated global powerhouse uniting Strategy, Technology, and Talent.',
  isActive: true,
  epochs: [
    {
      id: 'epoch-2013',
      year: '2013',
      epochNumber: '01',
      phaseTitle: 'The Inception',
      headline: 'Forged to bridge the divide between brand strategy and engineering.',
      narrative:
        'Mighty Warner was founded with a singular conviction: businesses were suffering from a fragmented agency model. Creatives did not understand distributed systems, and IT shops lacked brand soul. We built the first cross-functional squads to combine deep design with web engineering.',
      primaryMetric: {
        value: '15+',
        label: 'Inaugural Projects Shipped',
      },
      secondaryMetric: {
        value: '100%',
        label: 'Organic Client Referrals',
      },
      pillars: [
        {
          title: 'Integrated Strategy Pods',
          subtitle: 'Uniting creative directors with full-stack architects.',
          tag: 'Foundation',
        },
        {
          title: 'Boutique Focus',
          subtitle: 'Dedicated high-touch engagement for market challengers.',
          tag: 'High Touch',
        },
        {
          title: 'Code Quality SLAs',
          subtitle: 'Strict architecture standards with zero technical debt.',
          tag: 'Engineering',
        },
      ],
      themeColor: 'sky',
      hubLocation: 'Inception Hub',
    },
    {
      id: 'epoch-2016',
      year: '2016',
      epochNumber: '02',
      phaseTitle: 'Engineering Scale',
      headline: 'Scaling into enterprise cloud platforms and custom software architectures.',
      narrative:
        'As our clients scaled, we established deep engineering centers in India to build complex custom software, microservices architectures, and high-performance cloud applications that power millions of consumer transactions.',
      primaryMetric: {
        value: '100+',
        label: 'Platforms Delivered',
      },
      secondaryMetric: {
        value: '99.9%',
        label: 'Cloud Infrastructure Uptime',
      },
      pillars: [
        {
          title: 'Microservices & APIs',
          subtitle: 'Decoupled, modular cloud backends for enterprise speed.',
          tag: 'Architecture',
        },
        {
          title: 'Continuous Delivery',
          subtitle: 'Automated CI/CD pipelines and production monitoring.',
          tag: 'DevOps',
        },
        {
          title: 'Global Tech Pods',
          subtitle: 'High-velocity full-stack engineers working in sync.',
          tag: 'Scale',
        },
      ],
      themeColor: 'indigo',
      hubLocation: 'India Engineering Centers',
    },
    {
      id: 'epoch-2019',
      year: '2019',
      epochNumber: '03',
      phaseTitle: 'Talent Solutions',
      headline: 'Pioneering on-demand talent pods and contingent engineering staff.',
      narrative:
        'Recognizing that client scale is fundamentally constrained by access to top-tier talent, Mighty Warner launched its dedicated Talent Solutions vertical. We began deploying dedicated SOW engineering pods and high-impact technical hires across global teams.',
      primaryMetric: {
        value: '1,200+',
        label: 'Engineers & Leaders Deployed',
      },
      secondaryMetric: {
        value: '14 Days',
        label: 'Average Pod Ramp-Up Speed',
      },
      pillars: [
        {
          title: 'Dedicated SOW Pods',
          subtitle: 'Fully autonomous squads tailored to product roadmaps.',
          tag: 'Talent Pods',
        },
        {
          title: 'Technical Vetting',
          subtitle: 'Multi-stage code and architectural assessments.',
          tag: 'Top 3% Vetted',
        },
        {
          title: 'Direct Hire & RPO',
          subtitle: 'End-to-end recruitment process outsourcing for enterprises.',
          tag: 'Staffing',
        },
      ],
      themeColor: 'emerald',
      hubLocation: 'Global Talent Network',
    },
    {
      id: 'epoch-2022',
      year: '2022',
      epochNumber: '04',
      phaseTitle: 'Global Expansion & Dubai HQ',
      headline: 'Establishing our Middle East headquarters in Business Bay, Dubai.',
      narrative:
        'We cemented our global presence by establishing our primary headquarters in The Burlington Tower, Business Bay, Dubai. This positioned Mighty Warner at the epicentre of the MENA digital renaissance while expanding our engineering presence across 25+ countries.',
      primaryMetric: {
        value: '25+',
        label: 'Global Markets Served',
      },
      secondaryMetric: {
        value: '3 Studios',
        label: 'Dubai HQ • Kochi • Noida',
      },
      pillars: [
        {
          title: 'MENA Regional Leadership',
          subtitle: 'Strategic consulting for UAE enterprises and government entities.',
          tag: 'Dubai HQ',
        },
        {
          title: 'Trans-Continental Velocity',
          subtitle: '24/7 continuous sprint cycles across timezones.',
          tag: '24/7 Velocity',
        },
        {
          title: 'Cross-Border Delivery',
          subtitle: 'Harmonized legal, SLA, and commercial contracts.',
          tag: 'Enterprise SLA',
        },
      ],
      themeColor: 'rose',
      hubLocation: 'Dubai, UAE & India Hubs',
    },
    {
      id: 'epoch-2024',
      year: '2024+',
      epochNumber: '05',
      phaseTitle: 'AI & The Connected Ecosystem',
      headline: 'Intelligent automation, Next.js dominance, and ecosystem synergy.',
      narrative:
        'Today, Mighty Warner operates as a unified powerhouse. We harness generative AI workflows, intelligent automation, and cutting-edge web performance to build products that redefine industries, serving over 450+ global partners.',
      primaryMetric: {
        value: '450+',
        label: 'Milestones Completed',
      },
      secondaryMetric: {
        value: '98%',
        label: 'Client Retention Rate',
      },
      pillars: [
        {
          title: 'AI Automation Engines',
          subtitle: 'Integrating LLMs, predictive intelligence, and automation.',
          tag: 'AI Workflows',
        },
        {
          title: 'High-Performance Web',
          subtitle: 'Sub-second load times with Next.js App Router and edge CDNs.',
          tag: 'Next.js & React',
        },
        {
          title: 'Full Connected Model',
          subtitle: 'Strategy + Technology + Talent operating as one engine.',
          tag: 'Unified Powerhouse',
        },
      ],
      themeColor: 'amber',
      hubLocation: 'Worldwide Distributed Network',
    },
  ],
};

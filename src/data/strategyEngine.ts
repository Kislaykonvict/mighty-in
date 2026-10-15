import { StrategyBlueprintInputs, StrategyBlueprint } from '@/types/interactive';

export const goalOptions = [
  { id: 'acquire-customers', label: 'Scale Inbound MQLs & Pipeline', category: 'growth' },
  { id: 'modernize-platform', label: 'Rebuild / Modernize Core Software Platform', category: 'tech' },
  { id: 'hire-squad', label: 'Deploy Engineering / Creative Squads Rapidly', category: 'talent' },
  { id: 'category-dominance', label: 'Complete End-to-End Enterprise Transformation', category: 'strategy' },
];

export const industryOptions = [
  { id: 'fintech', label: 'Fintech, Banking & Payments' },
  { id: 'saas', label: 'Enterprise B2B SaaS & Cloud' },
  { id: 'healthtech', label: 'HealthTech & MedTech' },
  { id: 'logistics', label: 'Logistics, Freight & Supply Chain' },
  { id: 'wealth', label: 'Wealth Management & Private Equity' },
  { id: 'ecommerce', label: 'High-Volume Digital Commerce' },
];

export const bottleneckOptions = [
  { id: 'low-conversion', label: 'High traffic but low demo/checkout conversion', focus: 'growth' },
  { id: 'legacy-code', label: 'Monolithic tech debt & slow sprint velocity', focus: 'tech' },
  { id: 'recruiting-lag', label: 'Inability to hire senior developers/leads quickly', focus: 'talent' },
  { id: 'siloed-vendors', label: 'Disjointed agencies with zero unified accountability', focus: 'strategy' },
];

export function generateStrategyBlueprint(inputs: StrategyBlueprintInputs): StrategyBlueprint {
  const isTech = inputs.goal === 'modernize-platform' || inputs.bottleneck === 'legacy-code';
  const isTalent = inputs.goal === 'hire-squad' || inputs.bottleneck === 'recruiting-lag';
  const isGrowth = inputs.goal === 'acquire-customers' || inputs.bottleneck === 'low-conversion';

  let primaryVertical: StrategyBlueprint['primaryVertical'] = 'Integrated Ecosystem';
  if (isGrowth && !isTech && !isTalent) primaryVertical = 'Digital & Growth';
  else if (isTech && !isGrowth && !isTalent) primaryVertical = 'Technology';
  else if (isTalent && !isGrowth && !isTech) primaryVertical = 'Talent Solutions';

  const industryName = industryOptions.find((i) => i.id === inputs.industry)?.label || 'B2B Enterprise';

  return {
    title: `Custom 90-Day Growth Acceleration Blueprint for ${industryName}`,
    strategicTheme:
      primaryVertical === 'Digital & Growth'
        ? 'Authority Positioning & Conversion Funnel Engine'
        : primaryVertical === 'Technology'
        ? 'Decoupled Microservice & High-Throughput Modernization'
        : primaryVertical === 'Talent Solutions'
        ? 'Embedded SOW Squad & Milestone Delivery Framework'
        : 'People + Technology + Growth Unified Sprint',
    primaryVertical,
    keyObjectives: [
      `Eliminate the primary operational bottleneck: ${bottleneckOptions.find((b) => b.id === inputs.bottleneck)?.label || 'Conversion Friction'}`,
      `Establish a high-performance foundation tailored specifically to ${industryName} benchmarks.`,
      `Target a minimum 2.5x to 4x efficiency lift within the first two operating quarters.`,
    ],
    ninetyDayRoadmap: [
      {
        phase: 'Sprint 01: Audit & Foundation',
        days: 'Days 1 – 30',
        focus: 'Deep discovery, technical architecture analysis & positioning alignment',
        actions: [
          'Full-funnel analytics and conversion drop-off diagnostic.',
          'Codebase security, throughput, and dependency audit.',
          'Sprint capacity planning and technical persona scorecard setup.',
        ],
      },
      {
        phase: 'Sprint 02: Build & Deployment',
        days: 'Days 31 – 60',
        focus: 'High-velocity production sprints and core capability rollout',
        actions: [
          'Deploy modular Next.js / full-stack components with sub-second LCP speed.',
          'Integrate unified API gateways and automated webhook pipelines.',
          'Embed pre-vetted senior engineers directly into sprint cycles.',
        ],
      },
      {
        phase: 'Sprint 03: Activation & Scale',
        days: 'Days 61 – 90',
        focus: 'Demand capture, load validation & compounding optimization',
        actions: [
          'Launch programmatic SEO topic clusters and targeted acquisition campaigns.',
          'Execute automated A/B multivariate conversion experiments.',
          'Deliver comprehensive documentation and seamless team knowledge handoff.',
        ],
      },
    ],
    recommendedDisciplines: [
      {
        name: 'Digital & Growth Engine',
        description: 'Brand authority redesign, semantic SEO clusters, and conversion funnel architecture.',
        impact: '+40% to +85% MQL Lift',
      },
      {
        name: 'Custom Platform Architecture',
        description: 'Decoupled NestJS microservices, event-driven message queues, and high-availability cloud infrastructure.',
        impact: '99.99% Uptime & 10x Scalability',
      },
      {
        name: 'Dedicated SOW Engineering Pod',
        description: 'Turnkey squad of senior full-stack engineers and technical leads deployed in under 14 days.',
        impact: '3x Sprint Velocity',
      },
    ],
    projectedOutcomes: [
      {
        metric: '2.8x – 4.2x',
        label: 'Projected Commercial Pipeline Growth',
      },
      {
        metric: '< 14 Days',
        label: 'Time to Active Sprint Deployment',
      },
      {
        metric: '-35%',
        label: 'Estimated Reduction in Operational Friction',
      },
    ],
  };
}

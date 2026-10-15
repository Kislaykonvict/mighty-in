import { AssessmentQuestion, AssessmentResult, AssessmentAnswer } from '@/types/assessment';

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q1-challenge',
    number: 1,
    question: 'What is your biggest current business challenge?',
    subtext: 'Select the primary obstacle limiting your speed or revenue expansion.',
    category: 'challenge',
    options: [
      {
        id: 'c-leads',
        label: 'Generating enough qualified inbound leads & pipeline',
        description: 'Traffic is low or the incoming leads lack budget and decision-making authority.',
        scoreWeight: 14,
        categoryFocus: 'growth',
        capabilityKey: 'Digital & Growth',
      },
      {
        id: 'c-tech',
        label: 'Legacy systems, technical debt, or slow product velocity',
        description: 'Our software and internal systems are struggling to scale with customer demand.',
        scoreWeight: 12,
        categoryFocus: 'tech',
        capabilityKey: 'Technology',
      },
      {
        id: 'c-talent',
        label: 'Hiring bottlenecks and shortage of specialized senior talent',
        description: 'We have product roadmaps ready but lack the engineering or marketing firepower.',
        scoreWeight: 15,
        categoryFocus: 'talent',
        capabilityKey: 'Talent Solutions',
      },
      {
        id: 'c-scaling',
        label: 'Scaling across multiple fronts simultaneously (Brand, Tech, Team)',
        description: 'We need a unified ecosystem approach rather than piecemeal fixes.',
        scoreWeight: 18,
        categoryFocus: 'strategy',
        capabilityKey: 'Integrated Ecosystem',
      },
    ],
  },
  {
    id: 'q2-presence',
    number: 2,
    question: 'How would you describe your current digital presence and brand positioning?',
    subtext: 'Be candid about how prospective enterprise buyers perceive you online.',
    category: 'presence',
    options: [
      {
        id: 'p-outdated',
        label: 'Outdated or unreflective of our true enterprise capabilities',
        description: 'Our website and branding look like a startup from 5+ years ago.',
        scoreWeight: 8,
        categoryFocus: 'growth',
        capabilityKey: 'Branding & UI/UX',
      },
      {
        id: 'p-average',
        label: 'Adequate, but does not clearly differentiate us from competitors',
        description: 'Visitors don’t immediately understand why they should choose us.',
        scoreWeight: 14,
        categoryFocus: 'growth',
        capabilityKey: 'Brand Strategy & CRO',
      },
      {
        id: 'p-modern-low-traffic',
        label: 'Visually modern, but struggling with search visibility & conversion',
        description: 'Looks great, but our organic rankings and conversion rates are sub-par.',
        scoreWeight: 16,
        categoryFocus: 'growth',
        capabilityKey: 'SEO & Performance Marketing',
      },
      {
        id: 'p-strong-scalable',
        label: 'Strong and established, but ready to expand into new markets',
        description: 'Looking to solidify category dominance and roll out sub-brands or apps.',
        scoreWeight: 20,
        categoryFocus: 'strategy',
        capabilityKey: 'Multi-Market Scale',
      },
    ],
  },
  {
    id: 'q3-bottleneck',
    number: 3,
    question: 'What is the biggest operational or technological bottleneck in your organization?',
    subtext: 'Where does momentum slow down the most?',
    category: 'bottleneck',
    options: [
      {
        id: 'b-manual',
        label: 'Manual workflows and disconnected software applications',
        description: 'Employees waste hours moving data across spreadsheets and isolated CRMs/ERPs.',
        scoreWeight: 10,
        categoryFocus: 'tech',
        capabilityKey: 'Workflow Automation & APIs',
      },
      {
        id: 'b-conversion',
        label: 'Traffic drops off before booking a demo or completing onboarding',
        description: 'High friction in user experience and checkout/lead forms.',
        scoreWeight: 12,
        categoryFocus: 'growth',
        capabilityKey: 'Conversion Optimization',
      },
      {
        id: 'b-capacity',
        label: 'Engineering or marketing team at maximum capacity',
        description: 'Burnout risks and delayed product milestones due to head-count shortages.',
        scoreWeight: 14,
        categoryFocus: 'talent',
        capabilityKey: 'Staff Augmentation & SOW Pods',
      },
      {
        id: 'b-coordination',
        label: 'Disjointed vendors pulling in opposite directions',
        description: 'Different agencies for marketing, dev, and staffing with no unified accountability.',
        scoreWeight: 11,
        categoryFocus: 'strategy',
        capabilityKey: 'Ecosystem Architecture',
      },
    ],
  },
  {
    id: 'q4-priority',
    number: 4,
    question: 'What is your primary growth priority for the next 6 to 12 months?',
    subtext: 'Select the goal that executive leadership cares about most.',
    category: 'priority',
    options: [
      {
        id: 'pr-pipeline',
        label: 'Rapidly accelerating high-intent pipeline & revenue growth',
        description: 'Scaling customer acquisition while optimizing CAC and marketing efficiency.',
        scoreWeight: 16,
        categoryFocus: 'growth',
        capabilityKey: 'Growth Engine',
      },
      {
        id: 'pr-platform',
        label: 'Launching or modernizing a mission-critical software platform or app',
        description: 'Upgrading core product architecture to handle 10x user and transaction scale.',
        scoreWeight: 17,
        categoryFocus: 'tech',
        capabilityKey: 'Custom Software Engineering',
      },
      {
        id: 'pr-team',
        label: 'Building a world-class technical or growth team quickly',
        description: 'Securing top 5% engineering, product, or leadership talent without recruitment lag.',
        scoreWeight: 16,
        categoryFocus: 'talent',
        capabilityKey: 'Talent Acquisition',
      },
      {
        id: 'pr-transform',
        label: 'Comprehensive digital transformation across all business pillars',
        description: 'A complete overhaul of brand, web infrastructure, internal systems, and squads.',
        scoreWeight: 19,
        categoryFocus: 'strategy',
        capabilityKey: 'End-to-End Momentum',
      },
    ],
  },
  {
    id: 'q5-capability',
    number: 5,
    question: 'Which capability would create the highest immediate return on investment for you?',
    subtext: 'If you could solve one area with absolute certainty today, what would it be?',
    category: 'capability',
    options: [
      {
        id: 'cap-digital',
        label: 'A complete brand repositioning, high-speed website & SEO engine',
        description: 'Turn your digital footprint into an authoritative client magnet.',
        scoreWeight: 15,
        categoryFocus: 'growth',
        capabilityKey: 'Digital & Growth',
      },
      {
        id: 'cap-tech',
        label: 'Enterprise-grade custom web/mobile app or automated API backend',
        description: 'Rock-solid software engineered for security, speed, and scale.',
        scoreWeight: 15,
        categoryFocus: 'tech',
        capabilityKey: 'Technology',
      },
      {
        id: 'cap-talent',
        label: 'A dedicated senior engineering or creative team pod deployed in weeks',
        description: 'High-performing specialists pre-vetted and ready to ship code immediately.',
        scoreWeight: 15,
        categoryFocus: 'talent',
        capabilityKey: 'Talent Solutions',
      },
      {
        id: 'cap-integrated',
        label: 'A fully connected partner handling Strategy + Technology + Talent',
        description: 'One cohesive team moving all levers of your business forward in unison.',
        scoreWeight: 20,
        categoryFocus: 'strategy',
        capabilityKey: 'Integrated Ecosystem',
      },
    ],
  },
];

export function calculateAssessmentResult(answers: AssessmentAnswer[]): AssessmentResult {
  // Score computation
  let rawScore = 0;
  const categoryCounts: Record<string, number> = {
    growth: 0,
    tech: 0,
    talent: 0,
    strategy: 0,
  };

  answers.forEach((ans) => {
    const question = assessmentQuestions.find((q) => q.id === ans.questionId);
    if (question) {
      const option = question.options.find((o) => o.id === ans.selectedOptionId);
      if (option) {
        rawScore += option.scoreWeight;
        categoryCounts[option.categoryFocus] = (categoryCounts[option.categoryFocus] || 0) + 1;
      }
    }
  });

  // Normalize score between 48 and 96 for realism
  const finalScore = Math.min(96, Math.max(48, Math.round(rawScore)));

  let ratingTitle = 'STRONG FOUNDATION';
  let summary =
    'Your business has established solid operational roots, but untapped leverage across brand positioning, modern software engineering, or team velocity is slowing your momentum.';

  if (finalScore >= 85) {
    ratingTitle = 'HIGH MOMENTUM (SCALE READY)';
    summary =
      'Your organization possesses strong fundamentals and is primed for rapid category leadership through advanced ecosystem alignment and multi-channel scaling.';
  } else if (finalScore >= 70) {
    ratingTitle = 'STRONG FOUNDATION';
    summary =
      'You have solid market traction, but significant revenue is being left on the table due to friction in conversion funnels, technical debt, or hiring capacity.';
  } else {
    ratingTitle = 'TRANSFORMATION READY';
    summary =
      'Substantial immediate upside exists by modernizing your digital presence, automating fragmented workflows, and injecting senior execution talent.';
  }

  // Determine dominant category
  const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];

  let suggestedVerticalId: 'digital-growth' | 'technology' | 'talent-solutions' | 'integrated' = 'integrated';
  if (dominantCategory === 'growth') suggestedVerticalId = 'digital-growth';
  else if (dominantCategory === 'tech') suggestedVerticalId = 'technology';
  else if (dominantCategory === 'talent') suggestedVerticalId = 'talent-solutions';

  return {
    score: finalScore,
    ratingTitle,
    summary,
    scoreBreakdown: {
      digitalVisibility: Math.min(100, Math.round(finalScore * 0.95)),
      technologyReadiness: Math.min(100, Math.round(finalScore * 0.88)),
      teamScalability: Math.min(100, Math.round(finalScore * 0.92)),
      conversionPower: Math.min(100, Math.round(finalScore * 0.85)),
    },
    biggestOpportunities: [
      {
        id: 'opp-1',
        number: '01',
        title: 'Conversion Rate & Funnel Optimization',
        description: 'Re-engineering lead capture mechanisms and narrative flow to eliminate friction for high-intent enterprise buyers.',
        recommendedVertical: 'Digital & Growth',
        actionStep: 'Conduct a comprehensive UI/UX friction audit and implement high-converting landing architectures.',
      },
      {
        id: 'opp-2',
        number: '02',
        title: 'Digital Visibility & Organic Authority',
        description: 'Capturing category-defining search intent through programmatic SEO topic clusters and structured schema.',
        recommendedVertical: 'Digital & Growth',
        actionStep: 'Deploy an authority content cluster to outrank competitors on high-value commercial queries.',
      },
      {
        id: 'opp-3',
        number: '03',
        title: 'Technology Scalability & Workflow Automation',
        description: 'Upgrading core web applications and automating repetitive API pipelines to handle 10x transaction throughput.',
        recommendedVertical: 'Technology',
        actionStep: 'Modernize legacy codebases into decoupled microservices with sub-second response times.',
      },
    ],
    suggestedVerticalId,
    recommendedCta: {
      label: 'Talk to Mighty Warner →',
      href: `/contact?source=assessment&vertical=${suggestedVerticalId}&score=${finalScore}`,
    },
  };
}

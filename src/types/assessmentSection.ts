import { AssessmentQuestion, OpportunityItem } from './assessment';
import { assessmentQuestions } from '@/data/assessment';

export interface AssessmentFeaturePill {
  id: string;
  icon: string; // 'Clock', 'ShieldCheck', 'Sparkles', 'CheckCircle2', 'Award', 'Zap', 'Target', 'Compass', etc.
  text: string;
}

export interface AssessmentRatingTier {
  minScore: number;
  title: string;
  summary: string;
}

export interface AssessmentScoreBreakdownConfig {
  digitalVisibilityLabel: string;
  technologyReadinessLabel: string;
  teamScalabilityLabel: string;
  conversionPowerLabel: string;
}

export interface AssessmentCtaConfig {
  title: string;
  subtitle: string;
  retakeButtonText: string;
  primaryButtonText: string;
  primaryButtonLink: string;
}

export interface AssessmentSectionData {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  featurePills: AssessmentFeaturePill[];
  questions: AssessmentQuestion[];
  scoreBreakdownLabels: AssessmentScoreBreakdownConfig;
  ratingTiers: AssessmentRatingTier[];
  opportunities: OpportunityItem[];
  cta: AssessmentCtaConfig;
  isActive: boolean;
}

export const defaultAssessmentSectionData: AssessmentSectionData = {
  badge: 'SIGNATURE DIAGNOSTIC TOOL',
  title: 'How ready is your business for its',
  highlightedTitle: 'next stage of growth?',
  description:
    'Evaluate your commercial readiness across brand positioning, technology scalability, and team velocity in under 3 minutes.',
  featurePills: [
    {
      id: 'pill-1',
      icon: 'Clock',
      text: 'Takes ~3 minutes',
    },
    {
      id: 'pill-2',
      icon: 'ShieldCheck',
      text: '100% Confidential',
    },
    {
      id: 'pill-3',
      icon: 'Sparkles',
      text: 'Instant Score & Action Plan',
    },
  ],
  questions: assessmentQuestions,
  scoreBreakdownLabels: {
    digitalVisibilityLabel: 'Digital Visibility',
    technologyReadinessLabel: 'Tech Architecture',
    teamScalabilityLabel: 'Team Scalability',
    conversionPowerLabel: 'Conversion Power',
  },
  ratingTiers: [
    {
      minScore: 85,
      title: 'HIGH MOMENTUM (SCALE READY)',
      summary:
        'Your organization possesses strong fundamentals and is primed for rapid category leadership through advanced ecosystem alignment and multi-channel scaling.',
    },
    {
      minScore: 70,
      title: 'STRONG FOUNDATION',
      summary:
        'You have solid market traction, but significant revenue is being left on the table due to friction in conversion funnels, technical debt, or hiring capacity.',
    },
    {
      minScore: 0,
      title: 'TRANSFORMATION READY',
      summary:
        'Substantial immediate upside exists by modernizing your digital presence, automating fragmented workflows, and injecting senior execution talent.',
    },
  ],
  opportunities: [
    {
      id: 'opp-1',
      number: '01',
      title: 'Conversion Rate & Funnel Optimization',
      description:
        'Re-engineering lead capture mechanisms and narrative flow to eliminate friction for high-intent enterprise buyers.',
      recommendedVertical: 'Digital & Growth',
      actionStep:
        'Conduct a comprehensive UI/UX friction audit and implement high-converting landing architectures.',
    },
    {
      id: 'opp-2',
      number: '02',
      title: 'Digital Visibility & Organic Authority',
      description:
        'Capturing category-defining search intent through programmatic SEO topic clusters and structured schema.',
      recommendedVertical: 'Digital & Growth',
      actionStep:
        'Deploy an authority content cluster to outrank competitors on high-value commercial queries.',
    },
    {
      id: 'opp-3',
      number: '03',
      title: 'Technology Scalability & Workflow Automation',
      description:
        'Upgrading core web applications and automating repetitive API pipelines to handle 10x transaction throughput.',
      recommendedVertical: 'Technology',
      actionStep:
        'Modernize legacy codebases into decoupled microservices with sub-second response times.',
    },
  ],
  cta: {
    title: 'Want to explore these opportunities with our architects?',
    subtitle: 'Book a complimentary 30-minute discovery call to review your custom roadmap.',
    retakeButtonText: 'Retake',
    primaryButtonText: 'Talk to Mighty Warner →',
    primaryButtonLink: '/contact?source=assessment',
  },
  isActive: true,
};

import {
  AssessmentSectionData,
  defaultAssessmentSectionData,
} from './assessmentSection';

export interface RoiCalculatorData {
  badge: string;
  title: string;
  highlightedTitle: string;
  subtitle: string;

  // Baseline defaults
  defaultVisitors: number;
  defaultConversionRate: number;
  defaultDealSize: number;

  // Sliders configuration
  visitorsMin: number;
  visitorsMax: number;
  visitorsStep: number;
  conversionRateMin: number;
  conversionRateMax: number;
  conversionRateStep: number;
  dealSizeMin: number;
  dealSizeMax: number;
  dealSizeStep: number;

  // Lift percentages / multipliers
  trafficLiftPercent: number; // e.g. 40 (+40%)
  croLiftPercent: number;     // e.g. 55 (+55%)

  // Output labels & CTA
  liftBadge: string;
  annualLiftLabel: string;
  monthlyRevenueLabel: string;
  pipelineMultiplierLabel: string;
  ctaText: string;
  ctaLink: string;
  disclaimer: string;
  isActive: boolean;
}

export const defaultRoiCalculatorData: RoiCalculatorData = {
  badge: 'FINANCIAL MODELING • COMPENSATING VELOCITY',
  title: 'Revenue ROI & Growth',
  highlightedTitle: 'Impact Calculator.',
  subtitle:
    'Model the compounding revenue gains of paired traffic expansion (+40%) and conversion rate optimization (+55%) on your current baseline.',
  defaultVisitors: 25000,
  defaultConversionRate: 1.2,
  defaultDealSize: 8500,
  visitorsMin: 2000,
  visitorsMax: 200000,
  visitorsStep: 1000,
  conversionRateMin: 0.2,
  conversionRateMax: 5.0,
  conversionRateStep: 0.1,
  dealSizeMin: 1000,
  dealSizeMax: 50000,
  dealSizeStep: 500,
  trafficLiftPercent: 40,
  croLiftPercent: 55,
  liftBadge: 'VERIFIED MW BENCHMARK LIFT',
  annualLiftLabel: 'Projected Annual Revenue Expansion',
  monthlyRevenueLabel: 'Projected Monthly Run-Rate',
  pipelineMultiplierLabel: 'Pipeline Velocity Multiplier',
  ctaText: 'Unlock Projected Revenue',
  ctaLink: '/contact',
  disclaimer:
    'Projections are based on median outcomes across past 100+ client engagements implementing our integrated brand, software, and performance systems.',
  isActive: true,
};

export interface HomeGrowthToolsSectionData {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  diagnosticTabLabel: string;
  roiTabLabel: string;
  defaultActiveTab: 'diagnostic' | 'roi';
  diagnostic: AssessmentSectionData;
  roi: RoiCalculatorData;
  isActive: boolean;
}

export const defaultHomeGrowthToolsSectionData: HomeGrowthToolsSectionData = {
  badge: 'INTERACTIVE ENTERPRISE GROWTH SUITE',
  title: 'Evaluate Commercial Readiness or',
  highlightedTitle: 'Forecast Your ROI.',
  description:
    'Test your business across brand authority, systems scalability, and hiring velocity in 3 minutes, or simulate annual revenue gains from traffic & CRO.',
  diagnosticTabLabel: 'Growth Diagnostic',
  roiTabLabel: 'Revenue ROI Calculator',
  defaultActiveTab: 'diagnostic',
  diagnostic: defaultAssessmentSectionData,
  roi: defaultRoiCalculatorData,
  isActive: true,
};

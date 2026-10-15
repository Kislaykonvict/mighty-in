export interface StrategyBlueprintInputs {
  goal: string;
  industry: string;
  bottleneck: string;
  timeline: string;
  budgetRange: string;
}

export interface StrategyBlueprint {
  title: string;
  strategicTheme: string;
  primaryVertical: 'Digital & Growth' | 'Technology' | 'Talent Solutions' | 'Integrated Ecosystem';
  keyObjectives: string[];
  ninetyDayRoadmap: {
    phase: string;
    days: string;
    focus: string;
    actions: string[];
  }[];
  recommendedDisciplines: {
    name: string;
    description: string;
    impact: string;
  }[];
  projectedOutcomes: {
    metric: string;
    label: string;
  }[];
}

export interface RoiCalculatorInputs {
  monthlyVisitors: number;
  conversionRate: number; // Percentage e.g. 1.5%
  averageDealSize: number; // Dollar value e.g. 5000
  projectedTrafficLift?: number; // e.g. 40%
  projectedCroLift?: number; // e.g. 35%
}

export interface RoiCalculatorOutputs {
  currentMonthlyLeads: number;
  currentMonthlyRevenue: number;
  projectedMonthlyVisitors: number;
  projectedConversionRate: number;
  projectedMonthlyLeads: number;
  projectedMonthlyRevenue: number;
  monthlyRevenueLift: number;
  annualRevenueLift: number;
  roiMultiplier: number;
}

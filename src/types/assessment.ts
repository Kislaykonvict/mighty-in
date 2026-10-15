export interface AssessmentOption {
  id: string;
  label: string;
  description?: string;
  scoreWeight: number; // 0 to 20
  categoryFocus: 'growth' | 'tech' | 'talent' | 'strategy';
  capabilityKey: string;
}

export interface AssessmentQuestion {
  id: string;
  number: number;
  question: string;
  subtext?: string;
  category: 'challenge' | 'presence' | 'bottleneck' | 'priority' | 'capability';
  options: AssessmentOption[];
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface OpportunityItem {
  id: string;
  number: string;
  title: string;
  description: string;
  recommendedVertical: 'Digital & Growth' | 'Technology' | 'Talent Solutions' | 'Integrated Ecosystem';
  actionStep: string;
}

export interface AssessmentResult {
  score: number; // 0 to 100
  ratingTitle: string; // e.g. "STRONG FOUNDATION", "HIGH MOMENTUM", "GROWTH READY", "TRANSFORMATION NEEDED"
  summary: string;
  scoreBreakdown: {
    digitalVisibility: number;
    technologyReadiness: number;
    teamScalability: number;
    conversionPower: number;
  };
  biggestOpportunities: OpportunityItem[];
  suggestedVerticalId: 'digital-growth' | 'technology' | 'talent-solutions' | 'integrated';
  recommendedCta: {
    label: string;
    href: string;
  };
}

export interface AssessmentSubmission {
  sessionId?: string;
  answers: AssessmentAnswer[];
  contactEmail?: string;
  companyName?: string;
  fullName?: string;
  phone?: string;
}

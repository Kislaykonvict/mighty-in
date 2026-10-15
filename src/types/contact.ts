import { BusinessVerticalId } from './business';

export type InquiryTopic = BusinessVerticalId | 'not-sure' | 'ecosystem';

export interface DigitalInquiryDetails {
  websiteUrl?: string;
  marketingChallenge?: string;
  monthlyBudgetRange?: string;
  primaryGoals?: string[];
}

export interface TechnologyInquiryDetails {
  projectType?: 'web-app' | 'mobile-app' | 'custom-software' | 'cloud-platform' | 'integration' | 'other';
  requirementsSummary?: string;
  timeline?: 'immediate' | '1-3-months' | '3-6-months' | 'exploring';
  estimatedBudget?: string;
}

export interface TalentInquiryDetails {
  audienceType: 'employer' | 'candidate';
  requirementType?: 'contingent' | 'direct-hire' | 'sow' | 'executive';
  targetRoles?: string;
  locationPreference?: 'remote' | 'hybrid' | 'onsite';
  experienceYears?: string;
  resumeUrl?: string;
}

export interface ContactRequest {
  topic: InquiryTopic;
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  message: string;
  digitalDetails?: DigitalInquiryDetails;
  technologyDetails?: TechnologyInquiryDetails;
  talentDetails?: TalentInquiryDetails;
  source?: string;
  submittedAt?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  referenceId?: string;
}

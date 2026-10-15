import { BusinessVerticalId } from './business';

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  industry: string;
  quote: string;
  fullQuote?: string;
  verticalId: BusinessVerticalId;
  relatedProjectSlug?: string;
  relatedProjectTitle?: string;
  avatarUrl?: string;
  companyLogoUrl?: string;
  rating?: number;
  highlightedPhrase?: string;
}

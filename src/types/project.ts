import { BusinessVerticalId } from './business';

export interface CaseStudyMetric {
  value: string;
  label: string;
  description?: string;
}

export interface CaseStudySection {
  title: string;
  subtitle?: string;
  content: string[];
  keyTakeaways?: string[];
  image?: string;
  imageAlt?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  verticalId: BusinessVerticalId;
  verticalName: string;
  year: string;
  heroImage: string;
  thumbnailImage: string;
  galleryImages?: string[];
  shortDescription: string;
  tagline: string;
  summary: string;
  challenge: string;
  objectives: string[];
  strategy: string[];
  solution: string;
  technologiesUsed: string[];
  metrics: CaseStudyMetric[];
  featured: boolean;
  testimonialId?: string;
  liveUrl?: string;
  category?: string;
}

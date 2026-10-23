import { Testimonial } from './testimonial';
import { testimonialsData } from '@/data/testimonials';

export interface TestimonialCard {
  id: string;
  clientName: string;
  role: string;
  company: string;
  industry: string;
  quote: string;
  fullQuote?: string;
  verticalId: 'digital-growth' | 'technology' | 'talent-solutions';
  relatedProjectSlug?: string;
  relatedProjectTitle?: string;
  avatarUrl?: string;
  rating?: number;
  highlightedPhrase?: string;
  featured?: boolean;
  order?: number;
}

export interface TestimonialsSectionData {
  badge: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  cards: TestimonialCard[];
}

export const defaultTestimonialsSectionData: TestimonialsSectionData = {
  badge: 'CLIENT REPUTATION & PROOF',
  title: 'Endorsed by executive leadership.',
  subtitle: 'Real testimonials from enterprise CMOs, CTOs, and founders who partnered with Mighty Warner.',
  isActive: true,
  cards: testimonialsData.map((t, idx) => ({
    id: t.id,
    clientName: t.clientName,
    role: t.role,
    company: t.company,
    industry: t.industry,
    quote: t.quote,
    fullQuote: t.fullQuote,
    verticalId: (t.verticalId || 'technology') as 'digital-growth' | 'technology' | 'talent-solutions',
    relatedProjectSlug: t.relatedProjectSlug || '',
    relatedProjectTitle: t.relatedProjectTitle || '',
    avatarUrl: t.avatarUrl || '',
    rating: t.rating ?? 5,
    highlightedPhrase: t.highlightedPhrase ?? '',
    featured: true,
    order: idx,
  })),
};

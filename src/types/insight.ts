import { BusinessVerticalId } from './business';

export type InsightCategory = 'Growth' | 'Technology' | 'Business' | 'Talent';

export interface InsightAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface Insight {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: InsightCategory;
  verticalId?: BusinessVerticalId;
  readTime: string;
  publishedAt: string;
  author: InsightAuthor;
  coverImage: string;
  excerpt: string;
  content: string[]; // Structured paragraphs/subheadings
  keyTakeaways: string[];
  tags: string[];
  featured?: boolean;
}

export interface InsightPageSettings {
  title: string;
  titleAccent: string;
  description: string;
}

export const defaultInsightPageSettings: InsightPageSettings = {
  title: 'The Mighty',
  titleAccent: 'Blog',
  description:
    'A practical look at how SEO, performance ads, engineering, and brand strategy work together to drive compounding growth.',
};


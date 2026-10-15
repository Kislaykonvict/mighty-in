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

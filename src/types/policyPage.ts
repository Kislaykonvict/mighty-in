export interface PolicyPageData {
  id?: string;
  slug: string;
  title: string;
  heroImage: string;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroBadge?: string | null;
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive: boolean;
  order?: number;
  updatedAt?: string | Date;
  createdAt?: string | Date;
}

export interface PolicyPageSummary {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  updatedAt: string | Date;
  heroImage: string;
}

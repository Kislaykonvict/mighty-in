import { Insight, InsightCategory } from '@/types/insight';
import { insightsData } from '@/data/insights';
import { apiClient, isMockEnabled } from './client';

export const insightsApi = {
  async getAll(category?: InsightCategory | 'All'): Promise<Insight[]> {
    if (isMockEnabled) {
      if (!category || category === 'All') {
        return Promise.resolve(insightsData);
      }
      return Promise.resolve(insightsData.filter((i) => i.category === category));
    }
    try {
      const query = category && category !== 'All' ? `?category=${category}` : '';
      return await apiClient<Insight[]>(`/insights${query}`);
    } catch {
      if (!category || category === 'All') return insightsData;
      return insightsData.filter((i) => i.category === category);
    }
  },

  async getFeatured(): Promise<Insight | null> {
    const all = await this.getAll();
    return all.find((i) => i.featured) || all[0] || null;
  },

  async getBySlug(slug: string): Promise<Insight | null> {
    if (isMockEnabled) {
      const found = insightsData.find((i) => i.slug === slug);
      return Promise.resolve(found || null);
    }
    try {
      return await apiClient<Insight>(`/insights/${slug}`);
    } catch {
      const found = insightsData.find((i) => i.slug === slug);
      return found || null;
    }
  },

  async getRelated(currentSlug: string, category: string): Promise<Insight[]> {
    const all = await this.getAll();
    return all.filter((i) => i.slug !== currentSlug && i.category === category).slice(0, 2);
  },
};

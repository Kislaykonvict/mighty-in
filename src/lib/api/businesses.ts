import { BusinessVertical, BusinessVerticalId } from '@/types/business';
import { businessesData } from '@/data/businesses';
import { apiClient, isMockEnabled } from './client';

export const businessesApi = {
  async getAll(): Promise<BusinessVertical[]> {
    if (isMockEnabled) {
      return Promise.resolve(businessesData);
    }
    try {
      return await apiClient<BusinessVertical[]>('/businesses');
    } catch {
      return businessesData;
    }
  },

  async getBySlug(slug: string): Promise<BusinessVertical | null> {
    if (isMockEnabled) {
      const found = businessesData.find((b) => b.slug === slug || b.id === slug);
      return Promise.resolve(found || null);
    }
    try {
      return await apiClient<BusinessVertical>(`/businesses/${slug}`);
    } catch {
      const found = businessesData.find((b) => b.slug === slug || b.id === slug);
      return found || null;
    }
  },

  async getById(id: BusinessVerticalId): Promise<BusinessVertical | null> {
    return this.getBySlug(id);
  },
};

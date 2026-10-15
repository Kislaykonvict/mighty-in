import { Testimonial } from '@/types/testimonial';
import { testimonialsData } from '@/data/testimonials';
import { apiClient, isMockEnabled } from './client';

export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    if (isMockEnabled) {
      return Promise.resolve(testimonialsData);
    }
    try {
      return await apiClient<Testimonial[]>('/testimonials');
    } catch {
      return testimonialsData;
    }
  },

  async getByVertical(verticalId: string): Promise<Testimonial[]> {
    const all = await this.getAll();
    return all.filter((t) => t.verticalId === verticalId);
  },

  async getById(id: string): Promise<Testimonial | null> {
    const all = await this.getAll();
    return all.find((t) => t.id === id) || null;
  },
};

import { Project } from '@/types/project';
import { apiClient } from './client';

export const projectsApi = {
  async getAll(filterVertical?: string): Promise<Project[]> {
    try {
      const query = filterVertical && filterVertical !== 'all' ? `?vertical=${filterVertical}` : '';
      return await apiClient<Project[]>(`/projects${query}`);
    } catch {
      return [];
    }
  },

  async getFeatured(): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.featured);
  },

  async getBySlug(slug: string): Promise<Project | null> {
    try {
      return await apiClient<Project>(`/projects/${slug}`);
    } catch {
      return null;
    }
  },

  async getRelated(verticalId: string, currentSlug: string): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.verticalId === verticalId && p.slug !== currentSlug).slice(0, 2);
  },
};

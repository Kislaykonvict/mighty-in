import { Project } from '@/types/project';
import { apiClient } from './client';

export const projectsApi = {
  async getAll(filterCategory?: string): Promise<Project[]> {
    try {
      const query = filterCategory && filterCategory !== 'all' ? `?category=${filterCategory}` : '';
      return await apiClient<Project[]>(`/projects${query}`);
    } catch {
      return [];
    }
  },

  async getFeatured(): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.featured && p.published);
  },

  async getById(id: string): Promise<Project | null> {
    try {
      return await apiClient<Project>(`/projects/${id}`);
    } catch {
      return null;
    }
  },

  async getRelated(category: string, currentId: string): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.category === category && p.id !== currentId).slice(0, 2);
  },
};

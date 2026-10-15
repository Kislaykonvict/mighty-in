import { Project } from '@/types/project';
import { projectsData } from '@/data/projects';
import { apiClient, isMockEnabled } from './client';

export const projectsApi = {
  async getAll(filterVertical?: string): Promise<Project[]> {
    if (isMockEnabled) {
      if (!filterVertical || filterVertical === 'all') {
        return Promise.resolve(projectsData);
      }
      return Promise.resolve(projectsData.filter((p) => p.verticalId === filterVertical));
    }
    try {
      const query = filterVertical && filterVertical !== 'all' ? `?vertical=${filterVertical}` : '';
      return await apiClient<Project[]>(`/projects${query}`);
    } catch {
      if (!filterVertical || filterVertical === 'all') return projectsData;
      return projectsData.filter((p) => p.verticalId === filterVertical);
    }
  },

  async getFeatured(): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.featured);
  },

  async getBySlug(slug: string): Promise<Project | null> {
    if (isMockEnabled) {
      const found = projectsData.find((p) => p.slug === slug);
      return Promise.resolve(found || null);
    }
    try {
      return await apiClient<Project>(`/projects/${slug}`);
    } catch {
      const found = projectsData.find((p) => p.slug === slug);
      return found || null;
    }
  },

  async getRelated(verticalId: string, currentSlug: string): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.verticalId === verticalId && p.slug !== currentSlug).slice(0, 2);
  },
};

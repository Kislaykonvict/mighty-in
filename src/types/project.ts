export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnailImage: string;
  liveUrl: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

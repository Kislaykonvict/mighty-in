import { Project } from './project';

export interface HomepageWorkData {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  selectedProjectIds: string[];
  maxDisplay: number;
  isActive: boolean;
  projects?: Project[];
}

export const defaultHomepageWorkData: HomepageWorkData = {
  badge: 'PROVEN CLIENT CASE STUDIES',
  title: "We've built things worth talking about.",
  subtitle: "Explore the businesses, products, experiences, and technical solutions we've helped bring to life.",
  ctaText: 'Explore Complete Portfolio & Case Studies',
  ctaLink: '/portfolio',
  selectedProjectIds: [],
  maxDisplay: 6,
  isActive: true,
};

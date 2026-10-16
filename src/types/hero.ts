export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  videoUrl: string;
  fallbackImageUrl: string;
  overlayOpacity: number;
  isActive: boolean;
}

export const defaultHeroData: HeroData = {
  badge: 'ONE CONNECTED ECOSYSTEM • EST. 2013',
  title: 'Creative staffing for what\'s next.',
  subtitle:
    'Our proprietary recruitment technology, decades of expertise, and award-winning teams connect you with elite talent and modern engineering platforms shaping the future of business.',
  ctaText: 'SEARCH JOBS',
  ctaLink: '/work',
  secondaryCtaText: 'FIND TALENT',
  secondaryCtaLink: '/contact',
  videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
  fallbackImageUrl:
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=2000&q=80',
  overlayOpacity: 55,
  isActive: true,
};

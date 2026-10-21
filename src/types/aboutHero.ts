export interface AboutHeroData {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  imageAlt: string;
  scrollTarget?: string;
  isActive?: boolean;
}

export const defaultAboutHeroData: AboutHeroData = {
  headline: 'We combine strategy, technology, and talent to solve the most complex business challenges.',
  subheadline: '',
  ctaText: 'Explore Our Method',
  ctaLink: '/approach',
  backgroundImage: '/images/about/hero-versett.jpg',
  imageAlt: 'Mighty Warner Strategic Technology & Digital Solutions',
  scrollTarget: '#trajectory',
  isActive: true,
};

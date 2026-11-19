export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  pageSlug: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FaqPageOption {
  value: string;
  label: string;
  group: string;
}

export const STANDARD_FAQ_PAGES: FaqPageOption[] = [
  { value: 'global', label: 'Global (All Pages)', group: 'General' },
  { value: '/', label: 'Homepage (/)', group: 'Core Pages' },
  { value: '/about', label: 'About Us (/about)', group: 'Core Pages' },
  { value: '/team', label: 'Team (/team)', group: 'Core Pages' },
  { value: '/work', label: 'Work & Portfolio (/work)', group: 'Core Pages' },
  { value: '/contact', label: 'Contact (/contact)', group: 'Core Pages' },
  { value: '/insights', label: 'Insights & Blog (/insights)', group: 'Core Pages' },
  { value: '/businesses/digital-growth', label: 'Digital & Growth (/businesses/digital-growth)', group: 'Business Verticals' },
  { value: '/businesses/technology', label: 'Technology (/businesses/technology)', group: 'Business Verticals' },
  { value: '/businesses/talent-solutions', label: 'Talent Solutions (/businesses/talent-solutions)', group: 'Business Verticals' },
];

export const STANDARD_FAQ_CATEGORIES = [
  'general',
  'services',
  'process',
  'pricing',
  'technical',
  'partnership',
];

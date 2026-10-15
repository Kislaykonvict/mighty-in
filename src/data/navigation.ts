export interface NavDropdownItem {
  name: string;
  href: string;
  description: string;
  tagline: string;
  color: string;
  subItems: string[];
}

export interface NavItem {
  name: string;
  href: string;
  isDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
}

export const navItems: NavItem[] = [
  {
    name: 'Businesses',
    href: '/businesses',
    isDropdown: true,
    dropdownItems: [
      {
        name: 'Digital & Growth',
        href: '/businesses/digital-growth',
        tagline: 'Make your business impossible to ignore.',
        description: 'Brand strategy, high-speed web experiences, SEO dominance, and performance marketing.',
        color: 'from-orange-500 to-rose-500',
        subItems: ['Strategy', 'Branding', 'Web Design & Dev', 'SEO', 'Paid Media', 'CRO'],
      },
      {
        name: 'Technology',
        href: '/businesses/technology',
        tagline: 'Build the systems your business needs next.',
        description: 'Web & mobile applications, custom software platforms, microservices, and automation.',
        color: 'from-blue-500 to-cyan-500',
        subItems: ['Web Apps', 'Mobile Apps', 'Custom Software', 'APIs & Integrations', 'AI Automation'],
      },
      {
        name: 'Talent Solutions',
        href: '/businesses/talent-solutions',
        tagline: 'Build the team behind the business.',
        description: 'Contingent staffing, direct hire, dedicated SOW engineering pods, and executive search.',
        color: 'from-emerald-500 to-teal-500',
        subItems: ['Contingent Staffing', 'Direct Hire', 'SOW Pods', 'Talent Acquisition (RPO)'],
      },
    ],
  },
  {
    name: 'Work',
    href: '/work',
  },
  {
    name: 'Growth Lab',
    href: '/growth-lab',
  },
  {
    name: 'Approach',
    href: '/approach',
  },
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Insights',
    href: '/insights',
  },
];

export const footerLinks = {
  businesses: [
    { name: 'Digital & Growth', href: '/businesses/digital-growth' },
    { name: 'Technology & Software', href: '/businesses/technology' },
    { name: 'Talent Solutions', href: '/businesses/talent-solutions' },
    { name: 'All Capabilities', href: '/businesses' },
  ],
  company: [
    { name: 'About Mighty Warner', href: '/about' },
    { name: 'Global Office Hubs', href: '/#global-offices' },
    { name: 'The Mighty Warner Method', href: '/approach' },
    { name: 'Selected Work & Case Studies', href: '/work' },
    { name: 'Insights & Thought Leadership', href: '/insights' },
    { name: 'Growth Assessment', href: '/assessment' },
  ],
  services: [
    { name: 'Web Applications', href: '/businesses/technology' },
    { name: 'SEO & Growth Marketing', href: '/businesses/digital-growth' },
    { name: 'Dedicated Engineering Pods', href: '/businesses/talent-solutions' },
    { name: 'Brand & Visual Identity', href: '/businesses/digital-growth' },
    { name: 'Custom Cloud Platforms', href: '/businesses/technology' },
  ],
  contact: [
    { name: 'Start a Conversation', href: '/contact' },
    { name: 'Global Locations & Desks', href: '/contact#global-offices' },
    { name: 'Employer Hiring Portal', href: '/contact?topic=talent-solutions&type=employer' },
    { name: 'Candidate Career Network', href: '/contact?topic=talent-solutions&type=candidate' },
    { name: 'Take Growth Diagnostic', href: '/assessment' },
  ],
};

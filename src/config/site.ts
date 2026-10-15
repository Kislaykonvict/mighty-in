export const siteConfig = {
  name: 'Mighty Warner',
  shortName: 'Mighty Warner',
  description:
    'One company. Multiple ways to move your business forward. Mighty Warner brings together Digital & Growth, Technology, and Talent Solutions under one connected ecosystem.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mightywarner.com',
  ogImage: '/images/og/mighty-warner-og.jpg',
  establishedYear: 2013,
  founder: 'Mighty Warner Leadership',
  links: {
    twitter: 'https://twitter.com/mightywarner',
    linkedin: 'https://www.linkedin.com/company/mighty-warner',
    github: 'https://github.com/mightywarner',
  },
  contact: {
    email: 'hello@mightywarner.com',
    phone: '+1 (800) 555-MWARNER',
    headquarters: 'Global Offices (North America, APAC, EMEA)',
  },
  stats: {
    yearsInBusiness: '13+',
    projectsDelivered: '450+',
    marketsServed: '25+',
    clientSatisfaction: '98%',
    activeSpecialists: '180+',
  },
  pillars: [
    {
      id: 'digital-growth',
      name: 'Digital & Growth',
      headline: 'Build a brand',
      theme: 'growth',
      color: '#FF5E3A',
      href: '/businesses/digital-growth',
    },
    {
      id: 'technology',
      name: 'Technology',
      headline: 'Build a product',
      theme: 'tech',
      color: '#3B82F6',
      href: '/businesses/technology',
    },
    {
      id: 'talent-solutions',
      name: 'Talent Solutions',
      headline: 'Build a team',
      theme: 'talent',
      color: '#10B981',
      href: '/businesses/talent-solutions',
    },
  ],
};

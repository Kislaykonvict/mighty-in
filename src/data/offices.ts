export interface OfficeLocation {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  role: string;
  description: string;
  address: string;
  fullAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // Cobe uses [lat, lng] format normalized between -PI/2 to PI/2
  cobeLocation: [number, number];
  timezone: string;
  timezoneLabel: string;
  utcOffset: string;
  phoneNumbers: {
    label: string;
    number: string;
    link: string;
    isPrimary?: boolean;
    isTollFree?: boolean;
  }[];
  whatsapp?: {
    number: string;
    link: string;
  };
  email: string;
  specialties: string[];
  teamSizeBadge: string;
  established: string;
}

export const MIGHTY_OFFICES: OfficeLocation[] = [
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    role: 'Middle East & Regional HQ',
    description:
      'Our primary MENA executive hub driving digital strategy, enterprise ICT transformations, and high-impact regional brand campaigns.',
    address: 'Office #816, 8th Floor, The Burlington Tower, Marasi Drive, Business Bay',
    fullAddress: 'Office #816, 8th Floor, The Burlington Tower, Marasi Drive, Business Bay - Dubai, UAE',
    coordinates: {
      lat: 25.1872,
      lng: 55.2744,
    },
    cobeLocation: [25.1872, 55.2744],
    timezone: 'Asia/Dubai',
    timezoneLabel: 'GST (Gulf Standard Time)',
    utcOffset: 'UTC+4',
    phoneNumbers: [
      {
        label: 'UAE Toll Free',
        number: '800-644-489',
        link: 'tel:800644489',
        isTollFree: true,
        isPrimary: true,
      },
      {
        label: 'Direct Line',
        number: '+971 54 586 4310',
        link: 'tel:+971545864310',
      },
    ],
    whatsapp: {
      number: '+971 54 586 4310',
      link: 'https://wa.me/971545864310?text=Hello%20Mighty%20Warner%20Dubai%20Team',
    },
    email: 'dubai@mightywarner.com',
    specialties: ['Enterprise ICT Solutions', 'AI & Digital Growth', 'MENA Market Expansion', 'Omnichannel Marketing'],
    teamSizeBadge: '45+ Specialists',
    established: '2016',
  },
  {
    id: 'usa',
    city: 'Albany, NY',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    role: 'North America Commercial Hub',
    description:
      'Executive headquarters for US commercial operations, talent acquisition, direct-hire contingent staffing, and enterprise technology contracts.',
    address: '90 State Street, Ste 700 Office 40, Albany, NY 12207',
    fullAddress: '90 State Street, Ste 700 Office 40, Albany, NY 12207, USA',
    coordinates: {
      lat: 42.6526,
      lng: -73.7562,
    },
    cobeLocation: [42.6526, -73.7562],
    timezone: 'America/New_York',
    timezoneLabel: 'EST / EDT (Eastern Time)',
    utcOffset: 'UTC-5',
    phoneNumbers: [
      {
        label: 'USA Toll Free',
        number: '+1-844-280-0234',
        link: 'tel:+18442800234',
        isTollFree: true,
        isPrimary: true,
      },
      {
        label: 'Direct Office',
        number: '+1-909-505-2719',
        link: 'tel:+19095052719',
      },
    ],
    whatsapp: {
      number: '+1-914-540-6762',
      link: 'https://wa.me/19145406762?text=Hello%20Mighty%20Warner%20USA%20Team',
    },
    email: 'usa@mightywarner.com',
    specialties: ['US Staffing & Contingent Placements', 'Direct Hire Executive Search', 'Enterprise Tech Consulting', 'SOW Engagements'],
    teamSizeBadge: '60+ Consultants',
    established: '2018',
  },
  {
    id: 'canada',
    city: 'Mississauga, ON',
    country: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    role: 'Americas Technology Centre',
    description:
      'North American delivery and client relationship center catering to cross-border enterprise architecture and cloud engineering.',
    address: '2 Robert Speck Pkwy, Mississauga, Ontario',
    fullAddress: '2 Robert Speck Pkwy, Mississauga, Ontario, L4Z 1H8, Canada',
    coordinates: {
      lat: 43.5930,
      lng: -79.6416,
    },
    cobeLocation: [43.5930, -79.6416],
    timezone: 'America/Toronto',
    timezoneLabel: 'EDT / EST',
    utcOffset: 'UTC-5',
    phoneNumbers: [
      {
        label: 'North America Desk',
        number: '+1-844-280-0234',
        link: 'tel:+18442800234',
        isTollFree: true,
        isPrimary: true,
      },
    ],
    whatsapp: {
      number: '+1-914-540-6762',
      link: 'https://wa.me/19145406762?text=Hello%20Mighty%20Warner%20Canada%20Team',
    },
    email: 'canada@mightywarner.com',
    specialties: ['Cloud Infrastructure', 'Product Modernization', 'Cross-Border Talent', 'SaaS Engineering'],
    teamSizeBadge: '30+ Engineers',
    established: '2020',
  },
  {
    id: 'india',
    city: 'Noida (NCR)',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    role: 'Global Engineering & Innovation Center',
    description:
      'Our primary 24/7 technical powerhouse housing 150+ engineers, UI/UX designers, DevOps specialists, and digital marketing strategists.',
    address: 'C 56/25, Sector-62, G.B. Nagar, Noida, Uttar Pradesh - 201301',
    fullAddress: 'C 56/25, Sector-62, G.B. Nagar, Noida, Uttar Pradesh - 201301, India',
    coordinates: {
      lat: 28.6280,
      lng: 77.3649,
    },
    cobeLocation: [28.6280, 77.3649],
    timezone: 'Asia/Kolkata',
    timezoneLabel: 'IST (Indian Standard Time)',
    utcOffset: 'UTC+5:30',
    phoneNumbers: [
      {
        label: 'Primary Desk',
        number: '+91 95825 58888',
        link: 'tel:+919582558888',
        isPrimary: true,
      },
      {
        label: 'Support Desk',
        number: '+91 81388 136618',
        link: 'tel:+9181388136618',
      },
    ],
    whatsapp: {
      number: '+919582558888',
      link: 'https://wa.me/919582558888?text=Hello%20Mighty%20Warner%20India%20Team',
    },
    email: 'india@mightywarner.com',
    specialties: ['Full-Stack Engineering', 'Dedicated Pods & Staff Augmentation', 'Performance SEO & SEM', '24/7 Global Delivery'],
    teamSizeBadge: '150+ Technologists',
    established: '2015',
  },
];

export interface GlobalNetworkStat {
  label: string;
  value: string;
  subtext: string;
}

export const GLOBAL_NETWORK_STATS: GlobalNetworkStat[] = [
  {
    label: 'Global Hubs',
    value: '4 Offices',
    subtext: 'UAE, USA, Canada, India',
  },
  {
    label: 'Worldwide Coverage',
    value: '24/7 Follow-the-Sun',
    subtext: 'Continuous delivery across 3 continents',
  },
  {
    label: 'Talent Network',
    value: '250+ In-House',
    subtext: 'Engineers, strategists & recruiters',
  },
  {
    label: 'Client Footprint',
    value: '20+ Countries',
    subtext: 'Delivering enterprise excellence globally',
  },
];

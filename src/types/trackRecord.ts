export interface TrackRecordCard {
  id: string;
  value: string;
  label: string;
  subtext: string;
  iconName?: string;
  iconUrl?: string | null;
  tag?: string;
}

export interface TrackRecordData {
  badge: string;
  headlineLine1: string;
  headlineLine2: string;
  subtitle: string;
  cards: TrackRecordCard[];
  industries: string[];
  isActive: boolean;
}

export const defaultTrackRecordData: TrackRecordData = {
  badge: 'PROVEN TRACK RECORD',
  headlineLine1: 'Building businesses',
  headlineLine2: 'since 2013.',
  subtitle:
    'Verified institutional track record across enterprise software delivery, high-velocity brand growth, and talent scaling.',
  cards: [
    {
      id: 'stat-1',
      value: '13+',
      label: 'Years in Business',
      subtext: 'Continuous innovation since 2013',
      iconName: 'Award',
      iconUrl: null,
      tag: 'VERIFIED',
    },
    {
      id: 'stat-2',
      value: '450+',
      label: 'Projects Delivered',
      subtext: 'Web apps, platforms & growth engines',
      iconName: 'FileText',
      iconUrl: null,
      tag: 'VERIFIED',
    },
    {
      id: 'stat-3',
      value: '25+',
      label: 'Global Markets',
      subtext: 'North America, EMEA & APAC',
      iconName: 'Globe',
      iconUrl: null,
      tag: 'VERIFIED',
    },
    {
      id: 'stat-4',
      value: '180+',
      label: 'Vetted Specialists',
      subtext: 'Engineers, strategists & designers',
      iconName: 'Users',
      iconUrl: null,
      tag: 'VERIFIED',
    },
    {
      id: 'stat-5',
      value: '98%',
      label: 'Satisfaction Rating',
      subtext: 'Measured on long-term retainers',
      iconName: 'ShieldCheck',
      iconUrl: null,
      tag: 'VERIFIED',
    },
  ],
  industries: [
    'Fintech & Payments',
    'Enterprise SaaS',
    'Healthcare & MedTech',
    'Supply Chain & Freight',
    'Wealth Management',
    'Digital Commerce',
  ],
  isActive: true,
};

import { MIGHTY_OFFICES, GLOBAL_NETWORK_STATS, OfficeLocation, GlobalNetworkStat } from '@/data/offices';

export type { OfficeLocation, GlobalNetworkStat };

export interface GlobalOfficesData {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  cycleBannerText: string;
  stats: GlobalNetworkStat[];
  offices: OfficeLocation[];
  isActive: boolean;
}

export const defaultGlobalOfficesData: GlobalOfficesData = {
  badge: 'GLOBAL PRESENCE & REGIONAL HUBS',
  title: 'Local Proximity.',
  highlightedTitle: 'Global Velocity.',
  description:
    'With strategically positioned executive offices across the UAE, United States, Canada, and India, Mighty Warner delivers 24/7 follow-the-sun execution and localized leadership for fast-growing enterprises worldwide.',
  cycleBannerText: 'EST (US) ➔ GST (UAE) ➔ IST (India)',
  stats: GLOBAL_NETWORK_STATS,
  offices: MIGHTY_OFFICES,
  isActive: true,
};

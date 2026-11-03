import React from 'react';
import { GlobalOfficesManagementView } from '@/components/admin/GlobalOfficesManagementView';

export const metadata = {
  title: 'Global Office Presence Management | Mighty Warner Admin',
  description: 'Manage executive regional hubs, office locations, coordinates, timezones, and global statistics',
};

export default function AdminGlobalOfficesPage() {
  return <GlobalOfficesManagementView />;
}

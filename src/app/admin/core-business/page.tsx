import React from 'react';
import { CoreBusinessManagementView } from '@/components/admin/CoreBusinessManagementView';

export const metadata = {
  title: 'Core Business Showcase Configuration | Mighty Warner Admin',
  description: 'Manage homepage services showcase, scroll stacking cards, and diagram assets',
};

export default function AdminCoreBusinessPage() {
  return <CoreBusinessManagementView />;
}

import React from 'react';
import { FinalCtaManagementView } from '@/components/admin/FinalCtaManagementView';

export const metadata = {
  title: 'Conversion CTA Configuration | Mighty Warner Admin',
  description: 'Manage homepage final conversion call-to-action, narrative persuasion copy, and assessment links',
};

export default function AdminFinalCtaPage() {
  return <FinalCtaManagementView />;
}

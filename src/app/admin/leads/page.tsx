import React from 'react';
import { LeadsManagementView } from '@/components/admin/LeadsManagementView';

export const metadata = {
  title: 'Lead Submissions & Inquiries | Mighty Warner Admin',
  description: 'Manage and review incoming contact inquiries, consultation requests, and client briefs',
};

export default function AdminLeadsPage() {
  return <LeadsManagementView />;
}

import React from 'react';
import { PoliciesManagementView } from '@/components/admin/PoliciesManagementView';

export const metadata = {
  title: 'Policy & Legal Pages Management | Mighty Warner Admin',
  description: 'Manage Terms and Conditions, Disclaimer, Privacy Policy, and Refund Policy with full-screen hero and rich content editor.',
};

export default function AdminPoliciesPage() {
  return <PoliciesManagementView />;
}

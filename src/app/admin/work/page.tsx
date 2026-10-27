import React from 'react';
import { WorkPortfolioManagementView } from '@/components/admin/WorkPortfolioManagementView';

export const metadata = {
  title: 'Work Portfolio & Case Studies | Mighty Warner Admin',
  description: 'Manage client case studies, metrics, portfolio items, and work page editorial banners',
};

export default function AdminWorkPage() {
  return <WorkPortfolioManagementView />;
}

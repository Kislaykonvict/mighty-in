import React from 'react';
import { HomepageProjectsManagementView } from '@/components/admin/HomepageProjectsManagementView';

export const metadata = {
  title: 'Homepage Featured Projects | Mighty Warner Admin',
  description: 'Manage featured client work, project sequencing, and case study showcase on the homepage',
};

export default function AdminHomepageProjectsPage() {
  return <HomepageProjectsManagementView />;
}

import React from 'react';
import { HeroManagementView } from '@/components/admin/HeroManagementView';

export const metadata = {
  title: 'Hero Section Configuration | Mighty Warner Admin',
  description: 'Manage full-screen background video, typography, and call-to-actions for the homepage hero',
};

export default function AdminHeroPage() {
  return <HeroManagementView />;
}

import React from 'react';
import { TrackRecordManagementView } from '@/components/admin/TrackRecordManagementView';

export const metadata = {
  title: 'Proven Track Record Configuration | Mighty Warner Admin',
  description: 'Manage institutional metrics, custom logos, titles, and trusted industry sectors',
};

export default function AdminTrackRecordPage() {
  return <TrackRecordManagementView />;
}

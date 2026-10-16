import React from 'react';
import { UserManagementView } from '@/components/admin/UserManagementView';

export const metadata = {
  title: 'User Management | Mighty Warner Admin',
  description: 'Manage platform administrators, roles, and access credentials',
};

export default function AdminUsersPage() {
  return <UserManagementView />;
}

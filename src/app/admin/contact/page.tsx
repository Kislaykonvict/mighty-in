import React from 'react';
import { ContactManagementView } from '@/components/admin/ContactManagementView';

export const metadata = {
  title: 'Contact Page Configuration | Mighty Warner Admin',
  description: 'Manage hero headlines, topic options, form fields, and direct channels for the Contact page',
};

export default function AdminContactPage() {
  return <ContactManagementView />;
}

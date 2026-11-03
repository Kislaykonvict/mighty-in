import React from 'react';
import { AssessmentManagementView } from '@/components/admin/AssessmentManagementView';

export const metadata = {
  title: 'Assessment & Diagnostic Configuration | Mighty Warner Admin',
  description:
    'Manage 3-minute diagnostic hero headlines, metadata badges, questions, options, scoring tiers, and opportunities',
};

export default function AdminAssessmentPage() {
  return <AssessmentManagementView />;
}

export type AnalyticsEventType =
  | 'hero_business_selected'
  | 'business_page_viewed'
  | 'service_clicked'
  | 'project_viewed'
  | 'case_study_viewed'
  | 'assessment_started'
  | 'assessment_answered'
  | 'assessment_completed'
  | 'contact_started'
  | 'contact_submitted'
  | 'cta_clicked'
  | 'challenge_selected'
  | 'method_step_clicked';

export interface AnalyticsEvent {
  event: AnalyticsEventType;
  properties?: Record<string, string | number | boolean | undefined | null>;
  timestamp?: number;
}

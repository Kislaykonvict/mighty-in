import { AnalyticsEvent, AnalyticsEventType } from '@/types/analytics';

class AnalyticsService {
  private isProduction = process.env.NODE_ENV === 'production';

  track(event: AnalyticsEventType, properties?: Record<string, string | number | boolean | undefined | null>) {
    const payload: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };

    if (!this.isProduction) {
      console.log(`[Analytics Track] ${event}`, properties ?? {});
    }

    // When integrating with Google Analytics 4 / Segment / PostHog / Plausible:
    if (typeof window !== 'undefined') {
      try {
        // Example: window.gtag?.('event', event, properties);
        // Example: window.plausible?.(event, { props: properties });
        window.dispatchEvent(
          new CustomEvent('mw:analytics', {
            detail: payload,
          })
        );
      } catch (err) {
        console.error('Analytics dispatch error:', err);
      }
    }
  }

  trackHeroBusinessSelect(businessId: string, headline: string) {
    this.track('hero_business_selected', { businessId, headline });
  }

  trackBusinessPageView(businessSlug: string) {
    this.track('business_page_viewed', { businessSlug });
  }

  trackServiceClick(serviceId: string, verticalId: string) {
    this.track('service_clicked', { serviceId, verticalId });
  }

  trackProjectView(projectSlug: string, verticalId: string) {
    this.track('project_viewed', { projectSlug, verticalId });
  }

  trackAssessmentStart() {
    this.track('assessment_started');
  }

  trackAssessmentAnswer(questionId: string, optionId: string, stepNumber: number) {
    this.track('assessment_answered', { questionId, optionId, stepNumber });
  }

  trackAssessmentComplete(score: number, ratingTitle: string) {
    this.track('assessment_completed', { score, ratingTitle });
  }

  trackContactStart(topic: string) {
    this.track('contact_started', { topic });
  }

  trackContactSubmit(topic: string, company: string) {
    this.track('contact_submitted', { topic, company });
  }

  trackCtaClick(ctaName: string, location: string, destination?: string) {
    this.track('cta_clicked', { ctaName, location, destination });
  }
}

export const analytics = new AnalyticsService();

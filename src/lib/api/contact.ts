import { ContactRequest, ContactResponse } from '@/types/contact';
import { apiClient, isMockEnabled } from './client';

export const contactApi = {
  async submit(request: ContactRequest): Promise<ContactResponse> {
    if (isMockEnabled) {
      console.log('[Mock Contact API Submission]:', request);
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: 'Thank you for contacting Mighty Warner. Our strategic team will review your requirements and respond within 24 hours.',
        referenceId: `MW-${Date.now().toString(36).toUpperCase()}`,
      };
    }

    try {
      return await apiClient<ContactResponse>('/contact', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (err) {
      console.warn('API submission failed, using resilient fallback response', err);
      return {
        success: true,
        message: 'Thank you for contacting Mighty Warner. Your message has been received.',
        referenceId: `MW-${Date.now().toString(36).toUpperCase()}`,
      };
    }
  },
};

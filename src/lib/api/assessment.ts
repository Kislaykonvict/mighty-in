import {
  AssessmentQuestion,
  AssessmentSubmission,
  AssessmentResult,
} from '@/types/assessment';
import {
  AssessmentSectionData,
  defaultAssessmentSectionData,
} from '@/types/assessmentSection';
import { assessmentQuestions, calculateAssessmentResult } from '@/data/assessment';
import { apiClient, isMockEnabled } from './client';

export const assessmentApi = {
  async getSectionData(): Promise<AssessmentSectionData> {
    try {
      const res = await fetch('/api/assessment/section');
      const json = await res.json();
      if (json.success && json.data) return json.data;
      return defaultAssessmentSectionData;
    } catch {
      return defaultAssessmentSectionData;
    }
  },
  async getQuestions(): Promise<AssessmentQuestion[]> {
    if (isMockEnabled) {
      return Promise.resolve(assessmentQuestions);
    }
    try {
      return await apiClient<AssessmentQuestion[]>('/assessment/questions');
    } catch {
      return assessmentQuestions;
    }
  },

  async submitAnswers(submission: AssessmentSubmission): Promise<AssessmentResult> {
    if (isMockEnabled) {
      // Calculate locally using deterministic business logic
      const result = calculateAssessmentResult(submission.answers);
      return Promise.resolve(result);
    }
    try {
      return await apiClient<AssessmentResult>('/assessment/submit', {
        method: 'POST',
        body: JSON.stringify(submission),
      });
    } catch {
      return calculateAssessmentResult(submission.answers);
    }
  },
};

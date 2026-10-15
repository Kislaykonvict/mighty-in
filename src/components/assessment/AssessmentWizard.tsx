'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { assessmentQuestions } from '@/data/assessment';
import { AssessmentAnswer, AssessmentResult } from '@/types/assessment';
import { assessmentApi } from '@/lib/api/assessment';
import { AssessmentResultCard } from './AssessmentResultCard';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

export function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const totalSteps = assessmentQuestions.length;
  const currentQuestion = assessmentQuestions[currentStep];

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;

    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id);
    newAnswers.push({
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
    });
    setAnswers(newAnswers);

    analytics.trackAssessmentAnswer(currentQuestion.id, optionId, currentStep + 1);
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate score and complete
      setIsSubmitting(true);
      try {
        const res = await assessmentApi.submitAnswers({ answers });
        setResult(res);
        analytics.trackAssessmentComplete(res.score, res.ratingTitle);
      } catch (err) {
        console.error('Assessment evaluation error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers([]);
    setCurrentStep(0);
    setResult(null);
    analytics.trackAssessmentStart();
  };

  if (result) {
    return <AssessmentResultCard result={result} onReset={handleReset} />;
  }

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#0F1626] border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2.5">
          <span className="flex items-center gap-1.5 text-sky-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            QUESTION {currentStep + 1} OF {totalSteps}
          </span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              {currentQuestion.question}
            </h3>
            {currentQuestion.subtext && (
              <p className="text-xs sm:text-sm text-slate-400">
                {currentQuestion.subtext}
              </p>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswer?.selectedOptionId === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 border flex items-start justify-between gap-4 ${
                    isSelected
                      ? 'bg-white/10 border-sky-400 text-white shadow-lg ring-1 ring-sky-400/30'
                      : 'bg-white/[0.02] border-white/8 hover:border-white/20 hover:bg-white/[0.05] text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-white mb-1">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-xs text-slate-400 leading-relaxed">
                        {option.description}
                      </div>
                    )}
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-sky-500 border-sky-400 text-white'
                        : 'border-white/20 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Wizard Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/8">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentStep === 0}
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="growth"
              size="md"
              disabled={!currentAnswer}
              isLoading={isSubmitting}
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {currentStep === totalSteps - 1 ? 'Calculate My Momentum Score' : 'Next Question'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

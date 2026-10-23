'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Compass, Target, Code, Rocket, TrendingUp } from 'lucide-react';
import { methodSteps } from '@/data/company';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { analytics } from '@/lib/analytics';

const stepIcons = [Compass, Target, Code, Rocket, TrendingUp];

export function MethodSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeStep = methodSteps[activeStepIndex] || methodSteps[0];
  const StepIcon = stepIcons[activeStepIndex] || Compass;

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
    analytics.track('method_step_clicked', { step: methodSteps[index].name });
  };

  return (
    <section className="py-20 sm:py-28 bg-[#DBDBDB] dark:bg-[#080C14] relative border-t border-neutral-300 dark:border-white/8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="THE MIGHTY WARNER METHOD"
          badgeVariant="subtle"
          title="How we move businesses forward."
          subtitle="A battle-tested 5-stage framework designed to de-risk investments, accelerate speed-to-market, and engineer sustainable business momentum."
          align="left"
        />

        {/* Desktop Interactive Timeline */}
        <div className="hidden lg:block mb-12">
          <div className="grid grid-cols-5 gap-3 p-2 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-300 dark:border-white/8 shadow-sm relative">
            {methodSteps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;
              const Icon = stepIcons[idx] || Compass;

              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? 'text-rose-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-rose-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`}
                    />
                  </div>
                  <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                    {step.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {step.headline}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Deep-Dive Card (Desktop) */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.stepNumber}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="p-10 rounded-3xl bg-[#F8FAFC] dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-sm relative"
            >
              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-sky-400/10 border border-rose-200 dark:border-sky-400/20 text-rose-600 dark:text-sky-400 flex items-center justify-center">
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-rose-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                        STAGE {activeStep.stepNumber}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {activeStep.name}: {activeStep.headline}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    {activeStep.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                      Key Deliverables &amp; Artifacts:
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {activeStep.deliverables.map((del) => (
                        <div
                          key={del}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-200 font-medium shadow-2xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-sky-400 shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-4 shadow-xs">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                    Methodology Principle
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {activeStepIndex === 0 && 'Discovery prevents costly technical debt and misaligned creative work before any code or design begins.'}
                    {activeStepIndex === 1 && 'Clear definition turns vague executive goals into measurable sprint KPIs and architectural specs.'}
                    {activeStepIndex === 2 && 'Modular engineering and design token systems ensure rapid iteration with zero spaghetti code.'}
                    {activeStepIndex === 3 && 'Activation connects product launch with aggressive search visibility and multi-channel acquisition.'}
                    {activeStepIndex === 4 && 'Optimization transforms a successful launch into an enduring, high-margin category leader.'}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-200 dark:border-white/10">
                    <span>STEP {activeStepIndex + 1} OF 5</span>
                    <button
                      type="button"
                      onClick={() => setActiveStepIndex((prev) => (prev + 1) % methodSteps.length)}
                      className="text-rose-600 dark:text-sky-400 hover:text-rose-700 dark:hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-6">
          {methodSteps.map((step, idx) => {
            const Icon = stepIcons[idx] || Compass;
            return (
              <div
                key={step.stepNumber}
                className="p-6 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/8 relative shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-sky-400/10 border border-rose-200 dark:border-sky-400/20 text-rose-600 dark:text-sky-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-rose-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                      STAGE {step.stepNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {step.name}
                    </h3>
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  {step.headline}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/5">
                  {step.deliverables.map((del) => (
                    <div key={del} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 dark:text-sky-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

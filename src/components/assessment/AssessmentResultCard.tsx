'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw, CheckCircle2, TrendingUp, Sparkles, Cpu, Users } from 'lucide-react';
import { AssessmentResult } from '@/types/assessment';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

interface AssessmentResultCardProps {
  result: AssessmentResult;
  onReset?: () => void;
}

export function AssessmentResultCard({ result, onReset }: AssessmentResultCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 65) return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#0F1626] border border-white/12 shadow-2xl space-y-8 animate-fade-in">
      {/* Top Header & Score Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 block mb-1">
            DIAGNOSTIC COMPLETE
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Business Momentum Score
          </h3>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            {result.summary}
          </p>
        </div>

        {/* Big Score Radial/Pill */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#080C14] border border-white/10 shadow-inner min-w-[150px]">
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {result.score}
              <span className="text-lg text-slate-500 font-normal">/100</span>
            </div>
            <div className={`mt-2 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${getScoreColor(result.score)}`}>
              {result.ratingTitle}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Score Breakdown Meters */}
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 font-semibold">
          Ecosystem Capability Breakdown
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Digital Visibility</span>
              <span className="text-white font-mono font-bold">{result.scoreBreakdown.digitalVisibility}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${result.scoreBreakdown.digitalVisibility}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Tech Architecture</span>
              <span className="text-white font-mono font-bold">{result.scoreBreakdown.technologyReadiness}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${result.scoreBreakdown.technologyReadiness}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Team Scalability</span>
              <span className="text-white font-mono font-bold">{result.scoreBreakdown.teamScalability}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${result.scoreBreakdown.teamScalability}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Conversion Power</span>
              <span className="text-white font-mono font-bold">{result.scoreBreakdown.conversionPower}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${result.scoreBreakdown.conversionPower}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Biggest Opportunities */}
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 font-semibold">
          Your Highest-Leverage Opportunities
        </div>

        <div className="space-y-3">
          {result.biggestOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-400/10 border border-sky-400/20">
                    {opp.number}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {opp.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {opp.description}
                </p>
                <div className="text-xs font-mono text-slate-400 pt-1">
                  💡 Action step: {opp.actionStep}
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400 shrink-0 self-start sm:self-center">
                {opp.recommendedVertical}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step Conversion Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-emerald-500/10 border border-white/12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white mb-1">
            Want to explore these opportunities with our architects?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300">
            Book a complimentary 30-minute discovery call to review your custom roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onReset}
            >
              Retake
            </Button>
          )}

          <Button
            href={result.recommendedCta.href}
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => analytics.trackCtaClick('Talk to Mighty Warner (Assessment Result)', 'Assessment')}
          >
            {result.recommendedCta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}

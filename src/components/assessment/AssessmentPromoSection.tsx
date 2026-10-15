'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { AssessmentWizard } from './AssessmentWizard';
import { analytics } from '@/lib/analytics';

export function AssessmentPromoSection() {
  const [showInPlaceWizard, setShowInPlaceWizard] = useState(false);

  return (
    <section className="py-20 sm:py-28 bg-[#080C14] relative border-t border-white/8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {!showInPlaceWizard ? (
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#0F1626] via-[#121B30] to-[#0A0E1A] border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SIGNATURE DIAGNOSTIC</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  How ready is your business for its next stage of growth?
                </h2>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                  Take our quick 3-minute diagnostic across brand positioning, web performance, software scalability, and talent velocity to calculate your Business Momentum Score.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant 0-100 Momentum Score</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Identify 3 Highest-Leverage Opportunities</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No Signup or Card Required</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Actionable Architecture Guidance</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInPlaceWizard(true);
                      analytics.trackAssessmentStart();
                    }}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-rose-600 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>Start the 3-minute assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Button
                    href="/assessment"
                    variant="outline"
                    size="lg"
                  >
                    View Full Diagnostic Page
                  </Button>
                </div>
              </div>

              {/* Sample Scorecard Graphic */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#080C14]/90 border border-white/10 shadow-inner space-y-5">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      DIAGNOSTIC BENCHMARK
                    </div>
                    <div className="text-sm font-bold text-white">Mighty Warner Index</div>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    72<span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Brand & Conversion</span>
                      <span className="text-white font-mono">78%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-400 h-full rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>System Architecture</span>
                      <span className="text-white font-mono">84%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full w-[84%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Team Velocity</span>
                      <span className="text-white font-mono">65%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full w-[65%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/8 text-[11px] text-slate-400 italic">
                  &ldquo;Discovered our core conversion bottleneck in 3 minutes.&rdquo;
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Mighty Warner Growth Diagnostic
              </h2>
              <button
                type="button"
                onClick={() => setShowInPlaceWizard(false)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                ✕ Close Assessment
              </button>
            </div>
            <AssessmentWizard />
          </div>
        )}
      </div>
    </section>
  );
}

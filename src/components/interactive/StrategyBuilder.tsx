'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Target,
  Building,
  AlertTriangle,
  FileText,
  Download,
} from 'lucide-react';
import {
  goalOptions,
  industryOptions,
  bottleneckOptions,
  generateStrategyBlueprint,
} from '@/data/strategyEngine';
import { StrategyBlueprint } from '@/types/interactive';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { analytics } from '@/lib/analytics';

export function StrategyBuilder() {
  const [selectedGoal, setSelectedGoal] = useState<string>(goalOptions[0].id);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(industryOptions[0].id);
  const [selectedBottleneck, setSelectedBottleneck] = useState<string>(bottleneckOptions[0].id);
  const [blueprint, setBlueprint] = useState<StrategyBlueprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateStrategyBlueprint({
        goal: selectedGoal,
        industry: selectedIndustry,
        bottleneck: selectedBottleneck,
        timeline: '90-days',
        budgetRange: 'growth',
      });
      setBlueprint(generated);
      setIsGenerating(false);
      analytics.track('cta_clicked', { action: 'generate_strategy_blueprint', goal: selectedGoal });
    }, 450);
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
      {/* Top Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-white/8">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-600 dark:text-sky-400 font-bold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>STRATEGY SYNTHESIZER</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Build Your 90-Day Growth Strategy
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
          Select your target milestone, market vertical, and immediate bottleneck to dynamically synthesize an execution roadmap.
        </p>
      </div>

      {!blueprint ? (
        <div className="space-y-8">
          {/* Step 1: Goal */}
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-3 font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-600 dark:text-sky-400" />
              <span>01. Select Your Primary 90-Day Goal</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalOptions.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-4 rounded-xl text-left border transition-all text-sm font-semibold flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 text-slate-900 dark:bg-sky-500/10 dark:border-sky-400 dark:text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-white/[0.02] dark:border-white/8 dark:hover:border-white/20 dark:text-slate-300'
                    }`}
                  >
                    <span>{g.label}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? 'bg-rose-600 dark:bg-sky-400' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Industry */}
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-3 font-semibold flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-500" />
              <span>02. Select Your Market Industry</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {industryOptions.map((ind) => {
                const isSelected = selectedIndustry === ind.id;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setSelectedIndustry(ind.id)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs font-semibold cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 border-orange-400 text-slate-900 dark:bg-orange-500/10 dark:border-orange-400 dark:text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-white/[0.02] dark:border-white/8 dark:hover:border-white/20 dark:text-slate-300'
                    }`}
                  >
                    {ind.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Bottleneck */}
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-3 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-emerald-500" />
              <span>03. What Is The Biggest Bottleneck?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bottleneckOptions.map((b) => {
                const isSelected = selectedBottleneck === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBottleneck(b.id)}
                    className={`p-4 rounded-xl text-left border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-slate-900 dark:bg-emerald-500/10 dark:border-emerald-400 dark:text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-white/[0.02] dark:border-white/8 dark:hover:border-white/20 dark:text-slate-300'
                    }`}
                  >
                    <span>{b.label}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/8 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              ⚡ Instant 90-day sprint generation
            </span>
            <Button
              type="button"
              variant="growth"
              size="lg"
              isLoading={isGenerating}
              onClick={handleGenerate}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Synthesize 90-Day Strategy Blueprint
            </Button>
          </div>
        </div>
      ) : (
        /* Rendered Blueprint View */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 animate-fade-in"
        >
          {/* Blueprint Title & Badge */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#121B30] dark:to-[#0A0E1A] border border-slate-200 dark:border-white/12 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="subtle" dot>
                {blueprint.primaryVertical}
              </Badge>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                GENERATED SPRINT ROADMAP
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {blueprint.title}
            </h4>

            <div className="text-xs sm:text-sm font-mono text-rose-600 dark:text-sky-400">
              Theme: {blueprint.strategicTheme}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/8">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Key Objectives:</div>
              {blueprint.keyObjectives.map((obj) => (
                <div key={obj} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Sprint Phases */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
              90-Day Sprint Breakdown
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blueprint.ninetyDayRoadmap.map((sprint, idx) => (
                <div
                  key={sprint.phase}
                  className="p-5 rounded-2xl bg-white dark:bg-[#080C14] border border-slate-200 dark:border-white/8 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-600 dark:text-sky-400 font-bold">
                      {sprint.days}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">0{idx + 1}</span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 dark:text-white">{sprint.phase}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{sprint.focus}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/5">
                    {sprint.actions.map((act) => (
                      <div key={act} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-rose-500 dark:text-sky-400">•</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projected Outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 shadow-xs">
            {blueprint.projectedOutcomes.map((out) => (
              <div key={out.label} className="text-center sm:text-left">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{out.metric}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{out.label}</div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setBlueprint(null)}
              className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              ← Modify Inputs &amp; Regenerate
            </button>

            <Button
              href={`/contact?topic=${
                blueprint.primaryVertical === 'Digital & Growth'
                  ? 'digital-growth'
                  : blueprint.primaryVertical === 'Technology'
                  ? 'technology'
                  : 'talent-solutions'
              }&strategyReady=true`}
              variant="growth"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Execute This 90-Day Blueprint With Us
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

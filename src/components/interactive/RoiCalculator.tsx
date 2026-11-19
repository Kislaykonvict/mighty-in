'use client';

import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Users, ArrowRight, RefreshCw, Calculator, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';
import { RoiCalculatorData, defaultRoiCalculatorData } from '@/types/growthTools';

interface RoiCalculatorProps {
  data?: RoiCalculatorData;
  className?: string;
}

export function RoiCalculator({ data = defaultRoiCalculatorData, className = '' }: RoiCalculatorProps) {
  const cfg = data || defaultRoiCalculatorData;

  const [visitors, setVisitors] = useState<number>(cfg.defaultVisitors || 25000);
  const [conversionRate, setConversionRate] = useState<number>(cfg.defaultConversionRate || 1.2);
  const [dealSize, setDealSize] = useState<number>(cfg.defaultDealSize || 8500);

  const trafficMultiplier = 1 + (Number(cfg.trafficLiftPercent) || 40) / 100;
  const croMultiplier = 1 + (Number(cfg.croLiftPercent) || 55) / 100;

  const calculations = useMemo(() => {
    const currentMonthlyLeads = Math.round(visitors * (conversionRate / 100));
    const currentMonthlyRevenue = currentMonthlyLeads * dealSize;

    const projectedVisitors = Math.round(visitors * trafficMultiplier);
    const projectedConversionRate = Number((conversionRate * croMultiplier).toFixed(2));
    const projectedMonthlyLeads = Math.round(projectedVisitors * (projectedConversionRate / 100));
    const projectedMonthlyRevenue = projectedMonthlyLeads * dealSize;

    const monthlyRevenueLift = Math.max(0, projectedMonthlyRevenue - currentMonthlyRevenue);
    const annualRevenueLift = monthlyRevenueLift * 12;
    const pipelineMultiplier = Number((projectedMonthlyRevenue / Math.max(1, currentMonthlyRevenue)).toFixed(1));

    return {
      currentMonthlyLeads,
      currentMonthlyRevenue,
      projectedVisitors,
      projectedConversionRate,
      projectedMonthlyLeads,
      projectedMonthlyRevenue,
      monthlyRevenueLift,
      annualRevenueLift,
      pipelineMultiplier,
    };
  }, [visitors, conversionRate, dealSize, trafficMultiplier, croMultiplier]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleReset = () => {
    setVisitors(cfg.defaultVisitors || 25000);
    setConversionRate(cfg.defaultConversionRate || 1.2);
    setDealSize(cfg.defaultDealSize || 8500);
  };

  // Generate dynamic presets
  const visitorsPresets = useMemo(() => {
    const min = cfg.visitorsMin || 2000;
    const max = cfg.visitorsMax || 200000;
    const p1 = Math.round((min + (max - min) * 0.05) / 1000) * 1000;
    const p2 = Math.round((min + (max - min) * 0.2) / 1000) * 1000;
    const p3 = Math.round((min + (max - min) * 0.5) / 1000) * 1000;
    const p4 = Math.round((min + (max - min) * 0.85) / 1000) * 1000;
    return Array.from(new Set([p1, p2, p3, p4])).filter((v) => v >= min && v <= max);
  }, [cfg.visitorsMin, cfg.visitorsMax]);

  return (
    <div
      className={`p-6 sm:p-10 lg:p-12 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-xl space-y-8 ${className}`}
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>{cfg.badge || 'INTERACTIVE ROI & REVENUE IMPACT SIMULATOR'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cfg.title}{' '}
            {cfg.highlightedTitle && (
              <span className="gradient-text-brand">{cfg.highlightedTitle}</span>
            )}
          </h3>
          {cfg.subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              {cfg.subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start md:self-center px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {/* Main 2-Column Grid: Sliders on Left, Impact Dashboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Sliders */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Monthly Visitors */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080C14] border border-slate-200 dark:border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <span>Monthly Website Visitors</span>
              </label>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {visitors.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={cfg.visitorsMin || 2000}
              max={cfg.visitorsMax || 200000}
              step={cfg.visitorsStep || 1000}
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              {visitorsPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setVisitors(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    visitors === preset
                      ? 'bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-400/20 dark:text-sky-300 dark:border-sky-400/40'
                      : 'bg-slate-200/70 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* 2. Current Conversion Rate */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080C14] border border-slate-200 dark:border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <span>Current Conversion Rate</span>
              </label>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {conversionRate.toFixed(1)}%
              </span>
            </div>

            <input
              type="range"
              min={cfg.conversionRateMin || 0.2}
              max={cfg.conversionRateMax || 5.0}
              step={cfg.conversionRateStep || 0.1}
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              {[0.5, 1.2, 2.5, 4.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setConversionRate(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    conversionRate === preset
                      ? 'bg-orange-100 text-orange-700 border border-orange-300 dark:bg-orange-400/20 dark:text-orange-300 dark:border-orange-400/40'
                      : 'bg-slate-200/70 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Average Deal Size / Customer LTV */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080C14] border border-slate-200 dark:border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Average Deal Size / Customer LTV</span>
              </label>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {formatCurrency(dealSize)}
              </span>
            </div>

            <input
              type="range"
              min={cfg.dealSizeMin || 1000}
              max={cfg.dealSizeMax || 50000}
              step={cfg.dealSizeStep || 500}
              value={dealSize}
              onChange={(e) => setDealSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              {[2500, 8500, 20000, 45000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDealSize(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    dealSize === preset
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-400/20 dark:text-emerald-300 dark:border-emerald-400/40'
                      : 'bg-slate-200/70 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  ${(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Projected Impact Dashboard */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#121B30] dark:via-[#0F1626] dark:to-[#0A0F1A] border border-slate-200 dark:border-white/12 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              {cfg.liftBadge || 'VERIFIED MW BENCHMARK LIFT'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400 text-xs font-mono font-bold">
              {calculations.pipelineMultiplier}x {cfg.pipelineMultiplierLabel || 'Pipeline Lift'}
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              +{formatCurrency(calculations.annualRevenueLift)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {cfg.annualLiftLabel || 'Projected Annual Revenue Expansion'}
            </div>
          </div>

          {/* Comparison Breakdown Cards */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/8">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">CURRENT LEADS/MO</div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-300 font-mono">
                  {calculations.currentMonthlyLeads.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">
                  PROJECTED (+{cfg.croLiftPercent || 55}% CRO)
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {calculations.projectedMonthlyLeads.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">CURRENT RUN-RATE</div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-300 font-mono">
                  {formatCurrency(calculations.currentMonthlyRevenue)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">
                  {cfg.monthlyRevenueLabel || 'PROJECTED RUN-RATE'}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {formatCurrency(calculations.projectedMonthlyRevenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-2 space-y-3">
            <Button
              href={`${cfg.ctaLink || '/contact'}?annualLift=${calculations.annualRevenueLift}`}
              variant="growth"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() =>
                analytics.trackCtaClick('Unlock Projected Revenue (ROI Calculator)', 'RoiCalculator')
              }
            >
              {cfg.ctaText || 'Unlock Projected Revenue'}
            </Button>

            {cfg.disclaimer && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                {cfg.disclaimer}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

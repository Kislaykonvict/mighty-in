'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, ArrowRight, Sparkles, RefreshCw, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

export function RoiCalculator() {
  const [visitors, setVisitors] = useState<number>(25000);
  const [conversionRate, setConversionRate] = useState<number>(1.2);
  const [dealSize, setDealSize] = useState<number>(8500);

  const calculations = useMemo(() => {
    const currentMonthlyLeads = Math.round(visitors * (conversionRate / 100));
    const currentMonthlyRevenue = currentMonthlyLeads * dealSize;

    // Projected improvements based on verified Mighty Warner benchmarks (+40% traffic lift, +55% CRO lift)
    const projectedVisitors = Math.round(visitors * 1.4);
    const projectedConversionRate = Number((conversionRate * 1.55).toFixed(2));
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
  }, [visitors, conversionRate, dealSize]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleReset = () => {
    setVisitors(25000);
    setConversionRate(1.2);
    setDealSize(8500);
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>INTERACTIVE ROI &amp; REVENUE IMPACT SIMULATOR</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Estimate Your Revenue Acceleration
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Adjust the metrics below to model the compounding pipeline upside of modernizing your brand, web architecture, and search authority.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start md:self-center px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
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
              min={1000}
              max={250000}
              step={1000}
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />

            <div className="flex gap-2 pt-1">
              {[5000, 25000, 75000, 150000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setVisitors(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
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
              min={0.2}
              max={6.0}
              step={0.1}
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />

            <div className="flex gap-2 pt-1">
              {[0.5, 1.2, 2.5, 4.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setConversionRate(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
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

          {/* 3. Average Deal Size / LTV */}
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
              min={1000}
              max={100000}
              step={1000}
              value={dealSize}
              onChange={(e) => setDealSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex gap-2 pt-1">
              {[2500, 8500, 25000, 50000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDealSize(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
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

        {/* Right Column: Projected Impact Card */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#121B30] dark:via-[#0F1626] dark:to-[#0A0F1A] border border-slate-200 dark:border-white/12 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              ESTIMATED ANNUAL IMPACT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400 text-xs font-mono font-bold">
              {calculations.pipelineMultiplier}x Pipeline Lift
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              +{formatCurrency(calculations.annualRevenueLift)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Projected annual pipeline expansion with Mighty Warner ecosystem
            </div>
          </div>

          {/* Comparison Breakdown */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/8">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">CURRENT MONTHLY LEADS</div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-300 font-mono">
                  {calculations.currentMonthlyLeads} leads/mo
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">PROJECTED WITH MW</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {calculations.projectedMonthlyLeads} leads/mo <span className="text-xs text-emerald-600 dark:text-emerald-400">(+{Math.round((calculations.projectedMonthlyLeads / Math.max(1, calculations.currentMonthlyLeads) - 1) * 100)}%)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">CURRENT MONTHLY PIPELINE</div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-300 font-mono">
                  {formatCurrency(calculations.currentMonthlyRevenue)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">PROJECTED MONTHLY PIPELINE</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {formatCurrency(calculations.projectedMonthlyRevenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-2">
            <Button
              href={`/contact?topic=digital-growth&annualLift=${calculations.annualRevenueLift}`}
              variant="growth"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => analytics.trackCtaClick('Unlock Projected Revenue (ROI Calculator)', 'RoiCalculator')}
            >
              Unlock This Projected Growth
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

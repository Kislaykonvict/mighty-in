'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Cpu, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Persona {
  id: string;
  roleTitle: string;
  category: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  headline: string;
  primaryConcern: string;
  solutionFocus: string;
  recommendedCaseStudy: {
    title: string;
    slug: string;
    metric: string;
  };
  recommendedServiceHref: string;
}

const personas: Persona[] = [
  {
    id: 'ceo',
    roleTitle: 'CEO / Founder',
    category: 'Executive Leadership',
    icon: Crown,
    color: '#38BDF8',
    headline: 'Unified commercial momentum with zero vendor friction.',
    primaryConcern: 'Fragmented agencies, slow time-to-market, and lack of accountability across brand, tech, and hiring.',
    solutionFocus: 'The connected ecosystem model providing Strategy + Technology + Talent under unified executive leadership.',
    recommendedCaseStudy: {
      title: 'Strata Financial: Complete Brand Repositioning & Growth Engine',
      slug: 'strata-financial-brand-transformation',
      metric: '$140M+ Pipeline Value Generated',
    },
    recommendedServiceHref: '/approach',
  },
  {
    id: 'cmo',
    roleTitle: 'CMO / VP of Growth',
    category: 'Marketing & Demand Gen',
    icon: Sparkles,
    color: '#FF5E3A',
    headline: 'Make your brand impossible to ignore and turn traffic into pipeline.',
    primaryConcern: 'Rising CAC, outdated web experiences, and low conversion rates on high-intent campaigns.',
    solutionFocus: 'High-speed Next.js web applications, authority SEO topic clusters, and conversion funnel optimization.',
    recommendedCaseStudy: {
      title: 'Elevate Health: D2C Digital Growth & Conversion Optimization',
      slug: 'elevate-health-scale',
      metric: '-38% CAC Reduction with +74% Funnel Completion',
    },
    recommendedServiceHref: '/businesses/digital-growth',
  },
  {
    id: 'cto',
    roleTitle: 'CTO / VP of Engineering',
    category: 'Technology & Architecture',
    icon: Cpu,
    color: '#3B82F6',
    headline: 'Resilient software platforms engineered for enterprise scale.',
    primaryConcern: 'Monolithic tech debt, system downtime during peak shifts, and complex third-party API integrations.',
    solutionFocus: 'Decoupled NestJS microservices, event-driven message queues, and high-availability cloud architecture.',
    recommendedCaseStudy: {
      title: 'Quantum Cloud: Multi-Tenant Enterprise SaaS Modernization',
      slug: 'quantum-saas-platform-modernization',
      metric: '99.99% Uptime with 5M+ Daily Transactions',
    },
    recommendedServiceHref: '/businesses/technology',
  },
  {
    id: 'talent-lead',
    roleTitle: 'VP of Talent / People Ops',
    category: 'Talent & Organizational Scale',
    icon: Users,
    color: '#10B981',
    headline: 'Pre-vetted engineering squads and senior leads in < 14 days.',
    primaryConcern: 'Months-long recruitment lag, high contractor churn, and inability to evaluate niche technical skills.',
    solutionFocus: 'Turnkey Statement of Work (SOW) dedicated pods and pre-screened contingent staff augmentation.',
    recommendedCaseStudy: {
      title: 'AuraPay: Rapid Scale-Up of Core Payments Engineering Pod',
      slug: 'fintech-scaleup-engineering-pod',
      metric: 'Deployed 12 Senior Engineers in 18 Days',
    },
    recommendedServiceHref: '/businesses/talent-solutions',
  },
];

export function PersonaSelector() {
  const [activePersonaId, setActivePersonaId] = useState('ceo');

  const active = personas.find((p) => p.id === activePersonaId) || personas[0];
  const Icon = active.icon;

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-xl space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-white/8">
        <div className="text-xs font-mono text-rose-600 dark:text-sky-400 font-bold uppercase tracking-wider mb-1">
          PERSONALIZED PERSPECTIVE
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What is your executive focus?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
          Select your role to view how Mighty Warner solves the specific challenges on your desk today.
        </p>
      </div>

      {/* 4 Role Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {personas.map((p) => {
          const isSelected = p.id === activePersonaId;
          const PIcon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePersonaId(p.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-400/30'
                  : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/8 hover:border-slate-300 text-slate-600 dark:text-slate-400'
              }`}
              style={{
                borderColor: isSelected ? p.color : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <PIcon className="w-5 h-5" style={{ color: p.color }} />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{p.roleTitle}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{p.category}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Role Insights Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#080C14] border border-slate-200 dark:border-white/8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{ backgroundColor: `${active.color}20`, color: active.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase" style={{ color: active.color }}>
                {active.roleTitle} PERSPECTIVE
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{active.headline}</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs space-y-2">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Immediate Friction:</div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {active.primaryConcern}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs space-y-2">
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase">How Mighty Warner Solves It:</div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {active.solutionFocus}
              </p>
            </div>
          </div>

          {/* Recommended Case Study */}
          <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                RECOMMENDED PROOF POINT
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{active.recommendedCaseStudy.title}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                ✓ {active.recommendedCaseStudy.metric}
              </div>
            </div>

            <Button
              href={`/work/${active.recommendedCaseStudy.slug}`}
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Read Case Study
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

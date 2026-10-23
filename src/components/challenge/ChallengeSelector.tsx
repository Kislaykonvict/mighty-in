'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Users, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { analytics } from '@/lib/analytics';

interface ChallengeOption {
  id: string;
  label: string;
  recommendedVertical: string;
  theme: 'growth' | 'tech' | 'talent' | 'momentum';
  color: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  diagnosis: string;
  capabilities: string[];
  ctaText: string;
  ctaHref: string;
}

const challengeOptions: ChallengeOption[] = [
  {
    id: 'customers',
    label: 'I need more customers',
    recommendedVertical: 'Digital & Growth',
    theme: 'growth',
    color: '#FF5E3A',
    badge: 'Brand & Growth Engine',
    icon: Sparkles,
    diagnosis:
      'Your business lacks organic search visibility, high-converting digital touchpoints, or cohesive brand storytelling that turns casual visitors into qualified inbound enterprise pipeline.',
    capabilities: [
      'High-Performance Web Design & Next.js Development',
      'Top-Tier SEO & Topic Cluster Authority',
      'Conversion Rate Optimization (CRO) & Funnels',
      'Multi-Channel Performance Paid Media',
    ],
    ctaText: 'Explore Digital & Growth Solutions →',
    ctaHref: '/businesses/digital-growth',
  },
  {
    id: 'technology',
    label: 'I need better technology',
    recommendedVertical: 'Technology',
    theme: 'tech',
    color: '#3B82F6',
    badge: 'Software & Platform Architecture',
    icon: Cpu,
    diagnosis:
      'Legacy software, monolithic bottlenecks, manual spreadsheet operations, or brittle integrations are choking your operational speed and limiting customer retention.',
    capabilities: [
      'Custom Web & Mobile Application Engineering',
      'High-Throughput Microservice Backends (NestJS/PostgreSQL)',
      'Enterprise API Gateways & System Automation',
      'Cloud Architecture & DevOps Optimization',
    ],
    ctaText: 'Explore Technology Engineering →',
    ctaHref: '/businesses/technology',
  },
  {
    id: 'people',
    label: 'I need the right people',
    recommendedVertical: 'Talent Solutions',
    theme: 'talent',
    color: '#10B981',
    badge: 'Talent & Engineering Pods',
    icon: Users,
    diagnosis:
      'Internal recruitment bottlenecks, long time-to-hire cycles, or a lack of specialized engineering firepower are causing critical product sprints and revenue deadlines to slip.',
    capabilities: [
      'Turnkey Statement of Work (SOW) Dedicated Pods',
      'Rapid Contingent Staff Augmentation in < 14 Days',
      'Permanent Direct Hire & Executive Search',
      'Embedded Technical Talent Acquisition (RPO)',
    ],
    ctaText: 'Explore Talent Solutions →',
    ctaHref: '/businesses/talent-solutions',
  },
  {
    id: 'scale',
    label: "I'm trying to scale rapidly",
    recommendedVertical: 'Connected Ecosystem (All Capabilities)',
    theme: 'momentum',
    color: '#38BDF8',
    badge: 'Unified Growth Acceleration',
    icon: Layers,
    diagnosis:
      'Scaling across multiple fronts requires synchronized execution: repositioning the brand, upgrading core software platforms, and injecting agile engineering pods simultaneously.',
    capabilities: [
      'Synchronized Brand + Tech + Talent Roadmap',
      'Zero Hand-off Friction Between Design, Code, & Hiring',
      'Dedicated Strategic Direction & Milestone Accountability',
      'Interactive Growth & Systems Diagnostic',
    ],
    ctaText: 'Explore The Full Ecosystem →',
    ctaHref: '/approach',
  },
];

export function ChallengeSelector() {
  const [selectedId, setSelectedId] = useState<string>('customers');

  const selected = challengeOptions.find((c) => c.id === selectedId) || challengeOptions[0];
  const Icon = selected.icon;

  const handleSelect = (option: ChallengeOption) => {
    setSelectedId(option.id);
    analytics.track('challenge_selected', { challengeId: option.id, label: option.label });
  };

  return (
    <section className="py-20 sm:py-28 bg-[#DBDBDB] dark:bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CHALLENGE SELECTOR"
          badgeVariant="subtle"
          title="What's holding your business back?"
          subtitle="Select your primary growth obstacle to reveal the exact capabilities and roadmap needed to eliminate it."
          align="left"
        />

        {/* 4 Interactive Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {challengeOptions.map((opt) => {
            const isCurrent = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-xl text-left font-semibold text-sm transition-all duration-200 border flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-50 dark:bg-white/10 text-slate-900 dark:text-white border-slate-300 dark:border-white/30 shadow-xs ring-1 ring-slate-200 dark:ring-white/20'
                    : 'bg-white dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                style={{
                  borderColor: isCurrent ? opt.color : undefined,
                }}
              >
                <span>{opt.label}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: opt.color }}
                />
              </button>
            );
          })}
        </div>

        {/* Dynamic Solution Reveal Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                    style={{ backgroundColor: `${selected.color}15`, color: selected.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider block"
                      style={{ color: selected.color }}
                    >
                      RECOMMENDED SOLUTION: {selected.recommendedVertical}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{selected.badge}</span>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
                  {selected.diagnosis}
                </p>

                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                    Strategic Focus Areas
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selected.capabilities.map((cap) => (
                      <div
                        key={cap}
                        className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium"
                      >
                        <CheckCircle2
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: selected.color }}
                        />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Button
                    href={selected.ctaHref}
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {selected.ctaText}
                  </Button>

                  <Button
                    href="/assessment"
                    variant="outline"
                    size="md"
                  >
                    Take 3-Min Diagnostic
                  </Button>
                </div>
              </div>

              {/* Side Info Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-4">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                  Why Mighty Warner Fixes This
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Unlike single-discipline vendors who only see problems through their narrow lens, we diagnose whether your bottleneck is actually brand messaging, technological debt, or team execution capacity.
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-xs font-mono text-rose-600 dark:text-sky-400 font-semibold">
                  ⚡ Average turnaround to active deployment: &lt; 14 Days
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

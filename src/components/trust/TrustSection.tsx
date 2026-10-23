'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Award,
  FileText,
  Globe,
  Users,
  ShieldCheck,
  TrendingUp,
  Zap,
  Building2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { TrackRecordData, defaultTrackRecordData, TrackRecordCard } from '@/types/trackRecord';

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  FileText,
  Globe,
  Users,
  ShieldCheck,
  TrendingUp,
  Zap,
  Building2,
  Sparkles,
  Layers,
};

interface AnimatedCounterProps {
  rawValue: string;
}

function parseStatValue(raw: string) {
  const match = (raw || '').match(/^(\d+)(.*)$/);
  if (match) {
    return {
      target: parseInt(match[1], 10),
      suffix: match[2] || '',
    };
  }
  return { target: 0, suffix: raw };
}

function AnimatedCounter({ rawValue }: AnimatedCounterProps) {
  const { target, suffix } = parseStatValue(rawValue);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView || target === 0) return;

    let startTime: number | null = null;
    const duration = 1800; // 1.8s smooth duration

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(target);
      }
    };

    const rafId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target]);

  return (
    <span ref={ref} className="inline-block tabular-nums font-black">
      {count}
      {suffix}
    </span>
  );
}

interface TrustSectionProps {
  data?: TrackRecordData;
}

export function TrustSection({ data: initialData }: TrustSectionProps) {
  const [data, setData] = useState<TrackRecordData>(initialData || defaultTrackRecordData);

  // Sync with initialData or fetch dynamically from API
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      fetch('/api/track-record')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setData(json.data);
          }
        })
        .catch(() => {});
    }
  }, [initialData]);

  if (!data.isActive) return null;

  const cards = data.cards && data.cards.length > 0 ? data.cards : defaultTrackRecordData.cards;
  const industries = data.industries && data.industries.length > 0 ? data.industries : defaultTrackRecordData.industries;

  return (
    <section className="relative w-full py-20 sm:py-24 lg:py-28 bg-[#DBDBDB] dark:bg-[#070B12] overflow-hidden border-b border-neutral-300 dark:border-white/[0.06] transition-colors duration-200">
      {/* Ambient Lighting & Luminous Waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft diagonal luminous waves */}
        <div className="absolute -top-32 right-[-5%] w-[850px] h-[550px] bg-gradient-to-br from-rose-500/5 via-sky-700/5 to-transparent dark:from-cyan-500/10 dark:via-sky-700/5 rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-24 left-[-10%] w-[750px] h-[450px] bg-gradient-to-tr from-slate-200/50 via-slate-100/30 to-transparent dark:from-blue-700/10 dark:via-indigo-950/20 rounded-full blur-3xl" />

        {/* Subtle geometric texture grid */}
        <div className="absolute inset-0 subtle-grid-bg opacity-15" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pill Badge + 2-Line Headline + Vertical Divider Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 md:gap-12">
          <div className="max-w-2xl">
            {/* Eyebrow Pill Badge */}
            {data.badge && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-white/[0.04] text-[11px] font-mono tracking-widest text-slate-700 dark:text-slate-300 uppercase mb-6 shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-white shadow-[0_0_8px_rgba(225,29,72,0.8)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span>{data.badge}</span>
              </motion.div>
            )}

            {/* Chunky Bold Two-Line Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]"
            >
              {data.headlineLine1 || 'Building businesses'}
              {data.headlineLine2 && (
                <>
                  <br />
                  <span className="text-slate-900 dark:text-white">{data.headlineLine2}</span>
                </>
              )}
            </motion.h2>
          </div>

          {/* Institutional Track Record Paragraph with Vertical Separator */}
          {data.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="flex items-center md:max-w-md lg:max-w-lg"
            >
              <div className="border-l border-slate-300 dark:border-white/20 pl-6 py-1">
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {data.subtitle}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Dynamic Metric Cards Grid with Exact Baseline Alignment & Logo Upload Support */}
        <div
          className={`grid gap-4 lg:gap-4 xl:gap-5 mb-14 items-stretch ${
            cards.length === 5
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
              : cards.length === 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : cards.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
          }`}
        >
          {cards.map((stat, idx) => {
            const Icon = ICON_MAP[stat.iconName || 'Award'] || Award;
            return (
              <motion.div
                key={stat.id || stat.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group relative rounded-2xl p-6 sm:p-7 flex flex-col justify-start min-h-[230px] transition-all duration-300 bg-white dark:bg-[#111927] border border-slate-200 dark:border-white/15 hover:border-slate-300 dark:hover:border-white/35 shadow-sm hover:shadow-md hover:-translate-y-1 overflow-hidden"
              >
                {/* 1. Card Top Row: Logo or Icon + VERIFIED Tag */}
                <div className="flex items-center justify-between mb-8 h-6">
                  <div className="text-rose-600 dark:text-slate-200 group-hover:scale-105 transition-transform flex items-center justify-center">
                    {stat.iconUrl ? (
                      <img
                        src={stat.iconUrl}
                        alt={stat.label}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    )}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/[0.04] text-[10px] font-mono tracking-wider text-slate-600 dark:text-slate-400 uppercase font-semibold">
                    {stat.tag || 'VERIFIED'}
                  </span>
                </div>

                {/* 2. Number: Exact baseline and height in every card with animated count-up */}
                <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3 h-12 flex items-baseline">
                  <AnimatedCounter rawValue={stat.value} />
                </div>

                {/* 3. Title: Fixed spacing */}
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                  {stat.label}
                </div>

                {/* 4. Subtitle: Description */}
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {stat.subtext}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer: Leading Rule + "TRUSTED ACROSS:" + Dynamic Industry Capsule Pills */}
        {industries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3 pt-6"
          >
            {/* Leading Line Accent & Monospace Label */}
            <div className="flex items-center gap-3 mr-1">
              <span className="w-12 h-[1px] bg-slate-300 dark:bg-white/20 hidden sm:block" />
              <span className="text-[11px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold whitespace-nowrap">
                TRUSTED ACROSS:
              </span>
            </div>

            {/* Industry Pills */}
            {industries.map((industry) => (
              <div
                key={industry}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/20 bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] hover:border-slate-300 dark:hover:border-white/40 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 cursor-default shadow-xs"
              >
                {industry}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

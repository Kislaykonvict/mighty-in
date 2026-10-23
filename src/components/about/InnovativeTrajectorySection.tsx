'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { TrajectoryData, defaultTrajectoryData } from '@/types/trajectory';

interface InnovativeTrajectorySectionProps {
  initialData?: TrajectoryData;
}

export function InnovativeTrajectorySection({ initialData }: InnovativeTrajectorySectionProps) {
  const data = initialData || defaultTrajectoryData;
  const epochs = data.epochs || defaultTrajectoryData.epochs;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeEpoch = epochs[activeIndex] || epochs[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? epochs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % epochs.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [epochs.length]);

  return (
    <section id="trajectory" className="py-14 sm:py-20 bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/8 relative overflow-hidden text-slate-900 dark:text-white">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-500/5 dark:bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full" />

      <SectionContainer width="default" paddingY="none" className="relative z-10 space-y-8">
        {/* Minimalist Header Row */}
        <div className="border-b border-slate-200 dark:border-white/8 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Our Evolution Through Time
          </h2>
        </div>

        {/* Minimalist Horizontal Scrubber Line */}
        <div className="relative py-1">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] bg-slate-200 dark:bg-white/10 z-0" />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-[1px] bg-rose-600 dark:bg-white transition-all duration-300 z-0"
            style={{
              width: `${(activeIndex / (epochs.length - 1)) * 100}%`,
            }}
          />

          <div className="relative z-10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            {epochs.map((epoch, idx) => {
              const isActive = idx === activeIndex;

              return (
                <button
                  key={epoch.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  className={`group flex items-center gap-2 py-1.5 px-3 rounded-full transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-sm'
                      : 'bg-white dark:bg-[#080C14] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white dark:bg-slate-950' : 'bg-slate-400 dark:bg-slate-600 group-hover:bg-slate-900 dark:group-hover:bg-white'}`} />
                  <span className="text-xs font-mono">{epoch.year}</span>
                  <span className={`text-[10px] uppercase font-semibold hidden md:inline-block ${isActive ? 'text-slate-200 dark:text-slate-800' : 'text-slate-500 dark:text-slate-400'}`}>
                    {epoch.phaseTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimalist Split Stage */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Headline & Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-50 dark:bg-white/10 text-rose-600 dark:text-white font-bold border border-rose-200 dark:border-white/10">
                  {activeEpoch.year}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {activeEpoch.phaseTitle}
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
                  • {activeEpoch.hubLocation}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {activeEpoch.headline}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {activeEpoch.narrative}
              </p>
            </div>

            {/* Right Column: Key Metrics & Deliverables */}
            <div className="lg:col-span-5 space-y-5 lg:pl-6 lg:border-l lg:border-slate-200 dark:lg:border-white/10">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                  <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {activeEpoch.primaryMetric.value}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-normal leading-tight">
                    {activeEpoch.primaryMetric.label}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {activeEpoch.secondaryMetric.value}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-normal leading-tight">
                    {activeEpoch.secondaryMetric.label}
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  Key Achievements
                </div>
                <ul className="space-y-1.5">
                  {activeEpoch.pillars.map((pillar, pIdx) => (
                    <li key={pIdx} className="text-xs text-slate-700 dark:text-slate-300 font-normal flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className="text-rose-500 font-bold">–</span>
                        <span>{pillar.title}</span>
                      </span>
                      {pillar.tag && (
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                          {pillar.tag}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

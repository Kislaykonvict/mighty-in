'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, History, Calendar, CheckCircle2 } from 'lucide-react';
import { companyMilestones } from '@/data/company';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';

export function AboutPreviewSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#060A12] relative border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <SectionHeader
              eyebrow="OUR HERITAGE & VISION"
              badgeVariant="subtle"
              title="Building businesses since 2013."
              subtitle="From our inception over a decade ago, Mighty Warner was engineered to dismantle the artificial divide between creative branding, deep software engineering, and talent scaling."
              className="mb-0"
            />

            <p className="text-sm text-slate-300 leading-relaxed">
              We started with a simple observation: modern businesses fail when their growth levers operate in isolation. Over 13+ years and 450+ delivered projects, we have perfected the art of unified execution.
            </p>

            <div className="pt-2">
              <Button
                href="/about"
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Learn More About Our Journey
              </Button>
            </div>
          </div>

          {/* Right Column Visual Timeline */}
          <div className="lg:col-span-7 space-y-6 pl-0 lg:pl-6">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2 font-semibold">
              Key Historical Milestones
            </div>

            <div className="relative border-l border-white/10 pl-6 space-y-8">
              {companyMilestones.map((milestone) => (
                <div key={milestone.year} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#080C14] border-2 border-sky-400 group-hover:bg-sky-400 transition-colors" />

                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-sm font-mono font-extrabold text-sky-400">
                      {milestone.year}
                    </span>
                    {milestone.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-slate-300">
                        {milestone.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">
                    {milestone.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, Users, Zap, Plus, Equal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function EcosystemSection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-[#080C14]">
      {/* Background glow lines */}
      <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          eyebrow="THE CONNECTED ADVANTAGE"
          badgeVariant="subtle"
          title="Three capabilities. One connected ecosystem."
          subtitle="Businesses don't grow through marketing alone. They need the right story, the right technology, and the right people to bring it to life. Mighty Warner brings these capabilities together under one ecosystem."
          align="left"
        />

        {/* The Equation Bar / Visual */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#0F1626]/80 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-4 text-center sm:text-left">
            The Mighty Warner Growth Formula
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* 1. PEOPLE */}
            <div className="md:col-span-2 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  01. TALENT
                </div>
                <div className="text-lg font-bold text-white">PEOPLE</div>
                <div className="text-xs text-slate-400">Engineers, strategists & leaders</div>
              </div>
            </div>

            {/* Plus */}
            <div className="flex justify-center text-slate-500">
              <Plus className="w-6 h-6" />
            </div>

            {/* 2. TECHNOLOGY */}
            <div className="md:col-span-2 p-5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  02. PLATFORMS
                </div>
                <div className="text-lg font-bold text-white">TECHNOLOGY</div>
                <div className="text-xs text-slate-400">Web apps, microservices & APIs</div>
              </div>
            </div>

            {/* Plus */}
            <div className="flex justify-center text-slate-500">
              <Plus className="w-6 h-6" />
            </div>

            {/* 3. GROWTH */}
            <div className="md:col-span-2 p-5 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                  03. BRAND & REACH
                </div>
                <div className="text-lg font-bold text-white">GROWTH</div>
                <div className="text-xs text-slate-400">SEO, branding & performance</div>
              </div>
            </div>
          </div>

          {/* Result Banner */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                <Equal className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide">
                  BUSINESS MOMENTUM
                </div>
                <div className="text-xs text-slate-400">
                  Compounding enterprise velocity with zero vendor hand-off friction.
                </div>
              </div>
            </div>

            <Link
              href="/approach"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 shrink-0 group"
            >
              <span>Explore our unified methodology</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3 Ecosystem Synergy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-orange-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Brand Without Engineering Fails
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stunning visual identity and high-budget ad campaigns fall flat if your web architecture is sluggish or lacks interactive conversion capability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-blue-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Engineering Without Positioning Stalls
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Complex software and robust backend APIs won’t generate revenue if prospective enterprise buyers cannot find or understand your value proposition.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-emerald-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Ambitious Plans Without Talent Die
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Even the sharpest strategy is useless without senior developers and leaders deployed in days to turn wireframes and roadmaps into production reality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

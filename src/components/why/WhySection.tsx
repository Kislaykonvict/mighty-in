'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Network, Target, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { coreValues } from '@/data/company';

export function WhySection() {
  const icons = [Network, Target, Zap];

  return (
    <section className="py-20 sm:py-28 bg-[#060A12] relative border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="THE MIGHTY WARNER DIFFERENCE"
          badgeVariant="subtle"
          title="Why ambitious companies build with us."
          subtitle="We rejected the bloated agency model and fragmented vendor chains to create an integrated commercial growth partner."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {coreValues.map((val, idx) => {
            const Icon = icons[idx] || Network;

            const glowColors = [
              'hover:border-orange-500/40 hover:shadow-orange-500/10',
              'hover:border-blue-500/40 hover:shadow-blue-500/10',
              'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
            ][idx];

            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-8 rounded-3xl bg-[#0F1626] border border-white/8 ${glowColors} transition-all duration-300 shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                    <Icon className="w-6 h-6 text-sky-400" />
                  </div>

                  <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
                    0{idx + 1} • CORE ADVANTAGE
                  </div>

                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    {val.title}
                  </h3>

                  <div className="text-sm font-semibold text-slate-300 mb-4">
                    {val.subtitle}
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {val.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Operational Principle</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Globe, Building2, Users } from 'lucide-react';
import { siteConfig } from '@/config/site';

const stats = [
  {
    value: siteConfig.stats.yearsInBusiness,
    label: 'Years in Business',
    subtext: 'Continuous innovation since 2013',
    icon: Award,
  },
  {
    value: siteConfig.stats.projectsDelivered,
    label: 'Projects Delivered',
    subtext: 'Web apps, platforms & growth engines',
    icon: Building2,
  },
  {
    value: siteConfig.stats.marketsServed,
    label: 'Global Markets',
    subtext: 'North America, EMEA & APAC',
    icon: Globe,
  },
  {
    value: siteConfig.stats.activeSpecialists,
    label: 'Vetted Specialists',
    subtext: 'Engineers, strategists & designers',
    icon: Users,
  },
  {
    value: siteConfig.stats.clientSatisfaction,
    label: 'Satisfaction Rating',
    subtext: 'Measured on long-term retainers',
    icon: ShieldCheck,
  },
];

const clientIndustries = [
  'Fintech & Payments',
  'Enterprise SaaS',
  'Healthcare & MedTech',
  'Supply Chain & Freight',
  'Wealth Management',
  'Digital Commerce',
];

export function TrustSection() {
  return (
    <section className="py-14 sm:py-20 border-y border-white/8 bg-[#060910] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/8 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>PROVEN TRACK RECORD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Building businesses since 2013.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Verified institutional track record across enterprise software delivery, high-velocity brand growth, and talent scaling.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/8 hover:border-white/15 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-500">VERIFIED</span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-slate-200 mb-1">{stat.label}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{stat.subtext}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Client Sector Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
          <span className="text-xs font-mono uppercase text-slate-500 mr-2">
            Trusted Across:
          </span>
          {clientIndustries.map((industry) => (
            <div
              key={industry}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/8 text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition-colors"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

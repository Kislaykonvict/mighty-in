'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, Users, ChevronRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { Badge } from '@/components/ui/Badge';

interface HeroPillar {
  id: 'digital-growth' | 'technology' | 'talent-solutions';
  actionPrompt: string; // e.g. "BUILD A BRAND"
  verticalName: string; // e.g. "Digital & Growth"
  subtitle: string;
  badge: string;
  theme: 'growth' | 'tech' | 'talent';
  accentHex: string;
  glowColor: string;
  borderColor: string;
  href: string;
  bgImageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const pillars: HeroPillar[] = [
  {
    id: 'digital-growth',
    actionPrompt: 'BUILD A BRAND',
    verticalName: 'Digital & Growth',
    subtitle: 'Make your business impossible to ignore through high-impact branding, SEO dominance & conversion-driven web design.',
    badge: 'Growth Engine',
    theme: 'growth',
    accentHex: '#FF5E3A',
    glowColor: 'rgba(255, 94, 58, 0.25)',
    borderColor: 'border-orange-500/30 hover:border-orange-500/60',
    href: '/businesses/digital-growth',
    bgImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    icon: Sparkles,
    tags: ['Brand Strategy', 'Web Design & Dev', 'SEO', 'Paid Performance'],
  },
  {
    id: 'technology',
    actionPrompt: 'BUILD A PRODUCT',
    verticalName: 'Technology',
    subtitle: 'Engineer scalable web applications, custom platforms, and automation systems tailored around your business requirements.',
    badge: 'Software Architecture',
    theme: 'tech',
    accentHex: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    href: '/businesses/technology',
    bgImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    icon: Cpu,
    tags: ['Web Applications', 'Microservices', 'Custom Software', 'APIs'],
  },
  {
    id: 'talent-solutions',
    actionPrompt: 'BUILD A TEAM',
    verticalName: 'Talent Solutions',
    subtitle: 'Deploy dedicated senior engineering pods, contingent specialists, and executive hires to accelerate your roadmap.',
    badge: 'Talent Network',
    theme: 'talent',
    accentHex: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    href: '/businesses/talent-solutions',
    bgImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    icon: Users,
    tags: ['SOW Dedicated Pods', 'Staff Augmentation', 'Direct Hire', 'Tech Leads'],
  },
];

export function HeroSection() {
  const [activePillarId, setActivePillarId] = useState<HeroPillar['id']>('digital-growth');

  const activePillar = pillars.find((p) => p.id === activePillarId) || pillars[0];

  const handleSelectPillar = (pillar: HeroPillar) => {
    setActivePillarId(pillar.id);
    analytics.trackHeroBusinessSelect(pillar.id, pillar.actionPrompt);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-8 pb-16 overflow-hidden">
      {/* Background Interactive Ambient Backdrop */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={activePillar.bgImageUrl}
              alt=""
              fill
              priority
              className="object-cover object-center filter blur-xl scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient radial glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] transition-colors duration-700 -z-10"
          style={{ backgroundColor: activePillar.glowColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C14]/40 via-[#080C14]/90 to-[#080C14]" />
        <div className="absolute inset-0 subtle-grid-bg opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <Badge variant="subtle" dot>
            ONE CONNECTED ECOSYSTEM • EST. 2013
          </Badge>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
            Strategy • Software • Talent
          </span>
        </motion.div>

        {/* Core Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mb-6"
        >
          <h1 className="text-display-hero text-white tracking-tight font-extrabold">
            What are you <span className="gradient-text-brand">building?</span>
          </h1>
        </motion.div>

        {/* Supporting Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-body-lg text-slate-300 font-normal leading-relaxed">
            <span className="text-white font-semibold">A brand. A product. A team.</span>{' '}
            Mighty Warner brings together the strategy, technology, and talent businesses need to move forward.
          </p>
        </motion.div>

        {/* Three Primary Signature Interactive Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {pillars.map((pillar, idx) => {
            const isSelected = activePillarId === pillar.id;
            const Icon = pillar.icon;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + idx * 0.1 }}
                onMouseEnter={() => handleSelectPillar(pillar)}
                onFocus={() => handleSelectPillar(pillar)}
                className="relative group"
              >
                <div
                  className={`h-full flex flex-col justify-between p-6 sm:p-7 rounded-2xl transition-all duration-300 backdrop-blur-xl border ${
                    isSelected
                      ? `bg-[#0F172A]/90 ${pillar.borderColor} shadow-2xl ring-1`
                      : 'bg-[#0F1626]/60 border-white/8 hover:bg-[#141D30]/80 hover:border-white/20'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 20px 40px -15px ${pillar.glowColor}` : undefined,
                    borderColor: isSelected ? pillar.accentHex : undefined,
                  }}
                >
                  <div>
                    {/* Top Action Prompt & Index */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-xs font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md transition-colors"
                        style={{
                          backgroundColor: `${pillar.accentHex}1A`,
                          color: pillar.accentHex,
                        }}
                      >
                        {pillar.actionPrompt}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-medium">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Vertical Title & Icon */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${pillar.accentHex}20`,
                          color: pillar.accentHex,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {pillar.verticalName}
                      </h2>
                    </div>

                    {/* Subtitle description */}
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                      {pillar.subtitle}
                    </p>

                    {/* Capability Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {pillar.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Explore Action Button */}
                  <Link
                    href={pillar.href}
                    onClick={() => analytics.trackCtaClick(`Hero Explore: ${pillar.verticalName}`, 'Hero', pillar.href)}
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-white/10 text-sm font-semibold text-white group-hover:text-sky-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>Explore {pillar.verticalName}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

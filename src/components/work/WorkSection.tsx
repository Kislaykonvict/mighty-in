'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';

export function WorkSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'digital-growth' | 'technology' | 'talent-solutions'>('all');

  const filteredProjects =
    activeFilter === 'all'
      ? projectsData
      : projectsData.filter((p) => p.verticalId === activeFilter);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'digital-growth', label: 'Digital & Growth' },
    { id: 'technology', label: 'Technology' },
    { id: 'talent-solutions', label: 'Talent Solutions' },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#060A12] relative border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            eyebrow="PROVEN CLIENT CASE STUDIES"
            badgeVariant="subtle"
            title="We've built things worth talking about."
            subtitle="Explore the businesses, products, experiences, and technical solutions we've helped bring to life."
            className="mb-0 max-w-2xl"
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/8 self-start md:self-end">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === f.id
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12"
          >
            {filteredProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA to full /work */}
        <div className="text-center pt-4">
          <Button
            href="/work"
            variant="outline"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Complete Portfolio & Case Studies
          </Button>
        </div>
      </div>
    </section>
  );
}

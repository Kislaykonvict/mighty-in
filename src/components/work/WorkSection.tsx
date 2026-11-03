'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { HomepageWorkData, defaultHomepageWorkData } from '@/types/homepageWork';

interface WorkSectionProps {
  data?: HomepageWorkData;
}

export function WorkSection({ data }: WorkSectionProps) {
  const current = data || defaultHomepageWorkData;
  const rawProjects = useMemo(() => current.projects || [], [current.projects]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Derive categories from the available projects
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(rawProjects.map((p) => p.category?.trim()).filter(Boolean))
    );
    const list = [{ id: 'all', label: 'All' }];
    unique.slice(0, 5).forEach((cat) => {
      const label = cat.toLowerCase() === 'web design' ? 'Websites' : cat;
      list.push({ id: cat.toLowerCase(), label });
    });
    return list;
  }, [rawProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return rawProjects.slice(0, 6);
    return rawProjects.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return (
        cat === activeCategory ||
        (activeCategory === 'websites' && (cat.includes('web') || cat.includes('site')))
      );
    }).slice(0, 6);
  }, [rawProjects, activeCategory]);

  if (current.isActive === false) return null;

  return (
    <section
      id="work"
      className="py-20 sm:py-28 bg-[#FAFAFC] dark:bg-[#060A12] relative transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header Row matching Reference Screenshot */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="block text-xs font-bold font-mono tracking-[0.2em] text-[#8B1E2D] dark:text-rose-400 uppercase mb-2">
              {current.badge || 'PORTFOLIO'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Selected{' '}
              <span className="font-serif italic font-normal text-[#8B1E2D] dark:text-rose-400">
                client projects
              </span>
            </h2>
          </div>

          {/* Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-slate-950 font-bold shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-700 hover:text-black hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Projects Grid with Real Thumbnail Pictures */}
        {filteredProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-14 sm:mb-18">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project as any}
                  index={idx}
                />
              ))}
            </div>

            {/* Centered Solid Black Pill Button matching Reference Screenshot */}
            <div className="text-center">
              <Link
                href={current.ctaLink || '/work'}
                className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer select-none"
              >
                {current.ctaText || 'VIEW ALL PROJECTS'}
              </Link>
            </div>
          </>
        ) : (
          <div className="py-14 px-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 text-center max-w-xl mx-auto shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No projects in this category yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="text-xs font-semibold text-[#8B1E2D] dark:text-rose-400 hover:underline cursor-pointer"
            >
              View all featured projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Project } from '@/types/project';
import { ProjectCard } from '@/components/work/ProjectCard';
import { RichTextContent } from '@/components/ui/RichTextContent';
import { defaultWorkPageSettings } from '@/types/workPage';

interface PortfolioClientViewProps {
  initialProjects: Project[];
  title?: string;
  highlightedTitle?: string;
  badge?: string;
  description?: string;
  categories?: string[];
  hideHeader?: boolean;
}

export function PortfolioClientView({
  initialProjects,
  title = defaultWorkPageSettings.title,
  highlightedTitle = defaultWorkPageSettings.highlightedTitle,
  badge = defaultWorkPageSettings.badge,
  description = defaultWorkPageSettings.description,
  categories: customCategories,
  hideHeader = false,
}: PortfolioClientViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Extract unique categories from projects or prioritize official categories
  const categories = useMemo(() => {
    const rawCategories = Array.from(
      new Set([
        ...(customCategories || []),
        ...initialProjects.map((p) => p.category?.trim()).filter(Boolean),
      ])
    );

    const categoryList = [{ id: 'all', label: 'All' }];

    rawCategories.forEach((cat) => {
      if (cat) {
        categoryList.push({ id: cat.toLowerCase(), label: cat });
      }
    });

    return categoryList;
  }, [initialProjects, customCategories]);

  // Filter projects by category and search
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const projCat = (project.category || '').toLowerCase().trim();
      const matchesCategory = activeCategory === 'all' || projCat === activeCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        project.title.toLowerCase().includes(query) ||
        projCat.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, activeCategory, searchQuery]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div className="w-full">
      {/* Editorial Header Section strictly dynamic from Admin */}
      {!hideHeader && (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-14">
          {/* Left: Eyebrow + Modern Heading + Description */}
          <div className="max-w-2xl">
            {badge && (
              <span className="block text-xs font-bold font-mono tracking-[0.2em] text-[#8B1E2D] dark:text-rose-400 uppercase mb-2">
                <RichTextContent content={badge} inline />
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              <RichTextContent content={title} inline />{' '}
              {highlightedTitle && (
                <span className="font-extrabold bg-gradient-to-r from-[#C52233] via-rose-600 to-[#8B1E2D] dark:from-rose-400 dark:via-rose-300 dark:to-white bg-clip-text text-transparent">
                  <RichTextContent content={highlightedTitle} inline />
                </span>
              )}
            </h1>
            {description && (
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <RichTextContent content={description} inline />
              </p>
            )}
          </div>

          {/* Right: Filter Pills Row + Compact Search */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setVisibleCount(12);
                  }}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer select-none font-medium ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-slate-950 font-bold shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:text-black hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white dark:hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            {/* Subtle Search Bar */}
            <div className="relative w-full sm:w-48 ml-auto sm:ml-2 mt-2 sm:mt-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-[#8B1E2D] dark:focus:border-rose-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid with Real Thumbnail Pictures in Browser Frames */}
      {displayedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {displayedProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xs">
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
            No projects found matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-[#8B1E2D] dark:text-rose-400 hover:underline cursor-pointer"
          >
            Clear filters and view all projects
          </button>
        </div>
      )}

      {/* Bottom Centered "VIEW ALL PROJECTS" Pill Button matching Reference Screenshot */}
      <div className="mt-14 sm:mt-18 text-center">
        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer select-none"
          >
            VIEW ALL PROJECTS ({filteredProjects.length})
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setVisibleCount(initialProjects.length);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer select-none"
          >
            VIEW ALL PROJECTS
          </button>
        )}
      </div>
    </div>
  );
}

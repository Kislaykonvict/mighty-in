'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { Project } from '@/types/project';
import { ProjectCard } from '@/components/work/ProjectCard';

interface PortfolioClientViewProps {
  initialProjects: Project[];
}

export function PortfolioClientView({ initialProjects }: PortfolioClientViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'ecommerce', label: 'Ecommerce' },
    { id: 'web-design', label: 'Web Applications' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'branding', label: 'Branding & Corporate' },
  ];

  // Filter projects by both category tab and search query
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory =
        activeCategory === 'all' || project.category === activeCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        project.title.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query) ||
        project.industry.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, activeCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? initialProjects.length
                : initialProjects.filter((p) => p.category === cat.id).length;

            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by client, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#090E18] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-500 dark:focus:border-sky-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            No projects found matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-rose-600 dark:text-sky-400 hover:underline"
          >
            Clear filters and view all projects
          </button>
        </div>
      )}

      {/* Bottom Counter */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Showing {filteredProjects.length} of {initialProjects.length} Verified Deployments</span>
        <span>Source: Mighty Warner Production Portfolio</span>
      </div>
    </div>
  );
}

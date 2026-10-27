'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/project';
import { analytics } from '@/lib/analytics';
import { RichTextContent } from '@/components/ui/RichTextContent';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const targetUrl = project.liveUrl || `/work/${project.slug}`;
  const isExternal = Boolean(project.liveUrl);

  return (
    <Link
      href={targetUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={() => analytics.trackProjectView(project.slug, project.verticalId || '')}
      className="group block select-none focus:outline-none cursor-pointer"
      aria-label={`${project.title} - ${project.industry}`}
    >
      {/* Visual Canvas (Awwwards Style 16:10 Aspect Ratio with Smooth Hover Zoom) */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0D1322] border border-slate-200 dark:border-white/8 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all duration-500 shadow-xs group-hover:shadow-xl">
        <Image
          src={project.thumbnailImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />

        {/* Subtle hover gradient vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Clean, prominent arrow (↗) redirecting to the live platform */}
        <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          <ArrowUpRight
            className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] group-hover:scale-110 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            strokeWidth={2.25}
          />
        </div>
      </div>

      {/* Minimal Title Row */}
      <div className="mt-3 px-1">
        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-rose-600 dark:group-hover:text-sky-300 transition-colors">
          <RichTextContent content={project.title} inline />
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
          {project.industry}
        </p>
      </div>
    </Link>
  );
}

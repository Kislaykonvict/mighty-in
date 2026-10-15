'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/Badge';
import { analytics } from '@/lib/analytics';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const badgeVariant =
    project.verticalId === 'digital-growth'
      ? 'growth'
      : project.verticalId === 'technology'
      ? 'tech'
      : 'talent';

  return (
    <div className="group rounded-2xl bg-[#0F1626] border border-white/8 hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1">
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-900">
          <Image
            src={project.thumbnailImage}
            alt={project.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent opacity-70" />
          <div className="absolute top-4 left-4">
            <Badge variant={badgeVariant as any} dot>
              {project.verticalName}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10">
            {project.year}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            {project.client} • {project.industry}
          </div>

          <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-sky-300 transition-colors line-clamp-2">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3">
            {project.shortDescription}
          </p>

          {/* Primary Metric Pill */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between mb-4">
              <div>
                <span className="text-lg font-black text-white mr-2">
                  {project.metrics[0].value}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {project.metrics[0].label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">VERIFIED</span>
            </div>
          )}

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.technologiesUsed.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-6 pt-2">
        <Link
          href={`/work/${project.slug}`}
          onClick={() => analytics.trackProjectView(project.slug, project.verticalId)}
          className="inline-flex items-center justify-between w-full pt-4 border-t border-white/8 text-xs font-bold text-slate-200 group-hover:text-white transition-colors"
        >
          <span>View Case Study</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-sky-400" />
        </Link>
      </div>
    </div>
  );
}

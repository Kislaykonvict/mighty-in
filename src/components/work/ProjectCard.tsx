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
  index?: number;
}

export function getProjectDeliverable(project: Project): string {
  const customDeliverables: Record<string, string> = {
    'SmartShop': 'Online store build & optimization',
    'White Sand': 'Luxury beachfront property platform',
    'Luxury Akar': 'Prime real estate portal & CRM',
    'Bantuuz.com': 'Corporate website redesign',
    'Safety Shop Dubai': 'B2B & B2C industrial supply storefront',
    'AlSadaf Pet Care': 'Pet care e-commerce platform',
    'TVG Realtors': 'Commercial brokerage & property listings',
    'Masar Ind.': 'Industrial manufacturing web storefront',
    'EIA': 'Enterprise institutional platform',
    'Linda Paradis Group': 'Global aesthetics clinic website',
    'Capital-Index': 'Financial services web platform',
    'TVG Consultancy': 'Strategic advisory website redesign',
    'Timeoutx': 'Lifestyle & retail store build',
    'Pipelink': 'Industrial supply chain web platform',
    'Stirlingls': 'Corporate advisory & legal platform',
    'TheOdor': 'Luxury fragrance online storefront',
    'HF Polyclinic': 'Healthcare & patient booking portal',
    'Colour-Reflections': 'Brand identity & digital launch',
    'Bridgertongroup': 'Corporate group portfolio platform',
    'Biostream': 'Biotech & life sciences portal',
    'South Wind Maritime Ltd': 'Maritime logistics web platform',
    'Equinox globalGeneral Trading LLC': 'International trade & logistics portal',
    'Anatolia Tanboga General Trading LLC': 'General trading corporate web presence',
    'Biladalsham': 'Culinary heritage web experience',
  };

  if (customDeliverables[project.title]) {
    return customDeliverables[project.title];
  }

  const cat = (project.category || '').toLowerCase();
  if (cat.includes('ecom') || cat.includes('commerce') || cat.includes('store')) {
    return 'Online store build & conversion';
  }
  if (cat.includes('real estate') || cat.includes('property')) {
    return 'Luxury real estate showcase platform';
  }
  if (cat.includes('brand')) {
    return 'Brand identity & launch';
  }
  if (cat.includes('seo')) {
    return '+120% organic traffic growth';
  }
  if (cat.includes('social')) {
    return 'Social media growth & engagement';
  }
  if (cat.includes('ad')) {
    return 'Lead generation campaign';
  }
  return 'Corporate website redesign';
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const targetUrl = project.liveUrl || '#';
  const isExternal = Boolean(project.liveUrl && project.liveUrl !== '#');
  const deliverable = getProjectDeliverable(project);
  const displayCategory = project.category?.trim() || 'Website';

  return (
    <Link
      href={targetUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={() => analytics.trackProjectView(project.id, project.category || '')}
      className="group block select-none focus:outline-none cursor-pointer"
      aria-label={`${project.title} - ${displayCategory}`}
    >
      {/* Outer Elevated Card Container matching Reference UI */}
      <div className="bg-white dark:bg-[#0D1322] rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-white/8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out group-hover:-translate-y-1.5 flex flex-col justify-between h-full">
        
        {/* Top Browser Window Mockup Frame with Real Thumbnail Picture */}
        <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col">
          
          {/* Top Browser Header Bar with 3 macOS-style Window Control Dots & Live Domain */}
          <div className="h-7 w-full flex items-center justify-between px-3 bg-slate-900/95 dark:bg-black/95 backdrop-blur-md border-b border-white/10 shrink-0 z-10 relative">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/45" />
              <span className="w-2 h-2 rounded-full bg-white/45" />
              <span className="w-2 h-2 rounded-full bg-white/45" />
            </div>
            {isExternal && (
              <span className="text-[10px] font-mono text-white/70 truncate max-w-[150px]">
                {targetUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            )}
          </div>

          {/* Actual Thumbnail Picture of the Client Platform */}
          <div className="relative flex-1 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
            <Image
              src={project.thumbnailImage || '/images/hero/mw-hero-bg.webp'}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />

            {/* Subtle contrast gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Interactive External Link Arrow Button on Hover */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-md">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Card Metadata Section directly matching Reference Screenshot */}
        <div className="pt-4 px-1">
          {/* Category Capsule Badge (Soft Pink Pill) */}
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#FFF0F2] text-[#8B1E2D] dark:bg-rose-950/40 dark:text-rose-300 dark:border dark:border-rose-900/40 mb-2">
            {displayCategory}
          </span>

          {/* Client Name / Project Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-[#8B1E2D] dark:group-hover:text-rose-400 transition-colors">
            <RichTextContent content={project.title} inline />
          </h3>

          {/* Outcome / Deliverable Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
            {deliverable}
          </p>
        </div>

      </div>
    </Link>
  );
}

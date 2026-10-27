'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { HomepageWorkData, defaultHomepageWorkData } from '@/types/homepageWork';

interface WorkSectionProps {
  data?: HomepageWorkData;
}

export function WorkSection({ data }: WorkSectionProps) {
  const current = data || defaultHomepageWorkData;

  if (current.isActive === false) return null;

  const displayProjects =
    current.projects && current.projects.length > 0
      ? current.projects.slice(0, current.maxDisplay || 6)
      : projectsData.slice(0, current.maxDisplay || 6);

  return (
    <section
      id="work"
      className="py-20 sm:py-28 bg-[#DBDBDB] dark:bg-[#060A12] relative border-t border-neutral-300 dark:border-white/8 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            eyebrow={current.badge || 'PROVEN CLIENT CASE STUDIES'}
            badgeVariant="subtle"
            title={current.title || "We've built things worth talking about."}
            subtitle={
              current.subtitle ||
              "Explore the businesses, products, experiences, and technical solutions we've helped bring to life."
            }
            className="mb-0 max-w-2xl"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project as any} />
          ))}
        </div>

        {/* Bottom CTA to full /portfolio */}
        {current.ctaText && (
          <div className="text-center pt-4">
            <Button
              href={current.ctaLink || '/portfolio'}
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {current.ctaText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

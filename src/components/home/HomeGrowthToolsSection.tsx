import React from 'react';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { HomeGrowthToolsClient } from './HomeGrowthToolsClient';
import { HomeGrowthToolsSectionData, defaultHomeGrowthToolsSectionData } from '@/types/growthTools';

interface HomeGrowthToolsSectionProps {
  data?: HomeGrowthToolsSectionData;
  className?: string;
}

export function HomeGrowthToolsSection({
  data = defaultHomeGrowthToolsSectionData,
  className = '',
}: HomeGrowthToolsSectionProps) {
  const cfg = data || defaultHomeGrowthToolsSectionData;

  if (cfg.isActive === false) {
    return null;
  }

  return (
    <section
      id="growth-tools"
      className={`py-20 sm:py-28 bg-[#DBDBDB] dark:bg-[#060A12] border-t border-neutral-300 dark:border-white/8 relative overflow-hidden transition-colors duration-200 ${className}`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-r from-rose-500/5 via-orange-500/5 to-emerald-500/5 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />

      <SectionContainer width="default" paddingY="none" className="relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {cfg.badge && (
            <Badge variant="subtle" dot className="mb-2">
              {cfg.badge}
            </Badge>
          )}

          <h2 className="text-display-h2 font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {cfg.title}{' '}
            {cfg.highlightedTitle && (
              <span className="gradient-text-brand">{cfg.highlightedTitle}</span>
            )}
          </h2>

          {cfg.description && (
            <p className="text-body-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {cfg.description}
            </p>
          )}
        </div>

        {/* Interactive Workspace Container */}
        <HomeGrowthToolsClient data={cfg} />
      </SectionContainer>
    </section>
  );
}

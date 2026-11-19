'use client';

import React, { useState } from 'react';
import { Sparkles, Calculator } from 'lucide-react';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';
import { RoiCalculator } from '@/components/interactive/RoiCalculator';
import { HomeGrowthToolsSectionData } from '@/types/growthTools';

interface HomeGrowthToolsClientProps {
  data: HomeGrowthToolsSectionData;
}

export function HomeGrowthToolsClient({ data }: HomeGrowthToolsClientProps) {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'roi'>(
    data.defaultActiveTab || 'diagnostic'
  );

  return (
    <div className="space-y-8">
      {/* Switcher Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white/80 dark:bg-[#0F1626] border border-slate-200 dark:border-white/10 shadow-sm gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('diagnostic')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'diagnostic'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{data.diagnosticTabLabel || 'Growth Diagnostic'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roi')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'roi'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{data.roiTabLabel || 'Revenue ROI Calculator'}</span>
          </button>
        </div>
      </div>

      {/* Active Tab Panel */}
      <div className="max-w-5xl mx-auto">
        {activeTab === 'diagnostic' && (
          <div className="animate-fade-in">
            <AssessmentWizard sectionData={data.diagnostic} />
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="animate-fade-in">
            <RoiCalculator data={data.roi} />
          </div>
        )}
      </div>
    </div>
  );
}

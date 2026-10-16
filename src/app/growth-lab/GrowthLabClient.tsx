'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Calculator, Layers, Crown } from 'lucide-react';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';
import { StrategyBuilder } from '@/components/interactive/StrategyBuilder';
import { RoiCalculator } from '@/components/interactive/RoiCalculator';
import { PersonaSelector } from '@/components/interactive/PersonaSelector';

type LabTab = 'diagnostic' | 'strategy' | 'roi' | 'persona';

const tabs = [
  {
    id: 'diagnostic' as LabTab,
    label: 'Growth Diagnostic',
    icon: Sparkles,
    badge: '3-Min Score',
    color: 'text-orange-400',
  },
  {
    id: 'strategy' as LabTab,
    label: '90-Day Strategy Builder',
    icon: Layers,
    badge: 'Custom Roadmap',
    color: 'text-sky-400',
  },
  {
    id: 'roi' as LabTab,
    label: 'Revenue ROI Calculator',
    icon: Calculator,
    badge: 'Pipeline Simulator',
    color: 'text-emerald-400',
  },
  {
    id: 'persona' as LabTab,
    label: 'Executive Perspectives',
    icon: Crown,
    badge: 'Role Specific',
    color: 'text-amber-400',
  },
];

export function GrowthLabClient() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as LabTab) || 'diagnostic';
  const [activeTab, setActiveTab] = useState<LabTab>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as LabTab;
    if (tabParam && tabs.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      {/* 5-Tab Selector Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-2xl bg-[#0F1626] border border-white/8 shadow-xl max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isCurrent = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isCurrent
                  ? 'bg-white text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isCurrent ? 'text-slate-950' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div className="max-w-5xl mx-auto">
        {activeTab === 'diagnostic' && (
          <div className="space-y-4 animate-fade-in">
            <AssessmentWizard />
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-4 animate-fade-in">
            <StrategyBuilder />
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="space-y-4 animate-fade-in">
            <RoiCalculator />
          </div>
        )}

        {activeTab === 'persona' && (
          <div className="space-y-4 animate-fade-in">
            <PersonaSelector />
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowLeftRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface BeforeAfterItem {
  id: string;
  title: string;
  client: string;
  vertical: string;
  beforeImage: string;
  afterImage: string;
  beforeMetrics: {
    label: string;
    value: string;
  }[];
  afterMetrics: {
    label: string;
    value: string;
  }[];
  summary: string;
}

const defaultItems: BeforeAfterItem[] = [
  {
    id: 'strata',
    title: 'Strata Financial: Legacy Portal to Headless Engine',
    client: 'Strata Financial Group',
    vertical: 'Digital & Growth',
    beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    beforeMetrics: [
      { label: 'Page Load Speed', value: '4.8s (F Grade)' },
      { label: 'MQL Conversion Rate', value: '0.8%' },
      { label: 'Tech Stack', value: 'Monolithic WP 2015' },
    ],
    afterMetrics: [
      { label: 'Page Load Speed', value: '0.6s (99th Percentile)' },
      { label: 'MQL Conversion Rate', value: '2.9% (+210%)' },
      { label: 'Tech Stack', value: 'Next.js App Router + Tailwind' },
    ],
    summary: 'Transformed an outdated legacy portal into a high-speed wealth client acquisition engine.',
  },
  {
    id: 'quantum',
    title: 'Quantum Cloud: Monolithic PHP to Real-Time Microservices',
    client: 'Quantum Cloud Systems',
    vertical: 'Technology',
    beforeImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    beforeMetrics: [
      { label: 'System Uptime', value: '98.2% (Frequent Outages)' },
      { label: 'Telemetry Latency', value: '4,200ms' },
      { label: 'Infrastructure Cost', value: '$45,000 / mo' },
    ],
    afterMetrics: [
      { label: 'System Uptime', value: '99.99% (Zero Outages)' },
      { label: 'Telemetry Latency', value: '< 45ms' },
      { label: 'Infrastructure Cost', value: '$21,500 / mo (-52%)' },
    ],
    summary: 'Decoupled monolithic server bottlenecks into high-throughput NestJS event-driven architecture.',
  },
];

export function BeforeAfterSlider() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = defaultItems[selectedIdx] || defaultItems[0];

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#0F1626] border border-white/10 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            <span>TRANSFORMATION SHOWCASE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Before & After Mighty Warner
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Drag the slider to interactively compare legacy states with our modernized production deployments.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/8">
          {defaultItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedIdx === idx
                  ? 'bg-white text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.client}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Split-Screen Visual Slider */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative h-[320px] sm:h-[460px] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/12 shadow-2xl bg-slate-900"
      >
        {/* 'After' Full Background (Right Side) */}
        <div className="absolute inset-0">
          <Image
            src={current.afterImage}
            alt="After transformation"
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-slate-950 text-xs font-mono font-bold uppercase shadow-lg">
            ✓ After: Mighty Warner
          </div>
        </div>

        {/* 'Before' Clipped Foreground (Left Side) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={current.beforeImage}
            alt="Before transformation"
            fill
            className="object-cover filter grayscale contrast-125 brightness-90"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-slate-300 border border-white/20 text-xs font-mono font-bold uppercase shadow-lg">
            ⚠ Before Engagement
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-950 shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize border-2 border-slate-950">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Metrics Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Before Specs */}
        <div className="p-5 rounded-2xl bg-rose-500/[0.03] border border-rose-500/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Legacy Friction Points</span>
          </div>
          <div className="space-y-2">
            {current.beforeMetrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{m.label}</span>
                <span className="font-mono text-slate-300 line-through">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* After Specs */}
        <div className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Modernized Production State</span>
          </div>
          <div className="space-y-2">
            {current.afterMetrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{m.label}</span>
                <span className="font-mono text-emerald-400 font-bold">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

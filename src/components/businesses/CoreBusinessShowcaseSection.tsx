'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { CoreBusinessData, CoreBusinessCard, defaultCoreBusinessData } from '@/types/coreBusiness';

interface CoreBusinessShowcaseSectionProps {
  initialData?: CoreBusinessData;
}

function getCardKeyframes(index: number, totalCards: number) {
  if (totalCards <= 1) {
    return {
      progressPoints: [0, 1],
      yPoints: [0, 0],
      scalePoints: [1, 1],
      dimPoints: [0, 0],
    };
  }

  const N = totalCards;
  const intro = 0.05;
  const exitBuffer = 0.18;
  const travelBudget = 1 - intro - exitBuffer;
  const step = travelBudget / (N - 1);

  const progressPoints: number[] = [0, intro];
  const yPoints: number[] = [];
  const scalePoints: number[] = [];
  const dimPoints: number[] = [];

  // Initial & Intro states
  if (index === 0) {
    yPoints.push(0, 0);
    scalePoints.push(1, 1);
    dimPoints.push(0, 0);
  } else {
    yPoints.push(1100, 1100);
    scalePoints.push(1, 1);
    dimPoints.push(0, 0);
  }

  // Arrival points for each card k
  for (let k = 1; k < N; k++) {
    const kArrival = intro + k * step;
    progressPoints.push(kArrival);

    if (index === k) {
      yPoints.push(0);
      scalePoints.push(1);
      dimPoints.push(0);
    } else if (index < k) {
      const depth = k - index;
      yPoints.push(-depth * 20);
      scalePoints.push(Math.max(0.88, 1 - depth * 0.04));
      dimPoints.push(Math.min(0.45, depth * 0.22));
    } else {
      yPoints.push(1100);
      scalePoints.push(1);
      dimPoints.push(0);
    }
  }

  // Final hold state
  progressPoints.push(1);
  const finalDepth = N - 1 - index;
  yPoints.push(-finalDepth * 20);
  scalePoints.push(Math.max(0.88, 1 - finalDepth * 0.04));
  dimPoints.push(index === N - 1 ? 0 : Math.min(0.45, finalDepth * 0.22));

  return {
    progressPoints,
    yPoints,
    scalePoints,
    dimPoints,
  };
}

function StackingCard({
  card,
  index,
  totalCards,
  progress,
}: {
  card: CoreBusinessCard;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}) {
  const hasImage = Boolean(card.imageUrl && card.imageUrl.trim() !== '');
  const { progressPoints, yPoints, scalePoints, dimPoints } = getCardKeyframes(index, totalCards);

  const y = useTransform(progress, progressPoints, yPoints);
  const scale = useTransform(progress, progressPoints, scalePoints);
  const dim = useTransform(progress, progressPoints, dimPoints);

  return (
    <motion.div
      style={{
        y,
        scale,
        zIndex: 10 + index,
      }}
      className="group absolute inset-0 rounded-3xl sm:rounded-[36px] bg-[#0F172A] border border-slate-700/80 shadow-[0_-12px_36px_rgba(0,0,0,0.65),0_25px_60px_-10px_rgba(0,0,0,0.95)] hover:border-slate-600 overflow-hidden"
    >
      {/* Full-Bleed Extended Uploaded Image Cover across the Whole Card */}
      {hasImage && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0F172A]">
          <img
            src={card.imageUrl!}
            alt={card.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Dark Charcoal/Slate Grey Gradient Scrim for high-contrast legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-transparent to-transparent opacity-80" />
        </div>
      )}

      {/* Subtle Surface Texture when no image is uploaded (Dark Slate Grey Card) */}
      {!hasImage && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0F172A]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#64748B_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        </div>
      )}

      {/* Solid Dimmer Overlay for Covered/Underlying Cards */}
      <motion.div
        style={{ opacity: dim }}
        className="absolute inset-0 bg-[#080C14] pointer-events-none z-15"
      />

      {/* Card Content */}
      <div className="relative z-20 p-6 sm:p-10 lg:p-12 h-full flex flex-col justify-between">
        <div className={hasImage ? 'max-w-2xl' : 'max-w-3xl'}>
          {/* Red Step Index Number */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-rose-500 font-mono text-sm sm:text-base font-bold tracking-wider">
              {card.indexNumber || String(index + 1).padStart(2, '0')}
            </span>
            {hasImage && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/90 text-[10px] font-mono text-slate-200 border border-slate-700">
                <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                <span>Featured Business</span>
              </span>
            )}
          </div>

          {/* Card Title */}
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-3 sm:mb-4 drop-shadow-sm">
            {card.title}
          </h3>

          {/* Card Description */}
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-3 sm:line-clamp-none mb-4 sm:mb-6 drop-shadow-sm">
            {card.description}
          </p>
        </div>

        {/* Bottom Action Pill Button */}
        <div>
          <Link
            href={card.ctaLink || '/businesses'}
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white text-slate-950 hover:bg-slate-100 text-xs sm:text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(0,0,0,0.5)] group/btn cursor-pointer"
          >
            <span>{card.ctaText || 'more information'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function CoreBusinessShowcaseSection({ initialData }: CoreBusinessShowcaseSectionProps) {
  const [data, setData] = useState<CoreBusinessData>(initialData || defaultCoreBusinessData);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialData) {
      fetch('/api/core-business')
        .then((res) => res.json())
        .then((json) => {
          if (json && json.cards) {
            setData(json);
          }
        })
        .catch((err) => {
          console.error('Failed to load core business data:', err);
        });
    }
  }, [initialData]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth weighted spring physics for luxurious, slightly lagged scroll scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  });

  if (!data.isActive) {
    return null;
  }

  const cards = data.cards && data.cards.length > 0 ? data.cards : defaultCoreBusinessData.cards;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#DBDBDB] dark:bg-[#080C14] text-slate-900 dark:text-white border-t border-neutral-300 dark:border-white/[0.08] transition-colors duration-200"
      style={{ height: `${Math.max(cards.length, 1) * 105 + 50}vh` }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-rose-500/5 dark:bg-indigo-950/20 blur-[150px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[500px] h-[400px] bg-sky-500/5 dark:bg-sky-950/15 blur-[130px] rounded-full" />
        <div className="absolute inset-0 subtle-grid-bg opacity-10" />
      </div>

      {/* Pinned Sticky Viewport (Always Centered in Screen, No Blank Gaps) */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        {/* Section Headline (Positioned at the top as shown in screenshot, stationary during card scroll) */}
        <div className="text-center z-20 pointer-events-none px-4 max-w-3xl mb-6 sm:mb-8 shrink-0">
          {data.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.04] text-[11px] font-mono tracking-widest text-slate-700 dark:text-slate-300 uppercase mb-2.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <span>{data.badge}</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight drop-shadow-xs">
            {data.title || 'CORE BUSINESSES'}
          </h2>

          {data.subtitle && (
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed line-clamp-2">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Centered Stacking Stage (Enlarged overlapping cards with cinematic presence) */}
        <div className="relative w-full max-w-6xl h-[380px] sm:h-[430px] shrink-0 flex items-center justify-center">
          {cards.map((card, idx) => (
            <StackingCard
              key={card.id || idx}
              card={card}
              index={idx}
              totalCards={cards.length}
              progress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

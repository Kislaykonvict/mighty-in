'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Star,
  ArrowRight,
  Quote,
} from 'lucide-react';
import {
  TestimonialsSectionData,
  defaultTestimonialsSectionData,
  TestimonialCard,
} from '@/types/testimonialsSection';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface TestimonialsSectionProps {
  initialData?: TestimonialsSectionData;
}

export function TestimonialsSection({ initialData }: TestimonialsSectionProps) {
  const data = initialData || defaultTestimonialsSectionData;
  const cards: TestimonialCard[] =
    data.cards && data.cards.length > 0 ? data.cards : defaultTestimonialsSectionData.cards;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Responsive mobile screen detector
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalCount = cards.length;
  const safeIndex = totalCount > 0 ? currentIndex % totalCount : 0;

  const handleNext = useCallback(() => {
    if (totalCount === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    if (totalCount === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Fast autoplay rotation every 3.5 seconds, pauses on hover or interaction
  useEffect(() => {
    if (isPaused || totalCount <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, handleNext, totalCount, currentIndex]);

  // Keyboard navigation when hovering or focusing section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!data.isActive) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-12 sm:py-16 bg-[#060A12] relative border-t border-white/8 overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Dynamic Section Header */}
        {(data.badge || data.title || data.subtitle) && (
          <SectionHeader
            eyebrow={data.badge ? data.badge : undefined}
            badgeVariant="subtle"
            title={data.title ? data.title : ''}
            subtitle={data.subtitle ? data.subtitle : undefined}
            align="left"
            className="mb-6 sm:mb-8"
          />
        )}

        {/* 3D Depth Card Stack Stage */}
        <div className="relative w-full min-h-[480px] sm:min-h-[380px] lg:min-h-[360px] flex items-center justify-center py-3 sm:py-6 [perspective:1200px]">
          {cards.map((t, idx) => {
            // Circular offset calculation relative to safeIndex
            let offset = idx - safeIndex;
            if (offset > totalCount / 2) offset -= totalCount;
            if (offset < -totalCount / 2) offset += totalCount;

            const isActive = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;
            const isVisible = Math.abs(offset) <= 1;

            if (!isVisible && totalCount > 3) {
              return null;
            }

            return (
              <motion.div
                key={t.id}
                onClick={() => {
                  if (isPrev) {
                    handlePrev();
                    setIsPaused(true);
                  }
                  if (isNext) {
                    handleNext();
                    setIsPaused(true);
                  }
                }}
                drag={isActive ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragStart={() => setIsPaused(true)}
                onDragEnd={(_, { offset: dragOffset, velocity }) => {
                  const swipe = Math.abs(dragOffset.x) * velocity.x;
                  if (swipe < -80 || dragOffset.x < -50) {
                    handleNext();
                  } else if (swipe > 80 || dragOffset.x > 50) {
                    handlePrev();
                  }
                  setIsPaused(true);
                }}
                initial={false}
                animate={{
                  x: isActive
                    ? '0%'
                    : isMobile
                    ? offset > 0 ? '12px' : '-12px'
                    : offset > 0 ? '46%' : '-46%',
                  y: isMobile && !isActive ? 12 : 0,
                  scale: isActive ? 1 : isMobile ? 0.94 : 0.88,
                  rotateY: isActive ? 0 : isMobile ? 0 : offset > 0 ? -8 : 8,
                  z: isActive ? 40 : 10,
                  opacity: isActive ? 1 : isMobile ? 0.25 : 0.35,
                  filter: isActive ? 'blur(0px)' : isMobile ? 'blur(0.5px)' : 'blur(1px)',
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2 }
                    : { type: 'spring', stiffness: 340, damping: 28, mass: 0.8 }
                }
                style={{
                  zIndex: isActive ? 30 : 10,
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute w-full max-w-4xl rounded-2xl transition-shadow duration-300 ${
                  isActive
                    ? 'cursor-default shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)]'
                    : 'cursor-pointer hover:opacity-60 shadow-lg'
                }`}
              >
                {/* Clean Grey Card with Full-Height Portrait & Fading Split Layout */}
                <div
                  className={`relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col sm:flex-row bg-[#181E29] ${
                    isActive ? 'border-white/12' : 'border-white/6'
                  }`}
                >
                  {/* Left Column: Full-Height Portrait with Right Fade & Overlaid Details */}
                  <div className="relative w-full sm:w-72 md:w-80 shrink-0 min-h-[260px] sm:min-h-[360px] flex flex-col justify-end overflow-hidden">
                    {/* Author Portrait Image */}
                    {t.avatarUrl ? (
                      <div className="absolute inset-0">
                        <Image
                          src={t.avatarUrl}
                          alt={t.clientName}
                          fill
                          sizes="(max-width: 640px) 100vw, 320px"
                          className="object-cover object-top"
                          priority={isActive}
                        />
                        {/* Desktop: Right-side horizontal fade blending into the card background and separation line */}
                        <div className="hidden sm:block absolute inset-y-0 right-0 w-28 bg-gradient-to-r from-transparent via-[#181E29]/70 to-[#181E29] pointer-events-none" />

                        {/* Mobile: Bottom-side fade blending into card body */}
                        <div className="sm:hidden absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#181E29] via-[#181E29]/80 to-transparent pointer-events-none" />

                        {/* Subtle vignette across the portrait to make text pop */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181E29] via-[#181E29]/40 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center font-bold text-white text-5xl">
                        {t.clientName ? t.clientName.charAt(0) : ''}
                      </div>
                    )}

                    {/* Author Details Overlaid at Bottom */}
                    {(t.clientName || t.role || t.company || t.industry) && (
                      <div className="relative z-10 p-5 sm:p-6 space-y-1">
                        {t.clientName && (
                          <div className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md">
                            {t.clientName}
                          </div>
                        )}
                        {t.role && (
                          <div className="text-xs sm:text-sm text-slate-200 leading-snug drop-shadow-md">
                            {t.role}
                          </div>
                        )}
                        {t.company && (
                          <div className="text-xs sm:text-sm text-sky-300 font-semibold drop-shadow-md">
                            {t.company}
                          </div>
                        )}
                        {t.industry && (
                          <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider pt-0.5 drop-shadow-sm">
                            {t.industry}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fading Separation Line */}
                  <div className="hidden sm:block w-px self-stretch bg-gradient-to-b from-transparent via-white/20 to-transparent shrink-0" />
                  <div className="sm:hidden h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent shrink-0" />

                  {/* Right Column: Category Badge, Stars, Quote & Case Study Link */}
                  <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-10">
                    {/* Decorative Quote Mark */}
                    <Quote className="absolute top-6 right-6 sm:top-8 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 text-white/[0.03] pointer-events-none" />

                    <div>
                      {/* Top Row: 5-Star Rating */}
                      <div className="flex items-center gap-1 text-amber-400 mb-4 sm:mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Testimonial Quote */}
                      {t.quote && (
                        <blockquote className="text-base sm:text-lg lg:text-[19px] font-normal text-slate-100 leading-relaxed tracking-tight py-1 sm:py-2">
                          &ldquo;{t.quote}&rdquo;
                        </blockquote>
                      )}
                    </div>

                    {/* Bottom Row: Read Case Study Link */}
                    {t.relatedProjectSlug && (
                      <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/8">
                        <Link
                          href={`/work/${t.relatedProjectSlug}`}
                          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors group ${
                            isActive ? '' : 'pointer-events-none opacity-60'
                          }`}
                        >
                          <span>Read case study</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Centered Progress Indicator Dots */}
        <div className="flex items-center justify-center mt-5 sm:mt-6 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            {cards.map((t, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'w-6 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                      : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

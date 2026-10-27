'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeroData, defaultHeroData } from '@/types/hero';
import { RichTextContent } from '@/components/ui/RichTextContent';

interface HeroSectionProps {
  data?: HeroData;
}

export function HeroSection({ data: initialData }: HeroSectionProps) {
  const [data, setData] = useState<HeroData>(initialData || defaultHeroData);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync if initialData changes or fetch on mount if missing
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      fetch('/api/hero')
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data) {
            setData(res.data);
          }
        })
        .catch(() => {});
    }
  }, [initialData]);

  // Ensure video element is muted for unblocked autoplay policy
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [data.videoUrl]);

  const overlayAlpha = (data.overlayOpacity ?? 55) / 100;

  return (
    <section className="relative w-full min-h-screen flex items-end overflow-hidden bg-[#080C14]">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Background Video Element */}
        {data.videoUrl && !videoError ? (
          <video
            ref={videoRef}
            key={data.videoUrl}
            src={data.videoUrl}
            poster={data.fallbackImageUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={data.videoUrl} type="video/mp4" />
          </video>
        ) : data.fallbackImageUrl ? (
          <Image
            src={data.fallbackImageUrl}
            alt="Hero Background Poster"
            fill
            priority
            className="object-cover object-center scale-105"
          />
        ) : null}

        {/* Configurable Overlay Tint */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: `rgba(8, 12, 20, ${overlayAlpha})` }}
        />

        {/* Cinematic Directional Gradients for Maximum Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/90 via-[#080C14]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-[#080C14]/60 pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />
      </div>

      {/* Hero Content (Anchored to the Bottom Left, Full Viewport Responsive) */}
      <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-36 pb-14 sm:pb-16 md:pb-20 lg:pb-24 flex justify-start">
        <div className="max-w-3xl lg:max-w-4xl w-full text-left">

          {/* Chunky Bold Headline */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-left"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.04] drop-shadow-md text-left">
              <RichTextContent content={data.title || "Creative staffing for what's next."} inline />
            </h1>
          </motion.div>

          {/* Supporting Subtitle / Description */}
          {data.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10 max-w-2xl text-left"
            >
              <RichTextContent
                content={data.subtitle}
                as="p"
                className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed drop-shadow-sm text-left"
              />
            </motion.div>
          )}

          {/* Two Action Buttons (Solid High-Contrast Corporate Styling) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-start gap-4 text-left"
          >
            {data.ctaText && (
              <Link
                href={data.ctaLink || '/work'}
                className="px-7 py-3.5 sm:px-8 sm:py-4 bg-rose-600 hover:bg-rose-700 text-white border border-rose-500 font-extrabold text-xs sm:text-sm tracking-widest uppercase rounded-lg shadow-xl shadow-rose-900/30 transition-all duration-200 active:scale-95 text-center inline-block cursor-pointer hover:scale-[1.02]"
              >
                {data.ctaText}
              </Link>
            )}

            {data.secondaryCtaText && (
              <Link
                href={data.secondaryCtaLink || '/contact'}
                className="px-7 py-3.5 sm:px-8 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 font-extrabold text-xs sm:text-sm tracking-widest uppercase rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-center inline-block cursor-pointer hover:scale-[1.02]"
              >
                {data.secondaryCtaText}
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

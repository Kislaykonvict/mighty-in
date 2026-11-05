'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { AboutHeroData, defaultAboutHeroData } from '@/types/aboutHero';
import { RichTextContent } from '@/components/ui/RichTextContent';

interface AboutHeroVersettProps {
  initialData?: AboutHeroData;
}

export function AboutHeroVersett({ initialData }: AboutHeroVersettProps) {
  const data = initialData || defaultAboutHeroData;

  if (data.isActive === false) {
    return null;
  }

  const scrollToTrajectory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = (data.scrollTarget || '#trajectory').replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-end overflow-hidden bg-[#080C14] border-b border-white/8">
      {/* Background Image Layer with Cinematic Clarity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src={data.backgroundImage || defaultAboutHeroData.backgroundImage}
          alt={data.imageAlt || defaultAboutHeroData.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-right opacity-100 brightness-[1.08] contrast-[1.05]"
        />
        {/* Cinematic Directional Gradients for Maximum Text Contrast (Matching Homepage) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/90 via-[#080C14]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-[#080C14]/60 pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />
      </div>

      {/* Main Content Area - Anchored to Bottom-Left (Matching Homepage Grid) */}
      <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-36 pb-14 sm:pb-16 md:pb-20 lg:pb-24 flex justify-start">
        <div className="max-w-3xl lg:max-w-4xl space-y-6 text-left">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-black text-white tracking-tight leading-[1.04] drop-shadow-md text-left">
            <RichTextContent content={data.headline} inline />
          </h1>

          {data.subheadline && (
            <div className="max-w-2xl text-left">
              <RichTextContent
                content={data.subheadline}
                as="div"
                className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed drop-shadow-sm text-left"
              />
            </div>
          )}

          {/* CTA & Scroll Indicator */}
          <div className="pt-2 flex flex-col items-start gap-4">
            {data.ctaText && (
              <div>
                <Link
                  href={data.ctaLink || '/approach'}
                  className="inline-flex items-center text-sm sm:text-base text-slate-200 hover:text-white pb-1.5 border-b border-white/50 hover:border-white transition-all tracking-wide font-medium cursor-pointer"
                >
                  {data.ctaText}
                </Link>
              </div>
            )}

            {/* Bottom Scroll Indicator Arrow */}
            <a
              href={data.scrollTarget || '#trajectory'}
              onClick={scrollToTrajectory}
              className="inline-flex items-center text-slate-400 hover:text-white transition-colors group p-1 -ml-1 cursor-pointer"
              aria-label="Scroll to trajectory section"
            >
              <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

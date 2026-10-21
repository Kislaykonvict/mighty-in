'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { SectionContainer } from '@/components/layout/SectionContainer';

export function AboutHeroVersett() {
  const scrollToTrajectory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('trajectory');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-between overflow-hidden bg-[#080C14] border-b border-white/8">
      {/* Background Image with Dark Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/about/hero-versett.jpg"
          alt="Mighty Warner Strategic Technology & Digital Solutions"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-[center_right] opacity-75"
        />
        {/* Editorial Vignette & Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C14] via-[#080C14]/85 to-[#080C14]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-[#080C14]/70" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center py-24 sm:py-32">
        <SectionContainer width="default" paddingY="none">
          <div className="max-w-4xl space-y-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.85rem] font-normal text-white tracking-tight leading-[1.14]">
              We combine strategy, technology, and talent to solve the most complex business challenges.
            </h1>

            <div>
              <Link
                href="/approach"
                className="inline-block text-sm sm:text-base text-slate-200 hover:text-white pb-1 border-b border-white/50 hover:border-white transition-colors tracking-wide font-light"
              >
                Explore Our Method
              </Link>
            </div>
          </div>
        </SectionContainer>
      </div>

      {/* Bottom Scroll Indicator Arrow */}
      <div className="relative z-10 pb-10 sm:pb-12">
        <SectionContainer width="default" paddingY="none">
          <a
            href="#trajectory"
            onClick={scrollToTrajectory}
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors group p-2 -ml-2"
            aria-label="Scroll to trajectory section"
          >
            <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1.5" />
          </a>
        </SectionContainer>
      </div>
    </section>
  );
}

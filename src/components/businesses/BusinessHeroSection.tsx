'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { BusinessHeroData } from '@/types/businessVertical';
import { RichTextContent } from '@/components/ui/RichTextContent';

interface BusinessHeroSectionProps {
  data: BusinessHeroData;
}

export function BusinessHeroSection({ data }: BusinessHeroSectionProps) {
  if (data.isActive === false) {
    return null;
  }

  const scrollToPhilosophy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = (data.scrollTarget || '#philosophy').replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[88vh] sm:min-h-[92vh] flex flex-col justify-end overflow-hidden bg-[#080C14] border-b border-white/8 pb-8 sm:pb-12 pt-28">
      {/* Background Image with Cinematic Clarity */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={data.backgroundImage || '/images/about/verssett-hero-bg.jpg'}
          alt={data.imageAlt || data.headline}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-right opacity-100 brightness-[1.12] contrast-[1.05]"
        />
        {/* Soft directional gradients for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/85 via-[#080C14]/25 to-transparent sm:w-3/5" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        <SectionContainer width="default" paddingY="none">
          <div className="max-w-3xl lg:max-w-4xl space-y-6 sm:space-y-8 -ml-6 sm:-ml-12 lg:-ml-20">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.85rem] font-normal text-white tracking-tight leading-[1.12] drop-shadow-sm">
              <RichTextContent content={data.headline} inline />
            </h1>

            {data.subheadline && (
              <RichTextContent
                content={data.subheadline}
                as="p"
                className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl"
              />
            )}

            {data.ctaText && (
              <div>
                <Link
                  href={data.ctaLink || '#philosophy'}
                  className="inline-block text-sm sm:text-base text-slate-200 hover:text-white pb-1 border-b border-white/50 hover:border-white transition-colors tracking-wide font-light"
                >
                  {data.ctaText}
                </Link>
              </div>
            )}

            {/* Bottom Scroll Indicator Arrow */}
            <div className="pt-2">
              <a
                href={data.scrollTarget || '#philosophy'}
                onClick={scrollToPhilosophy}
                className="inline-flex items-center text-slate-400 hover:text-white transition-colors group p-1 -ml-1 cursor-pointer"
                aria-label="Scroll to philosophy section"
              >
                <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1.5" />
              </a>
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
}


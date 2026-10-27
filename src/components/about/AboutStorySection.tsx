'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { AboutStoryData, defaultAboutStoryData } from '@/types/aboutStory';
import { RichTextContent } from '@/components/ui/RichTextContent';

interface AboutStorySectionProps {
  initialData?: AboutStoryData;
}

export function AboutStorySection({ initialData }: AboutStorySectionProps) {
  const data = initialData || defaultAboutStoryData;
  const cards = data.cards && data.cards.length > 0 ? data.cards : defaultAboutStoryData.cards;

  if (data.isActive === false) {
    return null;
  }

  return (
    <section id="our-story" className="py-20 sm:py-32 bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/8 relative overflow-hidden text-slate-900 dark:text-white">
      {/* Background atmospheric ambient gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-rose-500/5 dark:bg-sky-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/5 blur-[140px] pointer-events-none rounded-full" />

      <SectionContainer width="default" paddingY="none" className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 sm:mb-28 space-y-4">
          {data.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase bg-rose-50 dark:bg-white/5 border border-rose-200 dark:border-white/10 text-rose-600 dark:text-sky-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-sky-400 animate-pulse" />
              <RichTextContent content={data.badge} inline />
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            <RichTextContent content={data.title} inline />
          </h2>

          <RichTextContent
            content={data.subtitle}
            as="p"
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
          />
        </div>

        {/* Alternating Story Cards */}
        <div className="space-y-20 sm:space-y-32">
          {cards.map((card, idx) => {
            const isImageRight = idx % 2 === 0;

            return (
              <motion.div
                key={card.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {/* Text Block */}
                <div
                  className={`space-y-6 ${
                    isImageRight ? 'md:order-1' : 'md:order-2'
                  }`}
                >
                  {card.badge && (
                    <div className="text-[11px] font-mono uppercase tracking-widest text-rose-600 dark:text-slate-400 font-semibold">
                      {card.badge}
                    </div>
                  )}

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    <RichTextContent content={card.title} inline />
                  </h3>

                  <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                    {card.paragraphs.map((p, pIdx) => (
                      <div key={pIdx}>
                        <RichTextContent content={p} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Block */}
                <div
                  className={`relative ${
                    isImageRight ? 'md:order-2' : 'md:order-1'
                  }`}
                >
                  <div className="group relative aspect-[4/5] sm:aspect-[3/4] w-full max-w-lg mx-auto rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-slate-100 dark:bg-[#0F1626]">
                    <Image
                      src={card.image}
                      alt={card.imageAlt || card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={idx === 0}
                    />

                    {/* Subtle aesthetic overlay vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}

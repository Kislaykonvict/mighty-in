'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';

export function PeopleSection() {
  const previewAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#DBDBDB] dark:bg-[#080C14] relative border-t border-neutral-300 dark:border-white/8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#0B101D] dark:via-[#0F1626] dark:to-[#080C14] border border-slate-200 dark:border-white/10 p-8 sm:p-12 lg:p-16 shadow-xl"
        >
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400">
                • CROSS-FUNCTIONAL EXPERTISE
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Behind the work are people who care about the outcome.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Our multidisciplinary leadership unifies brand architects, principal cloud engineers, data scientists, and talent strategists under one collaborative culture.
              </p>

              {/* Avatar stack preview */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {previewAvatars.map((url, i) => (
                    <div
                      key={i}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#0F1626] overflow-hidden relative"
                    >
                      <Image
                        src={url}
                        alt="Team preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Multidisciplinary Leadership Pods
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/team"
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all group cursor-pointer"
              >
                <Users className="w-4 h-4 text-rose-500" />
                <span>Meet the Full Team</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

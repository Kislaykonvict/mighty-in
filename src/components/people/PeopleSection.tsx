'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { leadershipTeam } from '@/data/company';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function PeopleSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#DBDBDB] dark:bg-[#080C14] relative border-t border-neutral-300 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CROSS-FUNCTIONAL EXPERTISE"
          badgeVariant="subtle"
          title="Behind the work are people who care about the outcome."
          subtitle="Our multidisciplinary leadership unifies brand architects, principal cloud engineers, data scientists, and talent strategists under one collaborative culture."
          align="left"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadershipTeam.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/20 shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 w-full rounded-xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 dark:from-[#0F1626] via-transparent to-transparent opacity-60" />
                </div>

                <div className="text-xs font-mono text-rose-600 dark:text-sky-400 font-bold uppercase mb-1 tracking-wider">
                  {member.specialty}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {member.name}
                </h3>

                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-3">
                  {member.role}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

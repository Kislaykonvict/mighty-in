'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MIGHTY_OFFICES, GLOBAL_NETWORK_STATS, OfficeLocation } from '@/data/offices';
import { InteractiveGlobe } from './InteractiveGlobe';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  Building2,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function GlobalOfficesSection() {
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation>(MIGHTY_OFFICES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveTimes, setLiveTimes] = useState<{ [key: string]: string }>({});

  // Calculate live times for all office timezones every second
  useEffect(() => {
    const updateTimes = () => {
      const times: { [key: string]: string } = {};
      MIGHTY_OFFICES.forEach((office) => {
        try {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: office.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });
          times[office.id] = formatter.format(new Date());
        } catch {
          times[office.id] = '--:--';
        }
      });
      setLiveTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyAddress = (office: OfficeLocation) => {
    navigator.clipboard.writeText(office.fullAddress);
    setCopiedId(office.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="global-offices" className="py-24 bg-[#DBDBDB] dark:bg-[#080C14] relative overflow-hidden border-t border-b border-neutral-300 dark:border-white/8 transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-rose-500/5 dark:bg-brand-crimson/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-500/5 dark:bg-brand-royal/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />

      <SectionContainer width="default">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="subtle" dot className="mb-4">
            GLOBAL PRESENCE & REGIONAL HUBS
          </Badge>
          <h2 className="text-display-h2 font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Local Proximity. <span className="text-rose-600 dark:gradient-text-brand">Global Velocity.</span>
          </h2>
          <p className="text-body-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            With strategically positioned executive offices across the UAE, United States, Canada, and India, Mighty Warner delivers 24/7 follow-the-sun execution and localized leadership for fast-growing enterprises worldwide.
          </p>
        </div>

        {/* Global Statistics Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {GLOBAL_NETWORK_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 hover:border-rose-400 dark:hover:border-brand-crimson/30 transition-all duration-300 shadow-xs hover:shadow-sm group"
            >
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-brand-crimson transition-colors font-mono mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{stat.subtext}</div>
            </div>
          ))}
        </div>

        {/* 3D Globe + Active Office Details Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Column: Interactive 3D Globe */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="text-center mb-4 lg:hidden">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-rose-600" />
                Tap any city below to rotate globe
              </span>
            </div>

            <InteractiveGlobe
              selectedOffice={selectedOffice}
              onSelectOffice={(office) => setSelectedOffice(office)}
            />

            {/* Follow-the-Sun 24/7 Cycle Banner */}
            <div className="mt-4 w-full max-w-[500px] p-3.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-slate-900 dark:text-white">24/7 Global Hand-off</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">EST (US) ➔ GST (UAE) ➔ IST (India)</span>
            </div>
          </div>

          {/* Right Column: Selected Office Deep-Dive Card */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedOffice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-7 md:p-8 rounded-3xl bg-white dark:bg-[#141D30] border border-slate-200 dark:border-white/15 shadow-md relative overflow-hidden"
              >
                {/* Accent Top Border Gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-blue-600 to-emerald-500" />

                {/* Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-3xl">{selectedOffice.flag}</span>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {selectedOffice.city}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 dark:bg-brand-crimson/15 dark:text-brand-crimson dark:border-brand-crimson/25 text-xs font-semibold">
                        {selectedOffice.country}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-rose-600 dark:text-brand-royal flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-rose-600" />
                      <span>{selectedOffice.role}</span>
                    </div>
                  </div>

                  {/* Live Clock Pill */}
                  <div className="flex flex-col items-end px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Local Time</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                      {liveTimes[selectedOffice.id] || '--:--'}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ● Active Desk ({selectedOffice.utcOffset})
                    </div>
                  </div>
                </div>

                <p className="text-body-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  {selectedOffice.description}
                </p>

                {/* Office Details Grid */}
                <div className="space-y-4 mb-7 bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-200 dark:border-white/6">
                  {/* Address */}
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedOffice.address}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(selectedOffice)}
                      className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 flex items-center gap-1 text-xs"
                      title="Copy Address"
                    >
                      {copiedId === selectedOffice.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200 dark:border-white/5 text-sm">
                    {selectedOffice.phoneNumbers.map((phone, pIdx) => (
                      <a
                        key={pIdx}
                        href={phone.link}
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-brand-crimson transition-colors group"
                      >
                        <Phone className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{phone.label}:</span>
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 font-mono text-xs">
                          {phone.number}
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Email & Team */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                    <a
                      href={`mailto:${selectedOffice.email}`}
                      className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-rose-600" />
                      <span>{selectedOffice.email}</span>
                    </a>
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <Users className="w-3.5 h-3.5 text-rose-600" />
                      <span>{selectedOffice.teamSizeBadge}</span>
                    </div>
                  </div>
                </div>

                {/* Specialties Badges */}
                <div className="mb-7">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Regional Capabilities & Focus:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffice.specialties.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                  {selectedOffice.whatsapp && (
                    <a
                      href={selectedOffice.whatsapp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[160px]"
                    >
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>WhatsApp Desk</span>
                      </Button>
                    </a>
                  )}

                  <a
                    href={`/contact?office=${selectedOffice.id}`}
                    className="flex-1 min-w-[160px]"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <span>Connect with {selectedOffice.city.split(',')[0]}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Office Selection Grid Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MIGHTY_OFFICES.map((office) => {
            const isSelected = selectedOffice.id === office.id;
            return (
              <button
                key={office.id}
                type="button"
                onClick={() => setSelectedOffice(office)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 relative group overflow-hidden border ${
                  isSelected
                    ? 'bg-white dark:bg-white/[0.08] border-rose-500 dark:border-brand-crimson shadow-md dark:shadow-xl dark:shadow-brand-crimson/10 -translate-y-1'
                    : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/8 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {/* Active indicator badge */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-600 dark:bg-brand-crimson animate-ping" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{office.flag}</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">
                    {liveTimes[office.id]?.slice(0, 5) || '--:--'}{' '}
                    {liveTimes[office.id]?.slice(-2)}
                  </span>
                </div>

                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-rose-600 dark:group-hover:text-brand-crimson transition-colors flex items-center gap-1.5">
                  <span>{office.city}</span>
                </div>

                <div className="text-xs text-rose-600 dark:text-brand-royal font-semibold mb-2">
                  {office.country}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {office.address}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/6 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{office.teamSizeBadge}</span>
                  <span className="text-rose-600 dark:text-brand-crimson font-medium flex items-center gap-0.5">
                    View Office <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}

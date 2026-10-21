import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, Mail, MapPin } from 'lucide-react';
import { footerLinks } from '@/data/navigation';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="bg-[#05080E] border-t border-white/8 pt-16 sm:pt-24 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand Statement */}
        <div className="pb-12 mb-12 border-b border-white/8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/12 flex items-center shadow-md">
                <Image
                  src="/images/mw-logo.webp"
                  alt="Mighty Warner"
                  width={140}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              One company. Multiple ways to move your business forward. We engineer digital brands, scalable software platforms, and elite engineering teams.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-sky-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PEOPLE + TECHNOLOGY + GROWTH = BUSINESS MOMENTUM</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-6 lg:justify-end items-start sm:items-center">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8">
              <div className="text-xs font-mono text-slate-400 mb-1">GLOBAL REACH</div>
              <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>North America • EMEA • APAC</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8">
              <div className="text-xs font-mono text-slate-400 mb-1">DIRECT INQUIRIES</div>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-sm font-semibold text-white hover:text-sky-400 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                <span>{siteConfig.contact.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-bold mb-4">
              Businesses
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.businesses.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-bold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-bold mb-4">
              Specializations
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-bold mb-4">
              Connect & Engage
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.contact.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1 group">
                    <span>{link.name}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} Mighty Warner Inc. All rights reserved. Building businesses since 2013.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/terms-and-conditions" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="hover:text-slate-300 transition-colors">
              Disclaimer
            </Link>
            <Link href="/refund-policy" className="hover:text-slate-300 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React, { Suspense } from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { ContactWizard } from '@/components/contact/ContactWizard';
import { GlobalOfficesSection } from '@/components/globe/GlobalOfficesSection';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata = constructMetadata({
  title: 'Start a Conversation | Contact Mighty Warner',
  description:
    'Connect with Mighty Warner across Digital & Growth, Technology, or Talent Solutions. Book a consultation or request project proposals.',
  canonical: '/contact',
});

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-12 bg-[#080C14] border-b border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-20 pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <Badge variant="subtle" dot className="mb-4">
            INITIATE PARTNERSHIP
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-white tracking-tight mb-4 max-w-4xl">
            Let’s figure out what’s <span className="gradient-text-brand">next for your business.</span>
          </h1>
          <p className="text-body-lg text-slate-300 max-w-2xl leading-relaxed">
            Tell us about your brand goals, software requirements, or talent needs. We will connect you directly with the relevant practice lead.
          </p>
        </SectionContainer>
      </section>

      {/* Main Form & Sidebar Section */}
      <SectionContainer width="default" paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Wizard */}
          <div className="lg:col-span-8">
            <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading form...</div>}>
              <ContactWizard />
            </Suspense>
          </div>

          {/* Right Column: Direct Channels & Confidence */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0F1626] border border-white/8 space-y-5">
              <div className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
                DIRECT CHANNELS
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs text-slate-400 mb-1">General Inquiries</div>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-white font-semibold hover:text-sky-400 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>{siteConfig.contact.email}</span>
                  </a>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1">Global Office Network</div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>{siteConfig.contact.headquarters}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1">Guaranteed SLA</div>
                  <div className="text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Initial response within 24 business hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Confidentiality Guarantee</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We handle proprietary business strategies, source code discussions, and executive hiring searches under strict mutual non-disclosure agreements.
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Global Office Network 3D Globe Section */}
      <GlobalOfficesSection />
    </div>
  );
}

import React, { Suspense } from 'react';
import { constructMetadata } from '@/lib/utils/seo';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/Badge';
import { ContactWizard } from '@/components/contact/ContactWizard';
import { GlobalOfficesSection } from '@/components/globe/GlobalOfficesSection';
import { Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { defaultGlobalOfficesData, GlobalOfficesData } from '@/types/globalOffices';
import { defaultContactSectionData, ContactSectionData } from '@/types/contactSection';

export const revalidate = 0;

export const metadata = constructMetadata({
  title: 'Start a Conversation | Contact Mighty Warner',
  description:
    'Connect with Mighty Warner across Digital & Growth, Technology, or Talent Solutions. Book a consultation or request project proposals.',
  canonical: '/contact',
});

async function getGlobalOfficesData(): Promise<GlobalOfficesData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'global_offices',
        },
      },
    });

    if (!section) return defaultGlobalOfficesData;

    const content = (section.content as any) || {};

    return {
      badge:
        section.badge !== null && section.badge !== undefined
          ? section.badge
          : defaultGlobalOfficesData.badge,
      title:
        section.title !== null && section.title !== undefined
          ? section.title
          : defaultGlobalOfficesData.title,
      highlightedTitle:
        typeof content.highlightedTitle === 'string'
          ? content.highlightedTitle
          : defaultGlobalOfficesData.highlightedTitle,
      description:
        section.subtitle !== null && section.subtitle !== undefined
          ? section.subtitle
          : typeof content.description === 'string'
          ? content.description
          : defaultGlobalOfficesData.description,
      cycleBannerText:
        typeof content.cycleBannerText === 'string'
          ? content.cycleBannerText
          : defaultGlobalOfficesData.cycleBannerText,
      stats:
        Array.isArray(content.stats) && content.stats.length > 0
          ? content.stats
          : defaultGlobalOfficesData.stats,
      offices:
        Array.isArray(content.offices) && content.offices.length > 0
          ? content.offices
          : defaultGlobalOfficesData.offices,
      isActive: section.isActive ?? true,
    };
  } catch (err) {
    return defaultGlobalOfficesData;
  }
}

async function getContactSectionData(): Promise<ContactSectionData> {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'contact',
          sectionKey: 'main',
        },
      },
    });

    if (!section) return defaultContactSectionData;

    const content = (section.content as any) || {};

    return {
      badge:
        section.badge !== null && section.badge !== undefined
          ? section.badge
          : defaultContactSectionData.badge,
      title:
        section.title !== null && section.title !== undefined
          ? section.title
          : defaultContactSectionData.title,
      highlightedTitle:
        typeof content.highlightedTitle === 'string'
          ? content.highlightedTitle
          : defaultContactSectionData.highlightedTitle,
      description:
        section.subtitle !== null && section.subtitle !== undefined
          ? section.subtitle
          : typeof content.description === 'string'
          ? content.description
          : defaultContactSectionData.description,
      topics:
        Array.isArray(content.topics) && content.topics.length > 0
          ? content.topics
          : defaultContactSectionData.topics,
      form: {
        ...defaultContactSectionData.form,
        ...(content.form || {}),
      },
      directChannels: {
        ...defaultContactSectionData.directChannels,
        ...(content.directChannels || {}),
      },
      confidentiality: {
        ...defaultContactSectionData.confidentiality,
        ...(content.confidentiality || {}),
      },
      isActive: section.isActive ?? true,
    };
  } catch (err) {
    return defaultContactSectionData;
  }
}

export default async function ContactPage() {
  const [globalOfficesData, contactData] = await Promise.all([
    getGlobalOfficesData(),
    getContactSectionData(),
  ]);

  const { directChannels, confidentiality } = contactData;

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#080C14]">
      {/* Header */}
      <section className="pt-28 sm:pt-32 pb-12 bg-[#DBDBDB] dark:bg-[#080C14] border-b border-neutral-300 dark:border-white/8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-gradient-to-r from-orange-500/5 via-blue-500/5 to-emerald-500/5 dark:from-orange-500/10 dark:via-blue-500/10 dark:to-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 subtle-grid-bg opacity-15 pointer-events-none" />

        <SectionContainer width="default" paddingY="none" className="relative z-10">
          <Badge variant="subtle" dot className="mb-4">
            {contactData.badge}
          </Badge>
          <h1 className="text-display-h1 font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 max-w-4xl">
            {contactData.title}{' '}
            <span className="gradient-text-brand">{contactData.highlightedTitle}</span>
          </h1>
          <p className="text-body-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {contactData.description}
          </p>
        </SectionContainer>
      </section>

      {/* Main Form & Sidebar Section */}
      <SectionContainer width="default" paddingY="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Wizard */}
          <div className="lg:col-span-8">
            <Suspense
              fallback={
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                  Loading form...
                </div>
              }
            >
              <ContactWizard contactData={contactData} />
            </Suspense>
          </div>

          {/* Right Column: Direct Channels & Confidence */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/8 space-y-5 shadow-sm">
              <div className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-sky-400 font-bold">
                {directChannels.title}
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {directChannels.emailLabel}
                  </div>
                  <a
                    href={`mailto:${directChannels.email}`}
                    className="text-slate-900 dark:text-white font-semibold hover:text-rose-600 dark:hover:text-sky-400 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-rose-600 dark:text-orange-400" />
                    <span>{directChannels.email}</span>
                  </a>
                </div>

                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {directChannels.officesLabel}
                  </div>
                  {directChannels.officesLink ? (
                    <a
                      href={directChannels.officesLink}
                      className="text-slate-900 dark:text-white font-semibold hover:text-rose-600 dark:hover:text-sky-400 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                      <span>{directChannels.officesText}</span>
                    </a>
                  ) : (
                    <div className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                      <span>{directChannels.officesText}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {directChannels.slaLabel}
                  </div>
                  <div className="text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{directChannels.slaText}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{confidentiality.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {confidentiality.description}
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Global Office Network 3D Globe Section */}
      <GlobalOfficesSection initialData={globalOfficesData} />
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { prisma } from '@/lib/db/prisma';
import { getPageSEO, formatPageMetadata } from '@/lib/seo';
import { CustomHeadCode } from '@/components/seo/CustomHeadCode';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { FinalCtaSection } from '@/components/cta/FinalCtaSection';
import { RichTextContent } from '@/components/ui/RichTextContent';
import { defaultTeamPageSettings, TeamPageSettings, TeamMemberItem } from '@/types/team';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/team');
  return formatPageMetadata(seo, {
    title: 'Leadership & Multidisciplinary Team | Mighty Warner',
    description:
      'Meet the multidisciplinary leaders, engineers, data scientists, and strategists behind Mighty Warner.',
    canonical: '/team',
  });
}

async function getTeamPageData() {
  try {
    const [headerSection, dbMembers] = await Promise.all([
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'team',
            sectionKey: 'header',
          },
        },
      }),
      prisma.teamMember.findMany({
        where: { featured: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    const content = (headerSection?.content as any) || {};

    const settings: TeamPageSettings = {
      eyebrow: headerSection?.badge || content.eyebrow || defaultTeamPageSettings.eyebrow,
      title: headerSection?.title || defaultTeamPageSettings.title,
      subtitle: headerSection?.subtitle || content.subtitle || defaultTeamPageSettings.subtitle,
    };

    const members: TeamMemberItem[] = dbMembers.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      specialty: m.specialty,
      bio: m.bio,
      image: m.image,
      department: m.department,
      linkedin: m.linkedin,
      twitter: m.twitter,
      featured: m.featured,
      order: m.order,
    }));

    return { settings, members };
  } catch (error) {
    console.error('Error fetching team page data:', error);
    return {
      settings: defaultTeamPageSettings,
      members: [],
    };
  }
}

export default async function TeamPage() {
  const { settings, members } = await getTeamPageData();

  return (
    <div className="flex flex-col min-h-screen bg-[#DBDBDB] dark:bg-[#080C14] transition-colors duration-200">
      <CustomHeadCode path="/team" />

      {/* Main Team Showcase Section */}
      <section className="pt-28 sm:pt-36 pb-20 sm:pb-28">
        <SectionContainer>
          {/* Header Block */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            {settings.eyebrow && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-4">
                • <RichTextContent content={settings.eyebrow} inline />
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-4">
              <RichTextContent content={settings.title} inline />
            </h1>

            {settings.subtitle && (
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                <RichTextContent content={settings.subtitle} inline />
              </p>
            )}
          </div>

          {/* Members Grid */}
          {members.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-300 dark:border-white/10 rounded-3xl">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No team profiles found. Manage them in the Admin Panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/20 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Picture */}
                    <div className="relative h-64 w-full rounded-xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-900">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-xs">
                          No Photo
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 dark:from-[#0F1626] via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Specialty / Domain Title */}
                    <div className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold uppercase mb-1 tracking-wider">
                      <RichTextContent content={member.specialty} inline />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      <RichTextContent content={member.name} inline />
                    </h3>

                    {/* Designation / Role */}
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-3">
                      <RichTextContent content={member.role} inline />
                    </div>

                    {/* Description / Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <RichTextContent content={member.bio} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionContainer>
      </section>

      {/* Final Call to Action */}
      <FinalCtaSection />
    </div>
  );
}


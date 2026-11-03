import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { defaultContactSectionData, ContactSectionData } from '@/types/contactSection';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'contact',
          sectionKey: 'main',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultContactSectionData });
    }

    const content = (section.content as any) || {};

    const data: ContactSectionData = {
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching public Contact section:', error);
    return NextResponse.json({ success: true, data: defaultContactSectionData });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import {
  defaultContactSectionData,
  ContactSectionData,
  ContactTopicOption,
} from '@/types/contactSection';

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
    console.error('Error fetching Contact section data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Contact section data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const badge =
      typeof body.badge === 'string' ? body.badge.trim() : defaultContactSectionData.badge;
    const title =
      typeof body.title === 'string' ? body.title.trim() : defaultContactSectionData.title;
    const highlightedTitle =
      typeof body.highlightedTitle === 'string'
        ? body.highlightedTitle.trim()
        : defaultContactSectionData.highlightedTitle;
    const description =
      typeof body.description === 'string'
        ? body.description.trim()
        : defaultContactSectionData.description;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    // Sanitize and validate topics
    const rawTopics = Array.isArray(body.topics) ? body.topics : defaultContactSectionData.topics;
    const topics: ContactTopicOption[] = rawTopics.map((t: any, index: number) => ({
      id: String(t.id || `topic-${index + 1}`).trim().toLowerCase().replace(/\s+/g, '-'),
      label: String(t.label || `Topic ${index + 1}`).trim(),
      tagline: String(t.tagline || '').trim(),
      icon: String(t.icon || 'Sparkles').trim(),
      color: String(t.color || '#3B82F6').trim(),
    }));

    // Sanitize form settings
    const rawForm = body.form || {};
    const form = {
      step1Heading: String(rawForm.step1Heading || defaultContactSectionData.form.step1Heading).trim(),
      talentAudiencePrompt: String(
        rawForm.talentAudiencePrompt || defaultContactSectionData.form.talentAudiencePrompt
      ).trim(),
      talentEmployerLabel: String(
        rawForm.talentEmployerLabel || defaultContactSectionData.form.talentEmployerLabel
      ).trim(),
      talentCandidateLabel: String(
        rawForm.talentCandidateLabel || defaultContactSectionData.form.talentCandidateLabel
      ).trim(),
      step2Heading: String(rawForm.step2Heading || defaultContactSectionData.form.step2Heading).trim(),
      nameLabel: String(rawForm.nameLabel || defaultContactSectionData.form.nameLabel).trim(),
      namePlaceholder: String(
        rawForm.namePlaceholder || defaultContactSectionData.form.namePlaceholder
      ).trim(),
      emailLabel: String(rawForm.emailLabel || defaultContactSectionData.form.emailLabel).trim(),
      emailPlaceholder: String(
        rawForm.emailPlaceholder || defaultContactSectionData.form.emailPlaceholder
      ).trim(),
      companyLabel: String(
        rawForm.companyLabel || defaultContactSectionData.form.companyLabel
      ).trim(),
      companyPlaceholder: String(
        rawForm.companyPlaceholder || defaultContactSectionData.form.companyPlaceholder
      ).trim(),
      phoneLabel: String(rawForm.phoneLabel || defaultContactSectionData.form.phoneLabel).trim(),
      phonePlaceholder: String(
        rawForm.phonePlaceholder || defaultContactSectionData.form.phonePlaceholder
      ).trim(),
      step3Heading: String(rawForm.step3Heading || defaultContactSectionData.form.step3Heading).trim(),
      messageLabel: String(
        rawForm.messageLabel || defaultContactSectionData.form.messageLabel
      ).trim(),
      messagePlaceholder: String(
        rawForm.messagePlaceholder || defaultContactSectionData.form.messagePlaceholder
      ).trim(),
      ndaText: String(rawForm.ndaText || defaultContactSectionData.form.ndaText).trim(),
      submitButtonText: String(
        rawForm.submitButtonText || defaultContactSectionData.form.submitButtonText
      ).trim(),
      successBadge: String(
        rawForm.successBadge || defaultContactSectionData.form.successBadge
      ).trim(),
      successHeading: String(
        rawForm.successHeading || defaultContactSectionData.form.successHeading
      ).trim(),
      successMessage: String(
        rawForm.successMessage || defaultContactSectionData.form.successMessage
      ).trim(),
      returnHomeText: String(
        rawForm.returnHomeText || defaultContactSectionData.form.returnHomeText
      ).trim(),
      caseStudiesText: String(
        rawForm.caseStudiesText || defaultContactSectionData.form.caseStudiesText
      ).trim(),
    };

    // Sanitize direct channels
    const rawChannels = body.directChannels || {};
    const directChannels = {
      title: String(rawChannels.title || defaultContactSectionData.directChannels.title).trim(),
      emailLabel: String(
        rawChannels.emailLabel || defaultContactSectionData.directChannels.emailLabel
      ).trim(),
      email: String(rawChannels.email || defaultContactSectionData.directChannels.email).trim(),
      officesLabel: String(
        rawChannels.officesLabel || defaultContactSectionData.directChannels.officesLabel
      ).trim(),
      officesText: String(
        rawChannels.officesText || defaultContactSectionData.directChannels.officesText
      ).trim(),
      officesLink: String(
        rawChannels.officesLink || defaultContactSectionData.directChannels.officesLink || ''
      ).trim(),
      slaLabel: String(
        rawChannels.slaLabel || defaultContactSectionData.directChannels.slaLabel
      ).trim(),
      slaText: String(rawChannels.slaText || defaultContactSectionData.directChannels.slaText).trim(),
    };

    // Sanitize confidentiality
    const rawConf = body.confidentiality || {};
    const confidentiality = {
      title: String(rawConf.title || defaultContactSectionData.confidentiality.title).trim(),
      description: String(
        rawConf.description || defaultContactSectionData.confidentiality.description
      ).trim(),
    };

    const contentJson = {
      highlightedTitle,
      description,
      topics,
      form,
      directChannels,
      confidentiality,
    };

    const updatedSection = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'contact',
          sectionKey: 'main',
        },
      },
      update: {
        name: 'Contact Page Configuration',
        title,
        subtitle: description,
        badge,
        content: contentJson as any,
        isActive,
      },
      create: {
        pageSlug: 'contact',
        sectionKey: 'main',
        name: 'Contact Page Configuration',
        title,
        subtitle: description,
        badge,
        content: contentJson as any,
        isActive,
        order: 1,
      },
    });

    try {
      revalidatePath('/contact');
      revalidatePath('/admin/contact');
    } catch (revalidateError) {
      console.warn('Revalidation warning:', revalidateError);
    }

    const responseData: ContactSectionData = {
      badge: updatedSection.badge || badge,
      title: updatedSection.title || title,
      highlightedTitle,
      description,
      topics,
      form,
      directChannels,
      confidentiality,
      isActive: updatedSection.isActive,
    };

    return NextResponse.json({
      success: true,
      message: 'Contact section updated successfully',
      data: responseData,
    });
  } catch (error: any) {
    console.error('Error saving Contact section:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save Contact section data' },
      { status: 500 }
    );
  }
}

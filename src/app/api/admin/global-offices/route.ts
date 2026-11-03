import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { defaultGlobalOfficesData, GlobalOfficesData, OfficeLocation, GlobalNetworkStat } from '@/types/globalOffices';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const section = await prisma.siteSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'global_offices',
        },
      },
    });

    if (!section) {
      return NextResponse.json({ success: true, data: defaultGlobalOfficesData });
    }

    const content = (section.content as any) || {};

    const data: GlobalOfficesData = {
      badge: section.badge !== null && section.badge !== undefined ? section.badge : defaultGlobalOfficesData.badge,
      title: section.title !== null && section.title !== undefined ? section.title : defaultGlobalOfficesData.title,
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching Global Offices data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Global Offices data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const badge = typeof body.badge === 'string' ? body.badge : defaultGlobalOfficesData.badge;
    const title = typeof body.title === 'string' ? body.title : defaultGlobalOfficesData.title;
    const highlightedTitle =
      typeof body.highlightedTitle === 'string'
        ? body.highlightedTitle
        : defaultGlobalOfficesData.highlightedTitle;
    const description =
      typeof body.description === 'string' ? body.description : defaultGlobalOfficesData.description;
    const cycleBannerText =
      typeof body.cycleBannerText === 'string'
        ? body.cycleBannerText
        : defaultGlobalOfficesData.cycleBannerText;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;

    // Validate and sanitize stats
    const stats: GlobalNetworkStat[] = Array.isArray(body.stats)
      ? body.stats.map((s: any) => ({
          label: String(s.label || '').trim(),
          value: String(s.value || '').trim(),
          subtext: String(s.subtext || '').trim(),
        }))
      : defaultGlobalOfficesData.stats;

    // Validate and sanitize offices
    const rawOffices: OfficeLocation[] = Array.isArray(body.offices) ? body.offices : defaultGlobalOfficesData.offices;
    const offices: OfficeLocation[] = rawOffices.map((office: any, index: number) => {
      const lat = typeof office.coordinates?.lat === 'number' ? office.coordinates.lat : 0;
      const lng = typeof office.coordinates?.lng === 'number' ? office.coordinates.lng : 0;

      return {
        id: String(office.id || `office-${index + 1}`).toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        city: String(office.city || '').trim(),
        country: String(office.country || '').trim(),
        countryCode: String(office.countryCode || '').trim().toUpperCase(),
        flag: String(office.flag || '🌐').trim(),
        role: String(office.role || '').trim(),
        description: String(office.description || '').trim(),
        address: String(office.address || '').trim(),
        fullAddress: String(office.fullAddress || office.address || '').trim(),
        coordinates: { lat, lng },
        cobeLocation: [lat, lng],
        timezone: String(office.timezone || 'UTC').trim(),
        timezoneLabel: String(office.timezoneLabel || office.timezone || 'UTC').trim(),
        utcOffset: String(office.utcOffset || 'UTC+0').trim(),
        phoneNumbers: Array.isArray(office.phoneNumbers)
          ? office.phoneNumbers.map((p: any) => ({
              label: String(p.label || 'Desk').trim(),
              number: String(p.number || '').trim(),
              link: String(p.link || `tel:${(p.number || '').replace(/\s+/g, '')}`).trim(),
              isPrimary: Boolean(p.isPrimary),
              isTollFree: Boolean(p.isTollFree),
            }))
          : [],
        whatsapp: office.whatsapp?.number
          ? {
              number: String(office.whatsapp.number).trim(),
              link: String(
                office.whatsapp.link ||
                  `https://wa.me/${String(office.whatsapp.number).replace(/[^0-9]/g, '')}`
              ).trim(),
            }
          : undefined,
        email: String(office.email || '').trim(),
        specialties: Array.isArray(office.specialties)
          ? office.specialties.map((spec: any) => String(spec).trim()).filter(Boolean)
          : [],
        teamSizeBadge: String(office.teamSizeBadge || 'Regional Specialists').trim(),
        established: String(office.established || '').trim(),
      };
    });

    const content = {
      highlightedTitle,
      description,
      cycleBannerText,
      stats,
      offices,
    };

    const updated = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'global_offices',
        },
      },
      update: {
        name: 'Global Office Presence',
        badge,
        title,
        subtitle: description,
        content: content as any,
        isActive,
        order: 6,
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'global_offices',
        name: 'Global Office Presence',
        badge,
        title,
        subtitle: description,
        content: content as any,
        isActive,
        order: 6,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/contact');
    } catch {
      // Ignore during development
    }

    const responseData: GlobalOfficesData = {
      badge: updated.badge ?? badge,
      title: updated.title ?? title,
      highlightedTitle,
      description,
      cycleBannerText,
      stats,
      offices,
      isActive: updated.isActive,
    };

    return NextResponse.json({
      success: true,
      message: 'Global Office Presence updated and published successfully!',
      data: responseData,
    });
  } catch (error: any) {
    console.error('Error updating Global Offices data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update Global Offices data' },
      { status: 500 }
    );
  }
}

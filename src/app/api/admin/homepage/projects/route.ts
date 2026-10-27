import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { defaultHomepageWorkData, HomepageWorkData } from '@/types/homepageWork';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [section, allProjects] = await Promise.all([
      prisma.siteSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: 'home',
            sectionKey: 'work',
          },
        },
      }),
      prisma.project.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          client: true,
          industry: true,
          verticalId: true,
          verticalName: true,
          thumbnailImage: true,
          featured: true,
          order: true,
        },
        orderBy: { order: 'asc' },
      }),
    ]);

    let data: HomepageWorkData = { ...defaultHomepageWorkData };

    if (section) {
      const content = (section.content as any) || {};
      data = {
        badge: section.badge ?? defaultHomepageWorkData.badge,
        title: section.title ?? defaultHomepageWorkData.title,
        subtitle: section.subtitle ?? defaultHomepageWorkData.subtitle,
        ctaText: section.ctaText ?? defaultHomepageWorkData.ctaText,
        ctaLink: section.ctaLink ?? defaultHomepageWorkData.ctaLink,
        selectedProjectIds: Array.isArray(content.selectedProjectIds)
          ? content.selectedProjectIds
          : allProjects.slice(0, 6).map((p) => p.id),
        maxDisplay: typeof content.maxDisplay === 'number' ? content.maxDisplay : 6,
        isActive: section.isActive ?? true,
      };
    } else {
      // Default select the first 6 projects
      data.selectedProjectIds = allProjects.slice(0, 6).map((p) => p.id);
    }

    return NextResponse.json({
      success: true,
      data,
      allProjects,
    });
  } catch (error: any) {
    console.error('Error fetching admin homepage projects config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch homepage projects data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: HomepageWorkData = await req.json();

    const badge = body.badge !== undefined ? body.badge : defaultHomepageWorkData.badge;
    const title = body.title !== undefined ? body.title : defaultHomepageWorkData.title;
    const subtitle = body.subtitle !== undefined ? body.subtitle : defaultHomepageWorkData.subtitle;
    const ctaText = body.ctaText !== undefined ? body.ctaText : defaultHomepageWorkData.ctaText;
    const ctaLink = body.ctaLink !== undefined ? body.ctaLink : defaultHomepageWorkData.ctaLink;
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;
    const selectedProjectIds = Array.isArray(body.selectedProjectIds) ? body.selectedProjectIds : [];
    const maxDisplay = typeof body.maxDisplay === 'number' ? body.maxDisplay : 6;

    const content = {
      selectedProjectIds,
      maxDisplay,
    };

    const section = await prisma.siteSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: 'home',
          sectionKey: 'work',
        },
      },
      update: {
        name: 'Homepage Work / Featured Projects',
        title,
        subtitle,
        badge,
        ctaText,
        ctaLink,
        content,
        isActive,
      },
      create: {
        pageSlug: 'home',
        sectionKey: 'work',
        name: 'Homepage Work / Featured Projects',
        title,
        subtitle,
        badge,
        ctaText,
        ctaLink,
        content,
        isActive,
        order: 4,
      },
    });

    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath('/portfolio');

    return NextResponse.json({
      success: true,
      data: {
        badge: section.badge,
        title: section.title,
        subtitle: section.subtitle,
        ctaText: section.ctaText,
        ctaLink: section.ctaLink,
        selectedProjectIds,
        maxDisplay,
        isActive: section.isActive,
      },
    });
  } catch (error: any) {
    console.error('Error updating admin homepage projects config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update homepage projects config' },
      { status: 500 }
    );
  }
}

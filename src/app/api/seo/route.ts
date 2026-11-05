import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { DEFAULT_PAGE_SEO_DATA, normalizeRoute, formatRouteName } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/**
 * Verify whether the incoming request is from an authorized admin
 */
async function isAuthorizedAdmin(req: NextRequest): Promise<boolean> {
  try {
    // 1. Check Bearer Authorization Header
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const session = await verifyAdminToken(token);
      if (session) return true;
    }

    // 2. Check Admin Session Cookie
    const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (cookieToken) {
      const session = await verifyAdminToken(cookieToken);
      if (session) return true;
    }

    // 3. Fallback for local development if not strictly enforced
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Helper to sanitize keywords into a clean array of strings
 */
function sanitizeKeywords(raw: any): string[] {
  if (Array.isArray(raw)) {
    return raw.map((k) => String(k).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * GET /api/seo
 * - If ?route=... is provided, returns that specific route's SEO record.
 * - Otherwise, ensures all default pages are seeded, and returns all records.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const routeParam = searchParams.get('route');

    if (routeParam) {
      const normalized = normalizeRoute(routeParam);
      const page = await prisma.pageSeo.findUnique({
        where: { pageRoute: normalized },
      });

      if (!page) {
        // Return matching default if exists
        const defaultPage = DEFAULT_PAGE_SEO_DATA.find((d) => d.pageRoute === normalized);
        if (defaultPage) {
          return NextResponse.json({
            success: true,
            data: defaultPage,
            page: defaultPage,
          });
        }
        return NextResponse.json(
          { success: false, error: `Page with route '${normalized}' not found.` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: page,
        page,
      });
    }

    // Auto-seed missing defaults into PostgreSQL if necessary
    try {
      const existingPages = await prisma.pageSeo.findMany({
        select: { pageRoute: true },
      });
      const existingRoutes = new Set(existingPages.map((p) => p.pageRoute));

      const missingDefaults = DEFAULT_PAGE_SEO_DATA.filter(
        (def) => !existingRoutes.has(def.pageRoute)
      );

      if (missingDefaults.length > 0) {
        for (const def of missingDefaults) {
          try {
            await prisma.pageSeo.create({
              data: {
                pageRoute: def.pageRoute,
                pageName: def.pageName,
                metaTitle: def.metaTitle,
                metaDescription: def.metaDescription,
                metaKeywords: def.metaKeywords,
                metaImage: def.metaImage,
                canonicalUrl: def.canonicalUrl,
                customHeadScripts: def.customHeadScripts,
              },
            });
          } catch (seedErr) {
            console.warn(`[API /api/seo] Seed skip for ${def.pageRoute}:`, seedErr);
          }
        }
      }
    } catch (seedError) {
      console.warn('[API /api/seo] Auto-seed check encountered error:', seedError);
    }

    // Return all pages sorted by createdAt ASC
    const pages = await prisma.pageSeo.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: pages,
      pages,
    });
  } catch (error: any) {
    console.error('[API /api/seo GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch SEO pages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seo
 * Creates a new Page SEO record.
 */
export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthorizedAdmin(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawRoute = body.pageRoute || body.page_route;
    const rawName = body.pageName || body.page_name;

    if (!rawRoute || typeof rawRoute !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Page route is required (e.g. /about, /pricing).' },
        { status: 400 }
      );
    }

    const pageRoute = normalizeRoute(rawRoute);
    const pageName = (rawName && String(rawName).trim()) || formatRouteName(pageRoute);

    // Uniqueness check
    const existing = await prisma.pageSeo.findUnique({
      where: { pageRoute },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `A page SEO record for route "${pageRoute}" already exists.` },
        { status: 400 }
      );
    }

    const metaTitle = (body.metaTitle || body.meta_title || '').trim();
    const metaDescription = (body.metaDescription || body.meta_description || '').trim();
    const metaKeywords = sanitizeKeywords(body.metaKeywords || body.meta_keywords);
    const metaImage = (body.metaImage || body.meta_image || '/og.jpg').trim();
    const canonicalUrl = (body.canonicalUrl || body.canonical_url || '').trim();
    const customHeadScripts = (body.customHeadScripts || body.custom_head_scripts || '').trim();

    const created = await prisma.pageSeo.create({
      data: {
        pageRoute,
        pageName,
        metaTitle,
        metaDescription,
        metaKeywords,
        metaImage: metaImage || '/og.jpg',
        canonicalUrl,
        customHeadScripts,
      },
    });

    try {
      revalidatePath(pageRoute);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: created,
        page: created,
        message: 'Page SEO created successfully.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/seo POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create page SEO.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/seo
 * Updates or upserts an existing Page SEO record.
 */
export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isAuthorizedAdmin(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawRoute = body.pageRoute || body.page_route;

    if (!rawRoute || typeof rawRoute !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Page route is required for update.' },
        { status: 400 }
      );
    }

    const pageRoute = normalizeRoute(rawRoute);
    const pageName = (body.pageName || body.page_name || '').trim() || formatRouteName(pageRoute);
    const metaTitle = (body.metaTitle || body.meta_title || '').trim();
    const metaDescription = (body.metaDescription || body.meta_description || '').trim();
    const metaKeywords = sanitizeKeywords(body.metaKeywords || body.meta_keywords);
    const metaImage = (body.metaImage || body.meta_image || '/og.jpg').trim();
    const canonicalUrl = (body.canonicalUrl || body.canonical_url || '').trim();
    const customHeadScripts = (body.customHeadScripts || body.custom_head_scripts || '').trim();

    const updated = await prisma.pageSeo.upsert({
      where: { pageRoute },
      update: {
        pageName,
        metaTitle,
        metaDescription,
        metaKeywords,
        metaImage: metaImage || '/og.jpg',
        canonicalUrl,
        customHeadScripts,
      },
      create: {
        pageRoute,
        pageName,
        metaTitle,
        metaDescription,
        metaKeywords,
        metaImage: metaImage || '/og.jpg',
        canonicalUrl,
        customHeadScripts,
      },
    });

    try {
      revalidatePath(pageRoute);
    } catch {}

    return NextResponse.json({
      success: true,
      data: updated,
      page: updated,
      message: 'Page SEO updated successfully.',
    });
  } catch (error: any) {
    console.error('[API /api/seo PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update page SEO.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/seo?route=...
 * Deletes a Page SEO record by route or ID.
 */
export async function DELETE(req: NextRequest) {
  try {
    const isAuth = await isAuthorizedAdmin(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let route = searchParams.get('route');
    const id = searchParams.get('id');

    if (!route && !id) {
      // Check JSON body fallback
      try {
        const body = await req.json();
        route = body.pageRoute || body.page_route || body.route;
      } catch {}
    }

    if (!route && !id) {
      return NextResponse.json(
        { success: false, error: 'Route parameter or ID is required for deletion.' },
        { status: 400 }
      );
    }

    if (id) {
      await prisma.pageSeo.delete({
        where: { id },
      });
    } else if (route) {
      const normalized = normalizeRoute(route);
      await prisma.pageSeo.delete({
        where: { pageRoute: normalized },
      });
      try {
        revalidatePath(normalized);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: 'Page SEO record deleted successfully.',
    });
  } catch (error: any) {
    console.error('[API /api/seo DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete page SEO.' },
      { status: 500 }
    );
  }
}


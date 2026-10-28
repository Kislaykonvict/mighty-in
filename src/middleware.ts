import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Handle /admin/login page
  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
      const session = await verifyAdminToken(token);
      if (session) {
        // Already authenticated, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin/hero', request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Redirect obsolete user management & profile sections directly to admin dashboard
  if (
    pathname === '/admin/profile' ||
    pathname.startsWith('/admin/profile/') ||
    pathname === '/admin/users' ||
    pathname.startsWith('/admin/users/')
  ) {
    return NextResponse.redirect(new URL('/admin/hero', request.url));
  }

  // 3. Protect all other /admin/* pages
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifyAdminToken(token);
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname + search);
      // Clear invalid cookie
      const res = NextResponse.redirect(loginUrl);
      res.cookies.set(ADMIN_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return res;
    }

    return NextResponse.next();
  }

  // 3. Protect /api/admin/* endpoints
  if (pathname.startsWith('/api/admin')) {
    const token =
      request.cookies.get(ADMIN_COOKIE_NAME)?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to access admin APIs' },
        { status: 401 }
      );
    }

    const session = await verifyAdminToken(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired session' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

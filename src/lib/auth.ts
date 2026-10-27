import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'mw_admin_token';

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'mighty-warner-enterprise-secret-key-2026-secure';

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AdminJWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  [key: string]: unknown;
}

/**
 * Sign a new JWT token for an authenticated Admin user (valid for 1 day / 24 hours)
 */
export async function signAdminToken(payload: AdminJWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode an Admin JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

/**
 * Helper to get the current authenticated admin session from request cookies (Server Components / Route Handlers)
 */
export async function getAdminSession(): Promise<AdminJWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 24 * 60 * 60, // 1 day in seconds (auto-logout after 24 hours)
};

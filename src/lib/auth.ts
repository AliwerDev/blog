import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'a-very-long-fallback-secret-key-change-it-in-env';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
export const COOKIE_NAME = 'admin_session';

export interface AdminSession {
  email: string;
  role: 'admin';
}

// Generate a JWT for admin session
export async function createSession(email: string): Promise<string> {
  return await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Session lasts 7 days
    .sign(SECRET_KEY);
}

// Verify a session JWT
export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

// Get the current session user from incoming HTTP request
export async function getSessionUser(req: NextRequest): Promise<AdminSession | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}

// Validate raw login credentials
export function validateCredentials(email: string, pass: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@blog.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return email === adminEmail && pass === adminPassword;
}

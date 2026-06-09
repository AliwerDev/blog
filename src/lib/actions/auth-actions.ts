'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession, validateCredentials, COOKIE_NAME } from '@/lib/auth';

export interface ActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Handles admin login authentication
 */
export async function loginAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, error: 'Email yoki parol kiritilmadi' };
    }

    if (!validateCredentials(email, password)) {
      return { success: false, error: 'Email yoki parol xato' };
    }

    const token = await createSession(email);
    const cookieStore = await cookies();

    cookieStore.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error) {
    console.error('Login Server Action error:', error);
    return { success: false, error: 'Tizim xatosi yuz berdi' };
  }
}

/**
 * Handles admin logout
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  
  // Clear the cookie
  cookieStore.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  redirect('/');
}

import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession, COOKIE_NAME } from '@/lib/auth';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAdmin = token ? (await verifySession(token)) !== null : false;

  if (isAdmin) {
    redirect('/');
  }

  return <LoginClient />;
}

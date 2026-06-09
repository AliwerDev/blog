import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession, COOKIE_NAME } from '@/lib/auth';
import { getPosts } from '@/lib/db';
import NewPostClient from './NewPostClient';

interface PageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function NewPostPage({ searchParams }: PageProps) {
  // 1. Auth check server-side
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAdmin = token ? (await verifySession(token)) !== null : false;

  if (!isAdmin) {
    redirect('/login');
  }

  // 2. Check if in edit mode and fetch post
  const { edit } = await searchParams;
  let post = undefined;

  if (edit) {
    const posts = await getPosts();
    post = posts.find((p) => p.id === edit);
    if (!post) {
      redirect('/');
    }
  }

  return <NewPostClient editPost={post} />;
}

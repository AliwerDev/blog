import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { getPosts } from '@/lib/db';
import { verifySession, COOKIE_NAME } from '@/lib/auth';
import PostDetailClient from './PostDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return {
      title: 'Post topilmadi',
    };
  }

  const title = post.title;
  const description = post.previewText || 'Batafsil blog maqolasi';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  
  // 1. Fetch posts and find the target post
  const posts = await getPosts();
  const post = posts.find((p) => p.id === id);
  
  if (!post) {
    notFound();
  }

  // 2. Determine admin authentication status server-side
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAdmin = token ? (await verifySession(token)) !== null : false;

  return <PostDetailClient post={post} isAdmin={isAdmin} />;
}

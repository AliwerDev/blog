'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PostDetail from '@/components/PostDetail';
import type { Post } from '@/lib/db';

interface PostDetailWrapperProps {
  post: Post;
  isAdmin: boolean;
}

export default function PostDetailWrapper({ post, isAdmin }: PostDetailWrapperProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen px-4 pt-2 md:pt-4 pb-8 md:pb-16">
      {/* Dynamic ambient gradient glow */}
      <div className="glow-bg" />

      <main className="relative z-10 py-6">
        <PostDetail
          post={post}
          isAdmin={isAdmin}
          onBack={() => router.push('/')}
          onEdit={(p) => router.push(`/new-post?edit=${p.id}`)}
          onDeleteSuccess={() => router.push('/')}
        />
      </main>
    </div>
  );
}

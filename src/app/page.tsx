'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import BlogLayout from '@/components/BlogLayout';
import PostDetail from '@/components/PostDetail';
import { Loader2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  previewText: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check admin session status
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth');
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.authenticated);
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Defer API calls to run asynchronously after initial mount completes
      await new Promise((resolve) => setTimeout(resolve, 0));
      fetchPosts();
      checkAuth();
    };
    init();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditClick = (post: Post) => {
    router.push(`/new-post?edit=${post.id}`);
  };

  const handleNewPostClick = () => {
    router.push('/new-post');
  };

  return (
    <div className="relative min-h-screen px-4 py-8 md:py-16">
      {/* Dynamic ambient gradient glow */}
      <div className="glow-bg" />

      <main className="relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
            <p className="text-zinc-500 text-sm mt-4">Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="w-full">
            <AnimatePresence mode="wait">
              {!selectedPost ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BlogLayout
                    posts={posts}
                    selectedTopic={selectedTopic}
                    onSelectTopic={setSelectedTopic}
                    onSelectPost={setSelectedPost}
                    isAdmin={isAdmin}
                    onLogoutClick={handleLogout}
                    onNewPostClick={handleNewPostClick}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostDetail
                    post={selectedPost}
                    isAdmin={isAdmin}
                    onBack={() => setSelectedPost(null)}
                    onEdit={handleEditClick}
                    onDeleteSuccess={() => {
                      setSelectedPost(null);
                      fetchPosts();
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

    </div>
  );
}

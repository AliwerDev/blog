'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySession, COOKIE_NAME } from '@/lib/auth';
import { createPost, updatePost, deletePost } from '@/lib/db';
import { extractPreview } from '@/lib/utils';
import { Post } from '@/types';

export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Helper to assert admin authorization in actions
 */
async function assertAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const session = await verifySession(token);
  return session !== null;
}

/**
 * Creates a new blog post
 */
export async function createPostAction(data: {
  title: string;
  content: string;
  tags: string[];
}): Promise<ActionResponse<Post>> {
  try {
    const isAdmin = await assertAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Ruxsat berilmagan. Iltimos, tizimga kiring.' };
    }

    const { title, content, tags } = data;
    if (!title || !content || !tags || tags.length === 0) {
      return { success: false, error: 'Barcha majburiy maydonlarni to\'ldiring.' };
    }

    const previewText = extractPreview(content);
    const newPost = await createPost({
      title,
      content,
      previewText,
      tags,
    });

    revalidatePath('/');
    return { success: true, data: newPost };
  } catch (error: unknown) {
    console.error('Create post Server Action error:', error);
    return { success: false, error: 'Post yaratishda xatolik yuz berdi' };
  }
}

/**
 * Updates an existing blog post
 */
export async function updatePostAction(
  id: string,
  data: {
    title: string;
    content: string;
    tags: string[];
  }
): Promise<ActionResponse<Post>> {
  try {
    const isAdmin = await assertAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Ruxsat berilmagan. Iltimos, tizimga kiring.' };
    }

    const { title, content, tags } = data;
    if (!title || !content || !tags || tags.length === 0) {
      return { success: false, error: 'Barcha majburiy maydonlarni to\'ldiring.' };
    }

    const previewText = extractPreview(content);
    const updatedPost = await updatePost(id, {
      title,
      content,
      previewText,
      tags,
    });

    if (!updatedPost) {
      return { success: false, error: 'Tahrirlanayotgan post topilmadi.' };
    }

    revalidatePath('/');
    revalidatePath(`/post/${id}`);
    return { success: true, data: updatedPost };
  } catch (error: unknown) {
    console.error('Update post Server Action error:', error);
    return { success: false, error: 'Postni yangilashda xatolik yuz berdi' };
  }
}

/**
 * Deletes a blog post
 */
export async function deletePostAction(id: string): Promise<ActionResponse> {
  try {
    const isAdmin = await assertAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Ruxsat berilmagan. Iltimos, tizimga kiring.' };
    }

    const success = await deletePost(id);
    if (!success) {
      return { success: false, error: 'Post topilmadi.' };
    }

    revalidatePath('/');
    revalidatePath(`/post/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Delete post Server Action error:', error);
    return { success: false, error: 'Postni o\'chirishda xatolik yuz berdi' };
  }
}

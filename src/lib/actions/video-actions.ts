'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifySession, COOKIE_NAME } from '@/lib/auth';
import { createVideo, deleteVideo } from '@/lib/db';
import { getYoutubeId } from '@/lib/utils';
import { Video } from '@/types';

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
 * Creates a new video entry
 */
export async function createVideoAction(data: {
  youtubeUrl: string;
  category?: string;
}): Promise<ActionResponse<Video>> {
  try {
    const isAdmin = await assertAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Ruxsat berilmagan. Iltimos, tizimga kiring.' };
    }

    const { youtubeUrl, category } = data;
    if (!youtubeUrl) {
      return { success: false, error: 'YouTube havola kiritilishi shart.' };
    }

    const videoId = getYoutubeId(youtubeUrl);
    if (!videoId) {
      return { success: false, error: 'Noto\'g\'ri YouTube havolasi.' };
    }

    const newVideo = await createVideo({
      youtubeUrl,
      category: category || 'Boshqa',
    });

    revalidatePath('/videos');
    return { success: true, data: newVideo };
  } catch (error: unknown) {
    console.error('Create video Server Action error:', error);
    return { success: false, error: 'Videoni qo\'shishda xatolik yuz berdi' };
  }
}

/**
 * Deletes a video entry
 */
export async function deleteVideoAction(id: string): Promise<ActionResponse> {
  try {
    const isAdmin = await assertAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Ruxsat berilmagan. Iltimos, tizimga kiring.' };
    }

    const success = await deleteVideo(id);
    if (!success) {
      return { success: false, error: 'Video topilmadi.' };
    }

    revalidatePath('/videos');
    return { success: true };
  } catch (error: unknown) {
    console.error('Delete video Server Action error:', error);
    return { success: false, error: 'Videoni o\'chirishda xatolik yuz berdi' };
  }
}

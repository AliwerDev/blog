import fs from 'fs/promises';
import path from 'path';

import { Post, Video, DatabaseSchema } from '@/types';
export type { Post, Video, DatabaseSchema };


const DB_PATH = path.join(process.cwd(), 'db.json');

// Check if Vercel KV environment variables are available
const isKvEnabled = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Fetch posts from Vercel KV / Upstash Redis
async function fetchFromKv(): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.KV_REST_API_URL}/get/posts`, {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.result) return [];
    
    // Parse result. If it's a string, it was double-stringified, so parse again.
    let parsed = JSON.parse(data.result);
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return (Array.isArray(parsed) ? parsed : []) as Post[];
  } catch (error) {
    console.error('Vercel KV o\'qishda xatolik:', error);
    return [];
  }
}

// Save posts to Vercel KV / Upstash Redis
async function saveToKv(posts: Post[]): Promise<void> {
  try {
    const res = await fetch(`${process.env.KV_REST_API_URL}/set/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(posts), // Single stringify
    });
    if (!res.ok) {
      throw new Error('KV yozishda xatolik yuz berdi');
    }
  } catch (error) {
    console.error('Vercel KV saqlashda xatolik:', error);
    throw error;
  }
}

// Helper to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Read database and return post list
export async function getPosts(): Promise<Post[]> {
  if (isKvEnabled) {
    return await fetchFromKv();
  }

  try {
    if (!(await fileExists(DB_PATH))) {
      await initDb();
      return [];
    }
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data) as DatabaseSchema;
    return parsed.posts || [];
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

// Initialize empty DB
async function initDb(): Promise<void> {
  const initialData: DatabaseSchema = { posts: [] };
  await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
}

// Save all posts to DB
export async function savePosts(posts: Post[]): Promise<void> {
  if (isKvEnabled) {
    await saveToKv(posts);
    return;
  }

  if (process.env.VERCEL === '1') {
    throw new Error(
      "Vercel KV o'rnatilmagan yoki ulanmagan. Iltimos, Vercel Dashboard orqali loyihangizga KV (Redis) ma'lumotlar omborini yarating va ulang."
    );
  }

  try {
    let videos: Video[] = [];
    if (await fileExists(DB_PATH)) {
      const fileData = await fs.readFile(DB_PATH, 'utf-8');
      const parsed = JSON.parse(fileData) as DatabaseSchema;
      videos = parsed.videos || [];
    }
    const data: DatabaseSchema = { posts, videos };
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Failed to save data');
  }
}

// Add a single post
export async function createPost(
  postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Post> {
  const posts = await getPosts();
  const now = new Date().toISOString();
  
  const newPost: Post = {
    ...postData,
    id: Math.random().toString(36).substring(2, 11), // Simple alphanumeric ID
    createdAt: now,
    updatedAt: now,
  };
  
  posts.unshift(newPost); // Add to beginning (latest first)
  await savePosts(posts);
  return newPost;
}

// Edit a post
export async function updatePost(
  id: string,
  postData: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Post | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  
  const updatedPost: Post = {
    ...posts[index],
    ...postData,
    updatedAt: new Date().toISOString(),
  };
  
  posts[index] = updatedPost;
  await savePosts(posts);
  return updatedPost;
}

// Delete a post
export async function deletePost(id: string): Promise<boolean> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  
  await savePosts(filtered);
  return true;
}

// Fetch videos from Vercel KV / Upstash Redis
async function fetchVideosFromKv(): Promise<Video[]> {
  try {
    const res = await fetch(`${process.env.KV_REST_API_URL}/get/videos`, {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.result) return [];
    
    let parsed = JSON.parse(data.result);
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return (Array.isArray(parsed) ? parsed : []) as Video[];
  } catch (error) {
    console.error('Vercel KV o\'qishda xatolik (videolar):', error);
    return [];
  }
}

// Save videos to Vercel KV / Upstash Redis
async function saveVideosToKv(videos: Video[]): Promise<void> {
  try {
    const res = await fetch(`${process.env.KV_REST_API_URL}/set/videos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videos),
    });
    if (!res.ok) {
      throw new Error('KV yozishda xatolik yuz berdi (videolar)');
    }
  } catch (error) {
    console.error('Vercel KV saqlashda xatolik (videolar):', error);
    throw error;
  }
}

// Read database and return video list
export async function getVideos(): Promise<Video[]> {
  if (isKvEnabled) {
    return await fetchVideosFromKv();
  }

  try {
    if (!(await fileExists(DB_PATH))) {
      await initDb();
      return [];
    }
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data) as DatabaseSchema;
    return parsed.videos || [];
  } catch (error) {
    console.error('Error reading videos database:', error);
    return [];
  }
}

// Save all videos to DB
export async function saveVideos(videos: Video[]): Promise<void> {
  if (isKvEnabled) {
    await saveVideosToKv(videos);
    return;
  }

  if (process.env.VERCEL === '1') {
    throw new Error(
      "Vercel KV o'rnatilmagan yoki ulanmagan. Iltimos, Vercel Dashboard orqali loyihangizga KV (Redis) ma'lumotlar omborini yarating va ulang."
    );
  }

  try {
    let posts: Post[] = [];
    if (await fileExists(DB_PATH)) {
      const fileData = await fs.readFile(DB_PATH, 'utf-8');
      const parsed = JSON.parse(fileData) as DatabaseSchema;
      posts = parsed.posts || [];
    }
    const data: DatabaseSchema = { posts, videos };
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database (videos):', error);
    throw new Error('Failed to save videos');
  }
}

// Add a single video
export async function createVideo(
  videoData: Omit<Video, 'id' | 'createdAt'>
): Promise<Video> {
  const videos = await getVideos();
  const now = new Date().toISOString();
  
  const newVideo: Video = {
    ...videoData,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: now,
  };
  
  videos.unshift(newVideo); // Add to beginning (latest first)
  await saveVideos(videos);
  return newVideo;
}

// Delete a video
export async function deleteVideo(id: string): Promise<boolean> {
  const videos = await getVideos();
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) return false;
  
  await saveVideos(filtered);
  return true;
}

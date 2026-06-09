import fs from 'fs/promises';
import path from 'path';

export interface Post {
  id: string;
  title: string;
  content: string;
  previewText: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  posts: Post[];
}

const DB_PATH = path.join(process.cwd(), 'db.json');

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
  try {
    const data: DatabaseSchema = { posts };
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

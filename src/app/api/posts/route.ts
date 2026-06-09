import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/db';

// GET all posts
export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error: unknown) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Postlarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

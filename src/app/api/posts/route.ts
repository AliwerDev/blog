import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// Helper to strip HTML tags and generate a preview snippet
function extractPreview(html: string): string {
  const text = html.replace(/<[^>]*>/g, ' ');
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 150) return cleaned;
  return cleaned.substring(0, 150) + '...';
}

// GET all posts
export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Postlarni yuklashda xatolik' }, { status: 500 });
  }
}

// POST a new post (Admin only)
export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 });
    }

    // 2. Validate request
    const body = await req.json();
    const { title, content, topicId } = body;

    if (!title || !content || !topicId) {
      return NextResponse.json({ error: 'Barcha maydonlarni to\'ldiring' }, { status: 400 });
    }

    // 3. Generate preview and create post
    const previewText = extractPreview(content);
    const newPost = await createPost({
      title,
      content,
      previewText,
      topicId,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({
      error: 'Post yaratishda xatolik',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

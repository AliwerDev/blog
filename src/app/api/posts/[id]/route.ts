import { NextRequest, NextResponse } from 'next/server';
import { updatePost, deletePost, Post } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// Helper to strip HTML tags and generate a preview snippet
function extractPreview(html: string): string {
  const text = html.replace(/<[^>]*>/g, ' ');
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 150) return cleaned;
  return cleaned.substring(0, 150) + '...';
}

// PUT /api/posts/[id] (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Auth check
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 });
    }

    // 2. Validate update data
    const body = await req.json();
    const { title, content, topicId } = body;

    const updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) {
      updates.content = content;
      updates.previewText = extractPreview(content);
    }
    if (topicId !== undefined) updates.topicId = topicId;

    // 3. Update database
    const updated = await updatePost(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Postni tahrirlashda xatolik' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Auth check
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 401 });
    }

    // 2. Delete from database
    const success = await deletePost(id);
    if (!success) {
      return NextResponse.json({ error: 'Post topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Postni o\'chirishda xatolik' }, { status: 500 });
  }
}

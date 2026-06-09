'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';
import { 
  Bold, Italic, Quote, Code, Undo, Redo, 
  Loader2, X, Heading2, Heading3, List, ListOrdered
} from 'lucide-react';
import topicsData from '@/config/topics.json';

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  post?: {
    id: string;
    title: string;
    content: string;
    topicId: string;
  } | null;
}

export default function PostEditor({ isOpen, onClose, onSave, post }: PostEditorProps) {
  // Filter out the "all" filter tab from eligible topics for a post
  const allowedTopics = topicsData.filter(t => t.id !== 'all');

  const [title, setTitle] = useState(post ? post.title : '');
  const [topicId, setTopicId] = useState(post ? post.topicId : (allowedTopics[0]?.id || ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Bu yerga yozing...',
      }),
    ],
    content: '',
  });

  // Load post content if editing
  useEffect(() => {
    if (post) {
      editor?.commands.setContent(post.content);
    } else {
      editor?.commands.setContent('');
    }
  }, [post, editor]);

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (!title.trim()) {
      setError('Sarlahqani kiriting');
      return;
    }
    if (!topicId) {
      setError('Mavzuni tanlang');
      return;
    }
    const htmlContent = editor?.getHTML();
    if (!htmlContent || htmlContent === '<p></p>') {
      setError('Maqola matnini yozing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = post ? `/api/posts/${post.id}` : '/api/posts';
      const method = post ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: htmlContent,
          topicId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Saqlashda xatolik yuz berdi');
      }

      onSave();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl glass p-6 shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
          <h2 className="text-xl font-bold font-display text-white">
            {post ? 'Postni tahrirlash' : 'Yangi post yozish'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Title & Topic selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Sarlavha
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post sarlavhasini yozing..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-2.5 px-4 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-display text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Mavzu
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-2.5 px-4 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                {allowedTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tiptap Rich Text Editor */}
          <div className="flex flex-col border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
            {/* Toolbar */}
            {editor && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-zinc-900/60 border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('bold') ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Bold"
                >
                  <Bold className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('italic') ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Italic"
                >
                  <Italic className="h-4.5 w-4.5" />
                </button>
                <div className="h-4 w-px bg-zinc-800 mx-1" />
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('heading', { level: 2 }) ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Heading 2"
                >
                  <Heading2 className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('heading', { level: 3 }) ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Heading 3"
                >
                  <Heading3 className="h-4.5 w-4.5" />
                </button>
                <div className="h-4 w-px bg-zinc-800 mx-1" />
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('bulletList') ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Bullet List"
                >
                  <List className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('orderedList') ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Ordered List"
                >
                  <ListOrdered className="h-4.5 w-4.5" />
                </button>
                <div className="h-4 w-px bg-zinc-800 mx-1" />
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('blockquote') ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Blockquote"
                >
                  <Quote className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={`p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer ${
                    editor.isActive('codeBlock') ? 'bg-zinc-800 text-purple-400!' : ''
                  }`}
                  title="Code Block"
                >
                  <Code className="h-4.5 w-4.5" />
                </button>
                <div className="h-4 w-px bg-zinc-800 mx-1 flex-1" />
                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Undo"
                >
                  <Undo className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Redo"
                >
                  <Redo className="h-4.5 w-4.5" />
                </button>
              </div>
            )}

            {/* Editor Area */}
            <div className="p-4 prose max-w-none text-white overflow-y-auto max-h-[350px]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80 mt-4">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {post ? 'Yangilash' : 'Chop etish'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

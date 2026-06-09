'use client';

import React, { useState } from 'react';
import { Play, Trash2, Calendar } from 'lucide-react';
import { Video } from '@/types';
import { getYoutubeId, formatDate } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  isAdmin: boolean;
  onDelete: (id: string) => Promise<void>;
  onPlay: (videoId: string, title: string) => void;
}

export default function VideoCard({ video, isAdmin, onDelete, onPlay }: VideoCardProps) {
  const videoId = getYoutubeId(video.youtubeUrl);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Try maxresdefault, fallback to hqdefault on error
  const [thumbnailUrl, setThumbnailUrl] = useState(
    videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
  );

  const handleThumbnailError = () => {
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`"${video.title}" videosini o'chirishni xohlaysizmi?`)) {
      setIsDeleting(true);
      try {
        await onDelete(video.id);
      } catch (err) {
        console.error('Video o\'chirishda xato:', err);
        alert('Videoni o\'chirishda xato yuz berdi.');
        setIsDeleting(false);
      }
    }
  };

  const handlePlay = () => {
    if (videoId) {
      onPlay(videoId, video.title);
    } else {
      alert('Video ID topilmadi.');
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl glass glass-hover h-full">
      {/* Thumbnail Area */}
      <div 
        onClick={handlePlay}
        className="relative aspect-video w-full overflow-hidden bg-zinc-950 cursor-pointer"
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            onError={handleThumbnailError}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600 bg-zinc-900/60">
            Kadr mavjud emas
          </div>
        )}
        
        {/* Ambient Overlay dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-all group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:shadow-[var(--accent)]/30 group-hover:shadow-lg">
            <Play className="h-5.5 w-5.5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Category badge over thumbnail */}
        {video.category && (
          <span className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold tracking-wide text-[var(--accent)] uppercase border border-white/5">
            {video.category}
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        {/* Metadata info */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={video.createdAt}>
            {formatDate(video.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        </div>

        {/* Title */}
        <h3 
          onClick={handlePlay}
          className="text-base font-bold text-white line-clamp-2 hover:text-[var(--accent)] transition-colors cursor-pointer mb-2 leading-snug"
        >
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            {video.description}
          </p>
        )}

        {/* Bottom Actions Row (e.g., delete) */}
        {isAdmin && (
          <div className="mt-auto pt-3 border-t border-zinc-800/60 flex justify-end">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 cursor-pointer"
              title="Videoni o'chirish"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

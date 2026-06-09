"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Play, X, Video as VideoIcon } from "lucide-react";
import { Video } from "@/types";
import VideoCard from "./VideoCard";
import AddVideoModal from "./AddVideoModal";
import { deleteVideoAction } from "@/lib/actions/video-actions";

interface VideoListClientProps {
  initialVideos: Video[];
  isAdmin: boolean;
}

export default function VideoListClient({
  initialVideos,
  isAdmin,
}: VideoListClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Extract all categories dynamically and normalize
  const allCategories = useMemo(() => {
    const catsSet = new Set<string>();
    initialVideos.forEach((video) => {
      if (video.category) {
        catsSet.add(video.category.trim());
      }
    });
    return Array.from(catsSet);
  }, [initialVideos]);

  // Filter videos based on category tab
  const filteredVideos = useMemo(() => {
    return initialVideos.filter((video) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (video.category &&
          video.category.trim().toLowerCase() ===
            selectedCategory.toLowerCase());

      return matchesCategory;
    });
  }, [initialVideos, selectedCategory]);

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteVideoAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Videoni o'chirishda xatolik yuz berdi.");
      }
    });
  };

  const handlePlayVideo = (videoId: string, title: string) => {
    setActivePlayer({ id: videoId, title });
  };

  const handleClosePlayer = () => {
    setActivePlayer(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2 topic-tabs-container">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
              selectedCategory === "all"
                ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)] font-bold shadow-sm"
                : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            #barchasi
          </button>
          {allCategories.map((cat) => {
            const isActive =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)] font-bold shadow-sm"
                    : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                #{cat.toLowerCase()}
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Yangi video
            </button>
          </div>
        )}
      </div>

      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="h-full">
              <VideoCard
                video={video}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onPlay={handlePlayVideo}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl glass border border-zinc-800/40 text-center p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900/80 text-zinc-500 mb-4 border border-zinc-800/60">
            <VideoIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Videolar topilmadi
          </h3>
          <p className="text-sm text-zinc-500 max-w-xs">
            {selectedCategory !== "all"
              ? "Tanlangan toifaga mos keladigan videolar topilmadi."
              : "Hozircha videolar to'plami bo'sh."}
          </p>
        </div>
      )}

      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {activePlayer && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div
            onClick={handleClosePlayer}
            className="absolute inset-0 bg-black/85 backdrop-blur-lg cursor-pointer"
          />

          <button
            onClick={handleClosePlayer}
            className="absolute top-4 right-4 z-10 rounded-full p-2.5 bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
            title="Yopish"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative w-full max-w-4xl aspect-video rounded-2xl shadow-2xl z-10 border border-zinc-800 bg-black overflow-hidden scale-in-95 duration-200">
            <iframe
              src={`https://www.youtube.com/embed/${activePlayer.id}?autoplay=1&modestbranding=1`}
              title={activePlayer.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10 max-w-4xl w-full text-center mt-4 px-4">
            <h2 className="text-base md:text-lg font-bold text-white leading-relaxed line-clamp-1">
              {activePlayer.title}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

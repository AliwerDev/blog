import React from "react";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { getVideos } from "@/lib/db";
import Header from "@/components/layout/Header";
import VideoListClient from "@/components/video/VideoListClient";

export const metadata = {
  title: "Videolar",
  description:
    "Dasturlash, dizayn hamda zamonaviy texnologiyalarga oid YouTube videolari to'plami.",
};

export default async function VideosPage() {
  const videos = await getVideos();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAdmin = token ? (await verifySession(token)) !== null : false;

  return (
    <div className="relative min-h-screen px-4 pt-2 md:pt-4 pb-8 md:pb-16">
      <div className="glow-bg" />

      <main className="relative z-10">
        <div className="w-full max-w-5xl mx-auto">
          <Header isAdmin={isAdmin} />

          <VideoListClient initialVideos={videos} isAdmin={isAdmin} />
        </div>
      </main>
    </div>
  );
}

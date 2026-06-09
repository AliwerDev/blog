import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { getPosts } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function Home() {
  const posts = await getPosts();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAdmin = token ? (await verifySession(token)) !== null : false;

  return (
    <div className="relative min-h-screen px-4 pt-2 md:pt-4 pb-8 md:pb-16">
      <div className="glow-bg" />

      <main className="relative z-10">
        <HomeClient initialPosts={posts} isAdmin={isAdmin} />
      </main>
    </div>
  );
}

import TagBadge from "@/components/ui/TagBadge";
import { formatDate } from "@/lib/utils";
import { Post } from "@/types";

interface PostDetailContentProps {
  post: Post;
}

export default function PostDetailContent({ post }: PostDetailContentProps) {
  const getPostTags = (p: Post): string[] => {
    if (p.tags && Array.isArray(p.tags) && p.tags.length > 0) {
      return p.tags;
    }
    if (p.topicId) {
      return [p.topicId];
    }
    return [];
  };

  return (
    <article className="bg-white border border-zinc-200/80 rounded-none p-6 md:p-12 max-w-5xl mx-auto shadow-none">
      {/* Newspaper Article Headline */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-[var(--foreground)] tracking-tight text-center mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Article Metadata Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans text-[var(--muted)] border-y border-zinc-200 py-3 mb-10 select-none">
        <span className="font-mono uppercase text-zinc-400 tracking-wider">
          Chop etilgan:
        </span>
        <span className="font-bold text-[var(--foreground)]">
          {formatDate(post.createdAt, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="text-zinc-300">•</span>
        <div className="flex flex-wrap gap-1.5">
          {getPostTags(post).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* Article Body Content */}
      <div
        className="prose max-w-none text-zinc-800 font-serif leading-relaxed text-base md:text-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

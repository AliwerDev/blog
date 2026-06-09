import { Calendar } from "lucide-react";
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
    <article className="glass rounded-2xl p-6 md:p-10 shadow-xl border border-zinc-800/60 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-6">
        <div className="flex flex-wrap gap-2">
          {getPostTags(post).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <div className="inline-flex items-center gap-1.5 text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(post.createdAt, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight mb-8 leading-tight">
        {post.title}
      </h1>

      <div
        className="prose max-w-none text-zinc-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

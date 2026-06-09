import React from 'react';
import { Tag } from 'lucide-react';

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  interactive?: boolean;
}

export default function TagBadge({ tag, onClick, interactive = false }: TagBadgeProps) {
  const baseClasses = "inline-flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/80 px-2.5 py-0.5 rounded-full text-purple-400 font-medium text-xs select-none";
  const hoverClasses = interactive && onClick ? "hover:bg-zinc-800 hover:text-purple-300 transition-all cursor-pointer" : "";

  return (
    <span 
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses}`}
    >
      <Tag className="h-3 w-3 text-purple-400/80" />
      {tag}
    </span>
  );
}

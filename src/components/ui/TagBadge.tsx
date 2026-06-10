import React from 'react';

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  interactive?: boolean;
}

export default function TagBadge({ tag, onClick, interactive = false }: TagBadgeProps) {
  const baseClasses = "inline-flex items-center bg-zinc-100/80 border border-zinc-300 px-2 py-0.5 rounded-none text-zinc-700 font-mono text-[10px] font-bold uppercase tracking-wider select-none";
  const hoverClasses = interactive && onClick ? "hover:bg-zinc-200 hover:border-zinc-400 hover:text-black transition-all cursor-pointer" : "";

  return (
    <span 
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses}`}
    >
      #{tag}
    </span>
  );
}

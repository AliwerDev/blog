import React from 'react';

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  interactive?: boolean;
}

export default function TagBadge({ tag, onClick, interactive = false }: TagBadgeProps) {
  const baseClasses = "inline-flex items-center bg-[var(--muted-light)] border border-[var(--card-border)] px-2 py-0.5 rounded-none text-[var(--foreground-dim)] font-mono text-[10px] font-bold uppercase tracking-wider select-none";
  const hoverClasses = interactive && onClick ? "hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all cursor-pointer" : "";

  return (
    <span 
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses}`}
    >
      #{tag}
    </span>
  );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
  className?: string;
}

export default function Loader({ text = 'Yuklanmoqda...', className = 'py-20' }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`}>
      <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
      {text && <p className="text-zinc-500 text-sm mt-4 font-medium">{text}</p>}
    </div>
  );
}

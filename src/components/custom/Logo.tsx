'use client';

import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl animate-pulse-glow" />
        <div className="relative w-full h-full bg-gradient-to-br from-pink-400 via-purple-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-1/2 h-1/2 text-white animate-float" />
        </div>
      </div>
      {showText && (
        <div>
          <h1 className={`${textSizes[size]} font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent`}>
            KidQuest
          </h1>
        </div>
      )}
    </div>
  );
}

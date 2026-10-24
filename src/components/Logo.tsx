import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showSlogan = false,
  className = '' 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Futuristic Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Glowing backdrop halo */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-amber-500/30 blur-md animate-pulse" />
        
        {/* Outer geometric shield */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#0c1538] via-[#090e29] to-[#050814] border border-cyan-400/40 p-1 flex items-center justify-center shadow-lg shadow-cyan-950/50">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]"
          >
            {/* Background Circuit lines */}
            <path d="M20 50 L35 50 L45 30 L55 70 L65 50 L80 50" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            
            {/* Futuristic Delta Wings - Dream Wing */}
            <path 
              d="M50 12 L82 78 L50 64 L18 78 Z" 
              fill="url(#freedream-gradient)" 
              stroke="#00F0FF" 
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Golden Core Orbit */}
            <circle cx="50" cy="50" r="9" fill="#090E29" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="4.5" fill="#F59E0B" className="animate-ping" style={{ animationDuration: '3s' }} />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="freedream-gradient" x1="18" y1="12" x2="82" y2="78" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00F0FF" />
                <stop offset="0.5" stopColor="#3B82F6" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-wider font-display leading-none flex items-center gap-1.5 ${textSizes[size]}`}>
          <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            FREE
          </span>
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            DREAM
          </span>
        </div>
        {showSlogan && (
          <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-cyan-400/80 font-medium mt-0.5">
            Dream Without Limit.
          </span>
        )}
      </div>
    </div>
  );
};

import React from 'react';

interface WchatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const WchatLogo: React.FC<WchatLogoProps> = ({
  size = 'md',
  showText = true,
  textColor,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-xl' },
    md: { icon: 42, text: 'text-2xl' },
    lg: { icon: 64, text: 'text-4xl' },
    xl: { icon: 88, text: 'text-5xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Stylized Neon Purple W Logo */}
      <div className="relative flex items-center justify-center">
        {/* Ambient neon purple glow */}
        <div
          className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
          style={{ width: currentSize.icon * 1.5, height: currentSize.icon * 1.5 }}
        />
        
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_0_16px_rgba(185,138,255,0.8)]"
        >
          <defs>
            <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#8B3DFF" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="wGlow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#E9D5FF" />
            </linearGradient>
            <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Main Stylized 'W' with rounded tips matching reference image */}
          <path
            d="M 18 24 
               C 18 20, 24 20, 26 24 
               L 38 68 
               C 39 72, 43 72, 44 68 
               L 50 44 
               C 51 40, 55 40, 56 44 
               L 62 68 
               C 63 72, 67 72, 68 68 
               L 80 24 
               C 82 20, 88 20, 88 24 
               L 74 78 
               C 71 88, 61 88, 58 78 
               L 53 58 
               L 48 78 
               C 45 88, 35 88, 32 78 
               Z"
            fill="url(#wGrad)"
            filter="url(#neonFilter)"
          />

          {/* Inner Highlight curve */}
          <path
            d="M 23 28 L 34 68 C 36 74, 42 74, 44 68 L 50 48"
            stroke="url(#wGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 56 48 L 62 68 C 64 74, 70 74, 72 68 L 83 28"
            stroke="url(#wGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-extrabold tracking-tight mt-2 ${currentSize.text} ${
            textColor || 'text-white'
          }`}
          style={{ letterSpacing: '-0.03em' }}
        >
          W<span className="font-semibold opacity-95">chat</span>
        </span>
      )}
    </div>
  );
};

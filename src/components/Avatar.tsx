import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  showOnlineBadge?: boolean;
  hasGlow?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  isOnline = false,
  showOnlineBadge = false,
  hasGlow = false,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  const badgeSizeClasses = {
    xs: 'w-2 h-2 bottom-0 right-0 border',
    sm: 'w-2.5 h-2.5 bottom-0 right-0 border-2',
    md: 'w-3 h-3 bottom-0.5 right-0.5 border-2',
    lg: 'w-3.5 h-3.5 bottom-1 right-1 border-2',
    xl: 'w-4 h-4 bottom-1 right-1 border-2',
    '2xl': 'w-5 h-5 bottom-1.5 right-1.5 border-2',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full transition-transform active:scale-95 ${
        hasGlow ? 'neon-glow-avatar' : ''
      } ${className}`}
    >
      <div
        className={`relative overflow-hidden rounded-full ring-2 ring-purple-500/30 bg-gradient-to-br from-purple-900/60 to-indigo-950/80 flex items-center justify-center font-bold text-white shadow-md ${sizeClasses[size]}`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
            onError={(e) => {
              // Fallback to initials if image fails
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        <span className={src ? 'hidden' : ''}>{getInitials(name)}</span>
      </div>

      {showOnlineBadge && (
        <span
          className={`absolute rounded-full border-[#080810] shadow-sm ${badgeSizeClasses[size]} ${
            isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

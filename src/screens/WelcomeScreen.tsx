import React from 'react';
import { WchatLogo } from '../components/WchatLogo';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Globe } from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div
      className={`relative flex flex-col justify-between h-full p-6 overflow-hidden ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      {/* Background ambient glowing waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[480px] h-72 bg-gradient-to-t from-purple-800/30 to-transparent rounded-full blur-2xl" />
        
        {/* Subtle curved wave pattern */}
        <svg
          className="absolute bottom-16 left-0 right-0 w-full opacity-30"
          viewBox="0 0 400 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -50 120 C 100 60, 220 180, 450 80"
            stroke="url(#waveGrad)"
            strokeWidth="2.5"
          />
          <path
            d="M -30 140 C 120 80, 240 200, 480 100"
            stroke="url(#waveGrad)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B3DFF" />
              <stop offset="50%" stopColor="#B98AFF" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Bar with Language Selector */}
      <div className="relative z-10 flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigate('language')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isDark
              ? 'bg-[#121221]/80 border-[#29263D] text-[#9994AD] hover:text-white'
              : 'bg-white border-[#D8D4E8] text-[#68647E] hover:text-black'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <span className="uppercase font-semibold">{language}</span>
        </button>
      </div>

      {/* Center Branding Area */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <WchatLogo size="xl" showText={true} />
        
        <p className="mt-4 text-xs font-semibold tracking-widest uppercase text-purple-400">
          {t('brandingSlogan')}
        </p>

        <p
          className={`mt-3 text-center text-sm max-w-xs font-normal leading-relaxed px-4 ${
            isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
          }`}
        >
          {t('tagline')}
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div className="relative z-10 flex flex-col gap-3.5 pb-6">
        <button
          type="button"
          onClick={() => onNavigate('signup')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white font-semibold text-base shadow-[0_4px_24px_rgba(139,61,255,0.45)] hover:shadow-[0_6px_30px_rgba(139,61,255,0.6)] active:scale-[0.98] transition-all"
        >
          {t('getStarted')}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-base border transition-all active:scale-[0.98] ${
            isDark
              ? 'bg-[#121221] border-[#29263D] text-[#F8F6FF] hover:border-purple-500/50'
              : 'bg-white border-[#D8D4E8] text-[#12111D] hover:border-purple-500/50'
          }`}
        >
          {t('logIn')}
        </button>
      </div>
    </div>
  );
};

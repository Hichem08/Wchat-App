import React from 'react';
import { Image as ImageIcon, Camera, FileText, FileCode, Music, MapPin, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface AttachmentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (type: 'photo' | 'camera' | 'document' | 'pdf' | 'audio' | 'location') => void;
}

export const AttachmentSheet: React.FC<AttachmentSheetProps> = ({
  isOpen,
  onClose,
  onSelectOption,
}) => {
  const { isDark } = useTheme();
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  const options = [
    {
      id: 'photo' as const,
      label: t('photo'),
      icon: ImageIcon,
      bg: 'bg-purple-600/20 text-purple-400 border-purple-500/30 hover:border-purple-400',
      glow: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    },
    {
      id: 'camera' as const,
      label: t('camera'),
      icon: Camera,
      bg: 'bg-violet-600/20 text-violet-400 border-violet-500/30 hover:border-violet-400',
      glow: 'hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]',
    },
    {
      id: 'document' as const,
      label: t('document'),
      icon: FileText,
      bg: 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:border-blue-400',
      glow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    },
    {
      id: 'pdf' as const,
      label: t('pdf'),
      icon: FileCode,
      bg: 'bg-rose-600/20 text-rose-400 border-rose-500/30 hover:border-rose-400',
      glow: 'hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    },
    {
      id: 'audio' as const,
      label: t('audio'),
      icon: Music,
      bg: 'bg-pink-600/20 text-pink-400 border-pink-500/30 hover:border-pink-400',
      glow: 'hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]',
    },
    {
      id: 'location' as const,
      label: t('location'),
      icon: MapPin,
      bg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
      glow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-t-[32px] p-6 pb-8 transition-transform duration-300 shadow-2xl border-t ${
          isDark
            ? 'bg-[#121221] border-[#29263D] text-[#F8F6FF]'
            : 'bg-[#FFFFFF] border-[#D8D4E8] text-[#12111D]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">{t('sendFile')}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-black/5 text-zinc-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Grid items exactly as in reference image */}
        <div className="grid grid-cols-3 gap-4">
          {options.map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectOption(opt.id);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 group ${
                  isDark ? 'bg-[#1B1A2B]' : 'bg-[#ECEAF5]'
                } ${opt.glow}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2.5 border transition-transform duration-200 group-hover:scale-110 ${opt.bg}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold capitalize tracking-wide">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

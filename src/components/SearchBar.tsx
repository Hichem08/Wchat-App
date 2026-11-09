import React from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
  onClear,
  className = '',
}) => {
  const { isDark } = useTheme();
  const { t, isRTL } = useLanguage();

  return (
    <div
      className={`relative flex items-center px-3.5 py-2.5 rounded-full transition-all duration-200 border ${
        isDark
          ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]/80 focus-within:shadow-[0_0_12px_rgba(139,61,255,0.25)]'
          : 'bg-[#ECEAF5] border-[#D8D4E8] focus-within:border-[#8B3DFF]/80'
      } ${className}`}
    >
      <Search
        className={`w-4 h-4 shrink-0 ${isRTL ? 'ml-2.5' : 'mr-2.5'} ${
          isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder || t('search')}
        className={`w-full bg-transparent text-sm font-normal focus:outline-none placeholder:text-opacity-60 ${
          isDark
            ? 'text-[#F8F6FF] placeholder-[#9994AD]'
            : 'text-[#12111D] placeholder-[#68647E]'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => {
            onChangeText('');
            onClear?.();
          }}
          className={`p-1 rounded-full hover:bg-white/10 text-xs transition-colors ${
            isDark ? 'text-[#9994AD] hover:text-white' : 'text-[#68647E] hover:text-black'
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

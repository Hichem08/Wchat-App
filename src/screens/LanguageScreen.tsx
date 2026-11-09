import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../types';

interface LanguageScreenProps {
  onNavigate: (screen: string) => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({ onNavigate }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  const languages: { id: Language; label: string; nativeName: string; flag: string }[] = [
    { id: 'en', label: 'English', nativeName: 'English (US)', flag: '🇬🇧' },
    { id: 'fr', label: 'Français', nativeName: 'Français (France)', flag: '🇫🇷' },
    { id: 'ar', label: 'العربية', nativeName: 'العربية (RTL)', flag: '🇸🇦' },
  ];

  const handleContinue = () => {
    setLanguage(selectedLang);
    onNavigate('home');
  };

  return (
    <div
      className={`relative flex flex-col justify-between h-full px-6 py-4 ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      <div>
        {/* Header Back Button */}
        <div className="flex items-center pt-2 mb-6">
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-zinc-900'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold tracking-tight mb-2">{t('chooseLanguage')}</h1>
        <p className={`text-xs mb-8 leading-relaxed ${isDark ? 'text-[#9994AD]' : 'text-[#68647E]'}`}>
          {t('selectLanguagePrompt')}
        </p>

        {/* Language Cards */}
        <div className="flex flex-col gap-3.5">
          {languages.map(item => {
            const isSelected = selectedLang === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedLang(item.id);
                  // Apply immediately to give immediate feedback
                  setLanguage(item.id);
                }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${
                  isSelected
                    ? 'border-[#8B3DFF] bg-[#8B3DFF]/15 shadow-[0_0_20px_rgba(139,61,255,0.25)]'
                    : isDark
                    ? 'bg-[#121221] border-[#29263D] hover:border-zinc-700'
                    : 'bg-white border-[#D8D4E8] hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{item.flag}</span>
                  <div className="text-left" dir={item.id === 'ar' ? 'rtl' : 'ltr'}>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p
                      className={`text-xs ${
                        isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
                      }`}
                    >
                      {item.nativeName}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-[#8B3DFF] border-[#8B3DFF] text-white shadow-[0_0_8px_#8B3DFF]'
                      : isDark
                      ? 'border-[#29263D]'
                      : 'border-[#D8D4E8]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pb-6">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white font-semibold text-base shadow-[0_4px_24px_rgba(139,61,255,0.4)] hover:shadow-[0_6px_30px_rgba(139,61,255,0.55)] active:scale-[0.98] transition-all"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  );
};

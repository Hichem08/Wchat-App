import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Bell, Clock, Info, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const [notifications, setNotifications] = useState(true);
  const [autoDeleteTime, setAutoDeleteTime] = useState('24 Hours');

  return (
    <div
      className={`relative flex flex-col justify-between h-full overflow-y-auto px-6 py-4 ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 pt-2 mb-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-zinc-900'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">{t('settings')}</h1>
        </div>

        {/* Section 1: Language / Langue segmented buttons matching reference image */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9994AD] mb-2.5">
            Language / Langue / اللغة
          </label>
          <div
            className={`grid grid-cols-3 p-1 rounded-2xl border ${
              isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
            }`}
          >
            {[
              { id: 'en' as Language, label: 'English' },
              { id: 'fr' as Language, label: 'Français' },
              { id: 'ar' as Language, label: 'العربية' },
            ].map(item => {
              const isSelected = language === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLanguage(item.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#8B3DFF] text-white shadow-[0_2px_10px_rgba(139,61,255,0.4)]'
                      : isDark
                      ? 'text-[#9994AD] hover:text-white'
                      : 'text-[#68647E] hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Notifications Switch */}
        <div
          className={`flex items-center justify-between p-4 rounded-2xl border mb-4 ${
            isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold">{t('notifications')}</span>
          </div>

          <button
            type="button"
            onClick={() => setNotifications(p => !p)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              notifications ? 'bg-[#8B3DFF]' : isDark ? 'bg-zinc-700' : 'bg-zinc-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                notifications ? (isRTL ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Section 3: Auto delete messages (24 Hours dropdown) */}
        <div
          className={`p-4 rounded-2xl border mb-4 ${
            isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">{t('autoDeleteMessages')}</span>
            </div>

            <select
              value={autoDeleteTime}
              onChange={e => setAutoDeleteTime(e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#1B1A2B] border-[#29263D] text-[#B98AFF]'
                  : 'bg-[#ECEAF5] border-[#D8D4E8] text-[#7E2EE5]'
              }`}
            >
              <option value="24 Hours">24 Hours</option>
              <option value="12 Hours">12 Hours</option>
              <option value="1 Hour">1 Hour</option>
              <option value="Off">Off</option>
            </select>
          </div>
          <p className="text-[11px] text-[#9994AD] mt-1 pl-8">
            {t('autoDeleteSub')}
          </p>
        </div>

        {/* Section 4: Appearance (Dark mode Switch) */}
        <div
          className={`flex items-center justify-between p-4 rounded-2xl border mb-6 ${
            isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
          }`}
        >
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="w-5 h-5 text-purple-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <p className="text-sm font-semibold">{t('darkMode')}</p>
              <p className="text-[11px] text-[#9994AD]">{isDark ? 'Dark theme active' : 'Light theme active'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              isDark ? 'bg-[#8B3DFF]' : 'bg-zinc-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                isDark ? (isRTL ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Section 5: About Wchat */}
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <Info className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">{t('aboutWchat')}</h4>
          </div>
          <p className="text-xs font-semibold text-purple-400">{t('version')}</p>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-[#9994AD]' : 'text-[#68647E]'}`}>
            Built with React Native mobile architecture & modular TypeScript.
          </p>
        </div>
      </div>
    </div>
  );
};

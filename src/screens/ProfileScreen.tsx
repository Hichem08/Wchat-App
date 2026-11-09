import React, { useState } from 'react';
import {
  ArrowLeft,
  UserCheck,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit3,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Avatar } from '../components/Avatar';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { user, updateProfile, logout } = useAuth();
  const { isDark } = useTheme();
  const { t, language, isRTL } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [statusText, setStatusText] = useState(user.statusText || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveProfile = () => {
    updateProfile({ name, statusText });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('welcome');
  };

  return (
    <div
      className={`relative flex flex-col justify-between h-full overflow-y-auto px-6 py-4 ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-zinc-900'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <h1 className="text-lg font-bold tracking-tight">{t('profile')}</h1>
          <button
            type="button"
            onClick={() => setIsEditing(p => !p)}
            className={`p-2 rounded-full transition-colors text-purple-400 ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
            }`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center mb-8">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="2xl"
            hasGlow
            className="mb-4 ring-4 ring-purple-500/40"
          />

          {isEditing ? (
            <div className="w-full max-w-xs space-y-2 mt-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl text-center font-bold text-lg border ${
                  isDark ? 'bg-[#121221] border-purple-500 text-white' : 'bg-white border-purple-500'
                }`}
              />
              <input
                type="text"
                value={statusText}
                onChange={e => setStatusText(e.target.value)}
                placeholder="Status"
                className={`w-full px-3 py-1 rounded-xl text-center text-xs border ${
                  isDark ? 'bg-[#121221] border-zinc-700 text-zinc-300' : 'bg-white border-zinc-300'
                }`}
              />
              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t('saveChanges')}</span>
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-xs text-[#9994AD] mt-0.5">
                {t('matriculeShort')}: {user.matricule || '2025005'}
              </p>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-400">{t('online')}</span>
              </div>
            </>
          )}
        </div>

        {/* Menu Items matching reference image */}
        <div className="space-y-2.5">
          {/* Edit Profile */}
          <div
            onClick={() => setIsEditing(p => !p)}
            className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] hover:border-purple-500/40'
                : 'bg-white border-[#D8D4E8] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">{t('editProfile')}</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#9994AD] ${isRTL ? 'rotate-180' : ''}`} />
          </div>

          {/* Notifications Toggle */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
              isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">{t('notifications')}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(p => !p)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                notificationsEnabled ? 'bg-[#8B3DFF]' : isDark ? 'bg-zinc-700' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled
                    ? isRTL
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div
            onClick={() => onNavigate('language')}
            className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] hover:border-purple-500/40'
                : 'bg-white border-[#D8D4E8] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">{t('language')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#9994AD]">
              <span className="capitalize">{language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'العربية'}</span>
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Privacy & Security */}
          <div
            onClick={() => alert('Wchat uses end-to-end encrypted local state & 24h disappearing messages.')}
            className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] hover:border-purple-500/40'
                : 'bg-white border-[#D8D4E8] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">{t('privacyAndSecurity')}</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#9994AD] ${isRTL ? 'rotate-180' : ''}`} />
          </div>

          {/* Help & Support */}
          <div
            onClick={() => alert('Wchat Mobile Application Support v1.0.0')}
            className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] hover:border-purple-500/40'
                : 'bg-white border-[#D8D4E8] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">{t('helpAndSupport')}</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#9994AD] ${isRTL ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Log Out Red Button */}
      <div className="pt-8 pb-6">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 px-6 rounded-2xl bg-rose-600/15 border border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <LogOut className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t('logOut')}</span>
        </button>
      </div>
    </div>
  );
};

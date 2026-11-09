import React from 'react';
import { MessageSquare, Users, Compass, User as UserIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export type NavTab = 'chats' | 'contacts' | 'discover' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 2,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const navItems = [
    { id: 'chats' as NavTab, label: t('chats'), icon: MessageSquare, badge: unreadCount },
    { id: 'contacts' as NavTab, label: t('contacts'), icon: Users },
    { id: 'discover' as NavTab, label: t('discover'), icon: Compass },
    { id: 'profile' as NavTab, label: t('profile'), icon: UserIcon },
  ];

  return (
    <div
      className={`shrink-0 border-t py-2 px-4 transition-colors duration-200 ${
        isDark
          ? 'bg-[#080810]/95 backdrop-blur-lg border-[#29263D]'
          : 'bg-[#FFFFFF]/95 backdrop-blur-lg border-[#D8D4E8]'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-[#8B3DFF]'
                  : isDark
                  ? 'text-[#9994AD] hover:text-white'
                  : 'text-[#68647E] hover:text-black'
              }`}
            >
              {/* Active glow indicator pill */}
              {isActive && (
                <div className="absolute -top-1 w-6 h-1 rounded-full bg-[#8B3DFF] shadow-[0_0_8px_#8B3DFF]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(139,61,255,0.8)]' : ''
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#8B3DFF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#080810]">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[11px] mt-1 font-medium transition-all ${
                  isActive ? 'font-bold text-[#8B3DFF]' : 'opacity-80'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

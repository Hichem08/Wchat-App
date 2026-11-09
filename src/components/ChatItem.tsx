import React from 'react';
import { Chat } from '../types';
import { Avatar } from './Avatar';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ChatItemProps {
  chat: Chat;
  onPress: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => {
  const { isDark } = useTheme();
  const { isRTL, t } = useLanguage();

  const isTyping = chat.isTyping;
  const hasUnread = chat.unreadCount > 0;

  return (
    <div
      onClick={onPress}
      role="button"
      tabIndex={0}
      className={`group flex items-center px-4 py-3.5 mx-2 rounded-2xl cursor-pointer transition-all duration-150 active:scale-[0.98] ${
        isDark
          ? 'hover:bg-[#1B1A2B]/70 active:bg-[#1B1A2B]'
          : 'hover:bg-[#ECEAF5]/70 active:bg-[#ECEAF5]'
      }`}
    >
      {/* Profile Avatar */}
      <Avatar
        src={chat.avatar}
        name={chat.name}
        size="md"
        isOnline={chat.isOnline}
        showOnlineBadge={chat.type === 'direct'}
        className={isRTL ? 'ml-3.5' : 'mr-3.5'}
      />

      {/* Center Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`text-base font-semibold truncate ${
              isDark ? 'text-[#F8F6FF]' : 'text-[#12111D]'
            }`}
          >
            {chat.name}
          </h3>
          <span
            className={`text-xs shrink-0 font-medium ${
              hasUnread
                ? 'text-[#8B3DFF] font-semibold'
                : isDark
                ? 'text-[#9994AD]'
                : 'text-[#68647E]'
            }`}
          >
            {chat.lastMessage?.timestamp || ''}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p
            className={`text-xs truncate ${
              isTyping
                ? 'text-[#B98AFF] italic font-medium'
                : hasUnread
                ? isDark
                  ? 'text-white font-medium'
                  : 'text-zinc-900 font-semibold'
                : isDark
                ? 'text-[#9994AD]'
                : 'text-[#68647E]'
            }`}
          >
            {isTyping ? t('typing') : chat.lastMessage?.text || ''}
          </p>

          {/* Unread Badge */}
          {hasUnread && (
            <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 ml-2 text-[11px] font-bold text-white bg-[#8B3DFF] rounded-full shadow-[0_0_10px_rgba(139,61,255,0.6)]">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

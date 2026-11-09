import React, { useState } from 'react';
import { UserCheck, MessageSquare, Phone, UserPlus } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SearchBar } from '../components/SearchBar';
import { Avatar } from '../components/Avatar';
import { MOCK_USERS } from '../constants/mockData';

interface ContactsScreenProps {
  onNavigate: (screen: string) => void;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({ onNavigate }) => {
  const { setActiveChatId, startCall } = useChat();
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');

  const filteredUsers = MOCK_USERS.filter(u => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      (u.matricule && u.matricule.toLowerCase().includes(query.toLowerCase())) ||
      (u.phone && u.phone.includes(query));

    if (!matchesQuery) return false;
    if (filter === 'online') return u.isOnline;
    return true;
  });

  const handleStartChat = (userId: string) => {
    if (userId === 'user_1') setActiveChatId('chat_1');
    else if (userId === 'user_2') setActiveChatId('chat_2');
    else if (userId === 'user_3') setActiveChatId('chat_4');
    else if (userId === 'user_4') setActiveChatId('chat_5');
    else setActiveChatId('chat_1');

    onNavigate('conversation');
  };

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold tracking-tight">{t('contacts')}</h1>
        <button
          type="button"
          onClick={() => onNavigate('new_message')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/15 text-purple-400 text-xs font-semibold hover:bg-purple-600/25 transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{t('invite')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-2">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchFriendsPlaceholder')}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-5 py-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-[#8B3DFF] text-white shadow-[0_2px_10px_rgba(139,61,255,0.4)]'
              : isDark
              ? 'bg-[#121221] text-[#9994AD] border border-[#29263D]'
              : 'bg-white text-[#68647E] border border-[#D8D4E8]'
          }`}
        >
          {t('allContacts')} ({MOCK_USERS.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('online')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'online'
              ? 'bg-[#8B3DFF] text-white shadow-[0_2px_10px_rgba(139,61,255,0.4)]'
              : isDark
              ? 'bg-[#121221] text-[#9994AD] border border-[#29263D]'
              : 'bg-white text-[#68647E] border border-[#D8D4E8]'
          }`}
        >
          {t('onlineFriends')} ({MOCK_USERS.filter(u => u.isOnline).length})
        </button>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
              isDark ? 'hover:bg-[#121221]' : 'hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="md"
                isOnline={user.isOnline}
                showOnlineBadge
              />
              <div className="min-w-0">
                <h4 className="text-sm font-semibold truncate">{user.name}</h4>
                <p className="text-xs text-[#9994AD] truncate">
                  {t('matriculeShort')}: {user.matricule} • {user.phone}
                </p>
                <p className="text-[11px] text-purple-400/80 truncate mt-0.5">
                  {user.statusText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => startCall(user, 'voice')}
                title={t('voiceCall')}
                className="p-2 rounded-full bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleStartChat(user.id)}
                title={t('message')}
                className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

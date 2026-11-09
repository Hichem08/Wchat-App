import React, { useState } from 'react';
import {
  ArrowLeft,
  UserSearch,
  BookUser,
  PhoneCall,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SearchBar } from '../components/SearchBar';
import { Avatar } from '../components/Avatar';
import { MOCK_USERS } from '../constants/mockData';
import { profileService } from '../services/profileService';
import { chatService } from '../services/chatService';

interface NewMessageScreenProps {
  onNavigate: (screen: string) => void;
}

export const NewMessageScreen: React.FC<NewMessageScreenProps> = ({ onNavigate }) => {
  const { chats, setActiveChatId } = useChat();
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const [query, setQuery] = useState('');
  const [remoteUsers, setRemoteUsers] = useState<typeof MOCK_USERS>([]);

  // Search local + remote users
  React.useEffect(() => {
    if (query.trim().length > 1) {
      profileService.searchUsers(query.trim()).then(users => {
        if (users.length > 0) {
          setRemoteUsers(users as any);
        }
      });
    } else {
      setRemoteUsers([]);
    }
  }, [query]);

  // Combine and deduplicate users
  const sourceUsers = remoteUsers.length > 0 ? remoteUsers : MOCK_USERS;
  const filteredUsers = sourceUsers.filter(u => {
    const q = query.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.matricule && u.matricule.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  });

  const handleStartConversation = async (user: typeof MOCK_USERS[0]) => {
    // Check if chat already exists
    const existing = chats.find(
      c => c.type === 'direct' && c.participantIds.includes(user.id)
    );
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      const newChatId = await chatService.createPrivateChat(user.id);
      setActiveChatId(newChatId || 'chat_1');
    }
    onNavigate('conversation');
  };

  return (
    <div
      className={`relative flex flex-col h-full overflow-y-auto px-4 py-3 ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pt-2 mb-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-zinc-900'
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">{t('newMessage')}</h1>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchFriendsPlaceholder')}
        />
      </div>

      {/* 3 Action rows exactly matching reference image */}
      {!query && (
        <div className="space-y-2 mb-6">
          {/* Action 1: Search by name or matricule */}
          <div
            onClick={() => setQuery('2025')}
            className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] hover:border-purple-500/40'
                : 'bg-white border-[#D8D4E8] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                <UserSearch className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t('searchByNameOrMatricule')}</p>
                <p className="text-[11px] text-[#9994AD]">{t('matriculeShort')}: 2025...</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#9994AD] ${isRTL ? 'rotate-180' : ''}`} />
          </div>

          {/* Action 2: From contacts */}
          <div
            onClick={() => onNavigate('contacts')}
            className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] hover:border-purple-500/40'
                : 'bg-white border-[#D8D4E8] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <BookUser className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t('fromContacts')}</p>
                <p className="text-[11px] text-[#9994AD]">{t('fromContactsSub')}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#9994AD] ${isRTL ? 'rotate-180' : ''}`} />
          </div>

          {/* Action 3: From phone number */}
          <div
            onClick={() => setQuery('+')}
            className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] hover:border-purple-500/40'
                : 'bg-white border-[#D8D4E8] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t('fromPhoneNumber')}</p>
                <p className="text-[11px] text-[#9994AD]">{t('fromPhoneNumberSub')}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#9994AD] ${isRTL ? 'rotate-180' : ''}`} />
          </div>
        </div>
      )}

      {/* Recent List */}
      <div>
        <h3
          className={`text-xs font-bold uppercase tracking-wider mb-2.5 px-2 ${
            isDark ? 'text-[#9994AD]' : 'text-[#68647E]'
          }`}
        >
          {query ? t('search') : t('recent')}
        </h3>

        <div className="space-y-1">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => handleStartConversation(user)}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all active:scale-[0.99] ${
                isDark ? 'hover:bg-[#121221]' : 'hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="md"
                  isOnline={user.isOnline}
                  showOnlineBadge
                />
                <div>
                  <h4 className="text-sm font-semibold">{user.name}</h4>
                  <p className="text-xs text-[#9994AD]">
                    {t('matriculeShort')}: {user.matricule}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="p-2 rounded-full bg-purple-600/15 text-purple-400 hover:bg-purple-600/25 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

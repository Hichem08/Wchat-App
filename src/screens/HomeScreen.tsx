import React from 'react';
import { SquarePen, Plus, Phone, Video, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChatItem } from '../components/ChatItem';
import { SearchBar } from '../components/SearchBar';
import { Avatar } from '../components/Avatar';
import { MOCK_USERS } from '../constants/mockData';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const {
    chats,
    setActiveChatId,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    startCall,
  } = useChat();
  const { isDark } = useTheme();
  const { t, isRTL } = useLanguage();

  // Filter chats by tab and search
  const filteredChats = chats.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage?.text && c.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (activeTab === 'chats') {
      return c.type === 'direct';
    }
    if (activeTab === 'groups') {
      return c.type === 'group';
    }
    return true; // calls tab handled separately
  });

  const handleOpenChat = (chatId: string) => {
    setActiveChatId(chatId);
    onNavigate('conversation');
  };

  // Mock call history
  const recentCalls = [
    {
      id: 'call_h1',
      user: MOCK_USERS[0],
      type: 'voice' as const,
      time: '10:12 AM',
      direction: 'incoming' as const,
      missed: false,
    },
    {
      id: 'call_h2',
      user: MOCK_USERS[1],
      type: 'video' as const,
      time: 'Yesterday',
      direction: 'outgoing' as const,
      missed: false,
    },
    {
      id: 'call_h3',
      user: MOCK_USERS[3],
      type: 'voice' as const,
      time: 'Nov 8',
      direction: 'incoming' as const,
      missed: true,
    },
  ];

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      {/* Top Header matching reference image: stylized W chat + Action icons */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Mini purple W */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-fuchsia-600 flex items-center justify-center shadow-[0_0_12px_rgba(139,61,255,0.6)]">
            <span className="text-white font-extrabold text-base tracking-tighter">W</span>
          </div>
          <span className="text-xl font-bold tracking-tight">chat</span>
        </div>

        {/* Right Action Icons: New Message & Create Group */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('new_message')}
            title={t('newMessage')}
            className={`p-2.5 rounded-full border transition-all active:scale-95 ${
              isDark
                ? 'bg-[#121221] border-[#29263D] text-[#B98AFF] hover:border-purple-500/50'
                : 'bg-white border-[#D8D4E8] text-[#8B3DFF] hover:border-purple-500/50'
            }`}
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-2">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('search')}
        />
      </div>

      {/* Tabs: Chats, Groups, Calls exactly as in reference image */}
      <div className="flex items-center gap-2 px-5 py-2">
        {(['chats', 'groups', 'calls'] as const).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white shadow-[0_2px_12px_rgba(139,61,255,0.4)]'
                  : isDark
                  ? 'bg-[#121221] text-[#9994AD] border border-[#29263D] hover:text-white'
                  : 'bg-white text-[#68647E] border border-[#D8D4E8] hover:text-black'
              }`}
            >
              {t(tab)}
            </button>
          );
        })}

        {activeTab === 'groups' && (
          <button
            type="button"
            onClick={() => onNavigate('create_group')}
            className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 transition-colors ${
              isRTL ? 'mr-auto ml-0' : 'ml-auto mr-0'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('createGroup')}</span>
          </button>
        )}
      </div>

      {/* Main List Content */}
      <div className="flex-1 overflow-y-auto pt-1 pb-4">
        {activeTab === 'calls' ? (
          <div className="px-2 space-y-1">
            {recentCalls.map(call => (
              <div
                key={call.id}
                className={`flex items-center justify-between p-3.5 mx-2 rounded-2xl transition-all ${
                  isDark ? 'hover:bg-[#1B1A2B]/60' : 'hover:bg-[#ECEAF5]/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={call.user.avatar}
                    name={call.user.name}
                    size="md"
                    isOnline={call.user.isOnline}
                    showOnlineBadge
                  />
                  <div>
                    <h4 className="text-sm font-semibold">{call.user.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-[#9994AD] mt-0.5">
                      {call.direction === 'incoming' ? (
                        <PhoneIncoming
                          className={`w-3.5 h-3.5 ${call.missed ? 'text-rose-400' : 'text-emerald-400'}`}
                        />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span>{call.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startCall(call.user, 'voice')}
                    className="p-2 rounded-full bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startCall(call.user, 'video')}
                    className="p-2 rounded-full bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  onPress={() => handleOpenChat(chat.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <p className={`text-sm ${isDark ? 'text-[#9994AD]' : 'text-[#68647E]'}`}>
                  {t('noChatsFound')}
                </p>
                {activeTab === 'groups' && (
                  <button
                    type="button"
                    onClick={() => onNavigate('create_group')}
                    className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-md"
                  >
                    {t('createGroup')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

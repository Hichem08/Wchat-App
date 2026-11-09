import React, { useState } from 'react';
import { Sparkles, Users, UserPlus, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from '../components/Avatar';
import { MOCK_USERS } from '../constants/mockData';

interface DiscoverScreenProps {
  onNavigate: (screen: string) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);

  const suggestedGroups = [
    {
      id: 'sg_1',
      name: 'AI & Mobile Engineers',
      members: 1420,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      description: 'Discussing React Native, Expo, and modern social UX',
    },
    {
      id: 'sg_2',
      name: 'Designers Club',
      members: 890,
      avatar: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&q=80',
      description: 'Dark mode aesthetics, gradients & neon UI',
    },
    {
      id: 'sg_3',
      name: 'University Campus 2025',
      members: 2310,
      avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
      description: 'Official student group with Matricule verification',
    },
  ];

  const toggleConnect = (id: string) => {
    setConnectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleJoinGroup = (id: string) => {
    setJoinedGroupIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto px-5 py-3 ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{t('discover')}</h1>
        </div>
      </div>

      {/* Section 1: Active Users Horizontally */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#9994AD] mb-3">
          {t('activeUsers')}
        </h2>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {MOCK_USERS.map(user => (
            <div
              key={user.id}
              onClick={() => onNavigate('new_message')}
              className="flex flex-col items-center shrink-0 cursor-pointer active:scale-95 transition-transform"
            >
              <Avatar
                src={user.avatar}
                name={user.name}
                size="lg"
                isOnline={user.isOnline}
                showOnlineBadge
                hasGlow={user.isOnline}
              />
              <span className="text-xs font-semibold mt-1.5 truncate max-w-[70px] text-center">
                {user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: People you may know */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#9994AD] mb-3">
          {t('peopleYouMayKnow')}
        </h2>
        <div className="space-y-2.5">
          {MOCK_USERS.slice(1, 4).map(user => {
            const isConnected = connectedIds.includes(user.id);
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="md" />
                  <div>
                    <h4 className="text-sm font-semibold">{user.name}</h4>
                    <p className="text-xs text-[#9994AD]">
                      {t('matriculeShort')}: {user.matricule}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleConnect(user.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isConnected
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                      : 'bg-purple-600 text-white hover:bg-purple-500 shadow-md'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{t('connected')}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{t('connect')}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Suggested Groups */}
      <div className="pb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#9994AD] mb-3">
          {t('suggestedGroups')}
        </h2>
        <div className="space-y-3">
          {suggestedGroups.map(group => {
            const isJoined = joinedGroupIds.includes(group.id);
            return (
              <div
                key={group.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDark ? 'bg-[#121221] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar src={group.avatar} name={group.name} size="md" />
                    <div>
                      <h4 className="text-sm font-semibold">{group.name}</h4>
                      <p className="text-xs text-[#9994AD]">{group.members} members</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleJoinGroup(group.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isJoined
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-600 text-white hover:bg-purple-500 shadow-md'
                    }`}
                  >
                    {isJoined ? t('joined') : t('join')}
                  </button>
                </div>
                <p className="text-xs text-[#9994AD]">{group.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

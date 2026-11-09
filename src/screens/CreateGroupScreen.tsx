import React, { useState } from 'react';
import { ArrowLeft, Camera, Check, Plus, X } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_USERS } from '../constants/mockData';
import { Avatar } from '../components/Avatar';

interface CreateGroupScreenProps {
  onNavigate: (screen: string) => void;
}

export const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({ onNavigate }) => {
  const { createGroup, setActiveChatId, setActiveTab } = useChat();
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  const [groupName, setGroupName] = useState('Study Group');
  const [description, setDescription] = useState("Let's study together!");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([
    MOCK_USERS[0].id,
    MOCK_USERS[1].id,
    MOCK_USERS[2].id,
  ]);
  const [groupAvatar, setGroupAvatar] = useState(
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'
  );

  const toggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup = createGroup(groupName, description, selectedUserIds, groupAvatar);
    setActiveChatId(newGroup.id);
    setActiveTab('groups');
    onNavigate('conversation');
  };

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
          <h1 className="text-xl font-bold tracking-tight">{t('createGroup')}</h1>
        </div>

        {/* Group Photo Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/50 p-0.5 shadow-[0_0_20px_rgba(139,61,255,0.4)]">
              <img
                src={groupAvatar}
                alt="Group photo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <button
              type="button"
              onClick={() => {
                // Change avatar sample
                setGroupAvatar(
                  groupAvatar.includes('522202')
                    ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80'
                    : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'
                );
              }}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white shadow-md hover:bg-purple-500"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#9994AD]">
              {t('groupName')}
            </label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder={t('groupNamePlaceholder')}
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#121221] border-[#29263D] focus:border-[#8B3DFF]'
                  : 'bg-white border-[#D8D4E8] focus:border-[#8B3DFF]'
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#9994AD]">
              {t('descriptionOptional')}
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#121221] border-[#29263D] focus:border-[#8B3DFF]'
                  : 'bg-white border-[#D8D4E8] focus:border-[#8B3DFF]'
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Add Members Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-[#9994AD]">
                {t('addMembers')} ({selectedUserIds.length})
              </label>
            </div>

            {/* Selected members row with remove tags */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-3">
              {selectedUserIds.map(userId => {
                const user = MOCK_USERS.find(u => u.id === userId);
                if (!user) return null;
                return (
                  <div key={user.id} className="flex flex-col items-center shrink-0 relative">
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <button
                      type="button"
                      onClick={() => toggleUser(user.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-[11px] font-medium mt-1 truncate max-w-[60px]">
                      {user.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Available members toggle list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {MOCK_USERS.map(user => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : isDark
                        ? 'bg-[#121221]/60 border-[#29263D]'
                        : 'bg-white border-[#D8D4E8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={user.avatar} name={user.name} size="xs" />
                      <span className="text-xs font-semibold">{user.name}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-zinc-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      {/* Create Button */}
      <div className="pt-6 pb-6">
        <button
          type="button"
          onClick={handleCreate}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white font-semibold text-base shadow-[0_4px_24px_rgba(139,61,255,0.4)] hover:shadow-[0_6px_30px_rgba(139,61,255,0.55)] active:scale-[0.98] transition-all"
        >
          {t('create')}
        </button>
      </div>
    </div>
  );
};

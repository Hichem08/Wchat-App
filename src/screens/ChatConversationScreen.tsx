import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  Smile,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { MessageBubble } from '../components/MessageBubble';
import { Avatar } from '../components/Avatar';
import { AttachmentSheet } from '../components/AttachmentSheet';
import { MOCK_USERS } from '../constants/mockData';
import { voiceService } from '../services/voiceService';
import { locationService } from '../services/locationService';
import { chatService } from '../services/chatService';

interface ChatConversationScreenProps {
  onNavigate: (screen: string) => void;
}

export const ChatConversationScreen: React.FC<ChatConversationScreenProps> = ({ onNavigate }) => {
  const {
    activeChatId,
    getChatById,
    messages,
    sendMessage,
    sendVoiceMessage,
    sendAttachment,
    startCall,
  } = useChat();
  const { isDark } = useTheme();
  const { t, isRTL } = useLanguage();

  const [inputText, setInputText] = useState('');
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = activeChatId ? getChatById(activeChatId) : null;
  const chatMessages = activeChatId && messages[activeChatId] ? messages[activeChatId] : [];

  // Partner user details
  const partnerUser =
    MOCK_USERS.find(u => currentChat?.participantIds.includes(u.id)) || {
      id: 'partner',
      name: currentChat?.name || 'Contact',
      avatar: currentChat?.avatar || '',
      isOnline: currentChat?.isOnline ?? true,
      statusText: 'Online',
    };

  // Scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom(true);
  }, [chatMessages.length]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: number;
    if (isRecordingVoice) {
      interval = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSendText = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    chatService.emitTyping(activeChatId, false, partnerUser.name);
    sendMessage(activeChatId, inputText.trim());
    setInputText('');
  };

  const handleVoiceRecordToggle = async () => {
    if (!activeChatId) return;

    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      await voiceService.startRecording();
    } else {
      setIsRecordingVoice(false);
      const { audioUrl, duration, waveform } = await voiceService.stopRecording(activeChatId);
      sendVoiceMessage(activeChatId, duration, waveform, audioUrl);
    }
  };

  const handleAttachmentOption = async (
    type: 'photo' | 'camera' | 'document' | 'pdf' | 'audio' | 'location'
  ) => {
    if (!activeChatId) return;

    if (type === 'location') {
      const loc = await locationService.getCurrentLocation();
      sendAttachment(
        activeChatId,
        'location',
        `📍 ${loc.address || 'Shared Location'} (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)})`,
        loc.mapsUrl
      );
    } else if (type === 'photo' || type === 'camera') {
      sendAttachment(
        activeChatId,
        'image',
        'Shared photo',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
      );
    } else if (type === 'pdf' || type === 'document') {
      sendAttachment(
        activeChatId,
        'file',
        'Project_Brief_2025.pdf',
        undefined,
        'Project_Brief_2025.pdf'
      );
    } else if (type === 'audio') {
      sendVoiceMessage(activeChatId, '0:18');
    }
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm text-zinc-400">No conversation selected</p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col h-full overflow-hidden ${
        isDark ? 'bg-[#080810] text-[#F8F6FF]' : 'bg-[#F5F4FA] text-[#12111D]'
      }`}
    >
      {/* Conversation Header */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 border-b z-10 ${
          isDark
            ? 'bg-[#080810]/95 backdrop-blur-md border-[#29263D]'
            : 'bg-white/95 backdrop-blur-md border-[#D8D4E8]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-zinc-900'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>

          <Avatar
            src={currentChat.avatar}
            name={currentChat.name}
            size="sm"
            isOnline={currentChat.isOnline}
            showOnlineBadge={currentChat.type === 'direct'}
          />

          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate leading-tight">{currentChat.name}</h2>
            <p className="text-[11px] text-emerald-400 font-medium">
              {currentChat.isTyping ? t('typing') : currentChat.isOnline ? t('online') : t('offline')}
            </p>
          </div>
        </div>

        {/* Call Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => startCall(partnerUser, 'voice', currentChat.id)}
            title={t('voiceCall')}
            className={`p-2 rounded-full transition-all active:scale-95 ${
              isDark ? 'hover:bg-white/10 text-[#B98AFF]' : 'hover:bg-black/5 text-[#8B3DFF]'
            }`}
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => startCall(partnerUser, 'video', currentChat.id)}
            title={t('videoCall')}
            className={`p-2 rounded-full transition-all active:scale-95 ${
              isDark ? 'hover:bg-white/10 text-[#B98AFF]' : 'hover:bg-black/5 text-[#8B3DFF]'
            }`}
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => alert(`Chat options for ${currentChat.name}`)}
            className={`p-2 rounded-full transition-all active:scale-95 ${
              isDark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-black/5 text-zinc-600'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 24-Hour Auto-Delete Notice banner exactly as specified */}
      <div className="bg-purple-950/40 border-b border-purple-500/20 px-4 py-1.5 flex items-center justify-center gap-2">
        <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        <span className="text-[11px] font-medium text-purple-200 truncate">
          {t('disappearingNotice')}
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {/* Date Divider Pill */}
        <div className="flex justify-center my-3">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${
              isDark
                ? 'bg-[#121221] border-[#29263D] text-[#9994AD]'
                : 'bg-white border-[#D8D4E8] text-[#68647E]'
            }`}
          >
            {t('today')}
          </span>
        </div>

        {chatMessages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Active Bar simulation */}
      {isRecordingVoice && (
        <div className="px-4 py-2 bg-purple-900/40 border-t border-purple-500/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-semibold text-rose-400">
              {t('recording')} 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}
            </span>
          </div>
          <button
            type="button"
            onClick={handleVoiceRecordToggle}
            className="text-xs font-bold text-purple-300 hover:text-white"
          >
            {t('send')}
          </button>
        </div>
      )}

      {/* Message Input Bottom Bar */}
      <div
        className={`px-3 py-2.5 border-t ${
          isDark ? 'bg-[#080810] border-[#29263D]' : 'bg-white border-[#D8D4E8]'
        }`}
      >
        <form onSubmit={handleSendText} className="flex items-center gap-2 max-w-lg mx-auto">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => setIsAttachmentOpen(true)}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'hover:bg-white/10 text-[#9994AD] hover:text-white'
                : 'hover:bg-black/5 text-[#68647E] hover:text-black'
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input field */}
          <div
            className={`flex-1 flex items-center px-3.5 py-2 rounded-full border transition-all ${
              isDark
                ? 'bg-[#121221] border-[#29263D] focus-within:border-[#8B3DFF]'
                : 'bg-[#ECEAF5] border-[#D8D4E8] focus-within:border-[#8B3DFF]'
            }`}
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={t('typeMessage')}
              className="w-full bg-transparent text-sm focus:outline-none"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <button
              type="button"
              onClick={() => setInputText(p => p + ' 😊')}
              className={`p-1 rounded-full text-xs ${
                isDark ? 'text-[#9994AD] hover:text-white' : 'text-[#68647E] hover:text-black'
              }`}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Mic or Send button */}
          {inputText.trim().length > 0 ? (
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B3DFF] to-[#A855F7] text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,61,255,0.6)] active:scale-95 transition-all"
            >
              <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVoiceRecordToggle}
              title={t('voiceNote')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                isRecordingVoice
                  ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-tr from-[#8B3DFF] to-[#A855F7] text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Send File Bottom Sheet */}
      <AttachmentSheet
        isOpen={isAttachmentOpen}
        onClose={() => setIsAttachmentOpen(false)}
        onSelectOption={handleAttachmentOption}
      />
    </div>
  );
};

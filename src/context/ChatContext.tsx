import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Chat, Message, MessageType, User, CallSession } from '../types';
import { INITIAL_CHATS, INITIAL_MESSAGES, MOCK_USERS } from '../constants/mockData';
import { useAuth } from './AuthContext';

interface ChatContextType {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  activeTab: 'chats' | 'groups' | 'calls';
  setActiveTab: (tab: 'chats' | 'groups' | 'calls') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sendMessage: (chatId: string, content: string, type?: MessageType, mediaUrl?: string) => void;
  sendVoiceMessage: (chatId: string, duration?: string, waveform?: number[]) => void;
  sendAttachment: (chatId: string, type: MessageType, content: string, mediaUrl?: string, fileName?: string) => void;
  createGroup: (name: string, description: string, memberIds: string[], avatar?: string) => Chat;
  getChatById: (id: string) => Chat | undefined;
  getUserById: (id: string) => User | undefined;
  
  // Call simulation
  currentCall: CallSession | null;
  startCall: (user: User, type: 'voice' | 'video', chatId?: string) => void;
  endCall: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  isSpeaker: boolean;
  toggleSpeaker: () => void;
  isVideoEnabled: boolean;
  toggleVideo: () => void;
  callDuration: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('wchat_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CHATS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('wchat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MESSAGES;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'groups' | 'calls'>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  // Call state
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('wchat_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('wchat_messages', JSON.stringify(messages));
  }, [messages]);

  // Call duration timer
  useEffect(() => {
    if (currentCall) {
      callTimerRef.current = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeaker(false);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [currentCall]);

  const getUserById = (id: string): User | undefined => {
    if (id === currentUser.id || id === 'user_current') return currentUser;
    return MOCK_USERS.find(u => u.id === id);
  };

  const getChatById = (id: string): Chat | undefined => {
    return chats.find(c => c.id === id);
  };

  const sendMessage = (chatId: string, content: string, type: MessageType = 'text', mediaUrl?: string) => {
    if (!content.trim() && !mediaUrl) return;

    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 3600 * 1000;

    const newMessage: Message = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      chatId,
      senderId: currentUser.id,
      type,
      content,
      mediaUrl,
      createdAt: now,
      expiresAt: now + TWENTY_FOUR_HOURS,
      isRead: false,
      isOutgoing: true,
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    // Update chat last message
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: {
              text: type === 'text' ? content : type === 'voice' ? '🎤 Voice message' : '📎 ' + content,
              senderId: currentUser.id,
              timestamp: 'Just now',
              type,
              isRead: false,
            },
            updatedAt: now,
          };
        }
        return c;
      })
    );

    // Auto-respond simulation after 1.5 seconds if chat is Sarah or Ahmed
    if (chatId === 'chat_1' || chatId === 'chat_2') {
      setTimeout(() => {
        const partner = chatId === 'chat_1' ? MOCK_USERS[0] : MOCK_USERS[1];
        const replies = [
          "That sounds amazing! Let's do it 💜",
          "Got your message! Everything looks super smooth.",
          "Awesome! I'll check it right away ✨",
          "Cool, keep me updated on the progress!",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg: Message = {
          id: 'reply_' + Date.now(),
          chatId,
          senderId: partner.id,
          type: 'text',
          content: randomReply,
          createdAt: Date.now(),
          expiresAt: Date.now() + TWENTY_FOUR_HOURS,
          isRead: true,
          isOutgoing: false,
        };

        setMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), replyMsg],
        }));

        setChats(prev =>
          prev.map(c => {
            if (c.id === chatId) {
              return {
                ...c,
                lastMessage: {
                  text: randomReply,
                  senderId: partner.id,
                  timestamp: 'Just now',
                  type: 'text',
                  isRead: false,
                },
                unreadCount: c.unreadCount + 1,
                updatedAt: Date.now(),
              };
            }
            return c;
          })
        );
      }, 1500);
    }
  };

  const sendVoiceMessage = (chatId: string, duration = '0:07', waveform?: number[]) => {
    const defaultWaveform = [25, 45, 80, 50, 90, 70, 30, 85, 95, 60, 40, 75, 55, 90, 35];
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 3600 * 1000;

    const newMessage: Message = {
      id: 'voice_' + Date.now(),
      chatId,
      senderId: currentUser.id,
      type: 'voice',
      content: 'Voice message',
      voiceDuration: duration,
      voiceWaveform: waveform || defaultWaveform,
      createdAt: now,
      expiresAt: now + TWENTY_FOUR_HOURS,
      isRead: false,
      isOutgoing: true,
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: {
              text: '🎤 Voice message',
              senderId: currentUser.id,
              timestamp: 'Just now',
              type: 'voice',
              isRead: false,
            },
            updatedAt: now,
          };
        }
        return c;
      })
    );
  };

  const sendAttachment = (chatId: string, type: MessageType, content: string, mediaUrl?: string, fileName?: string) => {
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 3600 * 1000;

    const newMessage: Message = {
      id: 'att_' + Date.now(),
      chatId,
      senderId: currentUser.id,
      type,
      content,
      mediaUrl,
      fileName,
      createdAt: now,
      expiresAt: now + TWENTY_FOUR_HOURS,
      isRead: false,
      isOutgoing: true,
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: {
              text: type === 'image' ? '📷 Photo' : '📎 ' + (fileName || content),
              senderId: currentUser.id,
              timestamp: 'Just now',
              type,
              isRead: false,
            },
            updatedAt: now,
          };
        }
        return c;
      })
    );
  };

  const createGroup = (name: string, description: string, memberIds: string[], avatar?: string): Chat => {
    const newGroupId = 'group_' + Date.now();
    const newGroup: Chat = {
      id: newGroupId,
      type: 'group',
      name: name.trim() || 'New Group',
      avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      participantIds: ['user_current', ...memberIds],
      lastMessage: {
        text: 'Group created: ' + (description || "Let's chat!"),
        senderId: currentUser.id,
        timestamp: 'Just now',
        type: 'text',
        isRead: true,
      },
      unreadCount: 0,
      isOnline: true,
      updatedAt: Date.now(),
    };

    setChats(prev => [newGroup, ...prev]);

    // Initial system message
    const welcomeMsg: Message = {
      id: 'msg_welcome_' + Date.now(),
      chatId: newGroupId,
      senderId: currentUser.id,
      type: 'text',
      content: `Welcome to ${newGroup.name}! 🎉 ${description ? `("${description}")` : ''}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600 * 1000,
      isRead: true,
      isOutgoing: true,
    };

    setMessages(prev => ({
      ...prev,
      [newGroupId]: [welcomeMsg],
    }));

    return newGroup;
  };

  const startCall = (user: User, type: 'voice' | 'video', chatId?: string) => {
    setIsVideoEnabled(type === 'video');
    setCurrentCall({
      callId: 'call_' + Date.now(),
      chatId: chatId || 'chat_1',
      user,
      type,
      status: 'connected',
      startedAt: Date.now(),
      durationSeconds: 0,
    });
  };

  const endCall = () => {
    setCurrentCall(null);
  };

  const toggleMute = () => setIsMuted(prev => !prev);
  const toggleSpeaker = () => setIsSpeaker(prev => !prev);
  const toggleVideo = () => setIsVideoEnabled(prev => !prev);

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        activeChatId,
        setActiveChatId,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        sendMessage,
        sendVoiceMessage,
        sendAttachment,
        createGroup,
        getChatById,
        getUserById,
        currentCall,
        startCall,
        endCall,
        isMuted,
        toggleMute,
        isSpeaker,
        toggleSpeaker,
        isVideoEnabled,
        toggleVideo,
        callDuration,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

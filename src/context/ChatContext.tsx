import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Chat, Message, MessageType, User, CallSession } from '../types';
import { INITIAL_CHATS, INITIAL_MESSAGES, MOCK_USERS } from '../constants/mockData';
import { useAuth } from './AuthContext';
import { socketService } from '../services/socketService';
import { chatService } from '../services/chatService';
import { messageService } from '../services/messageService';
import { callService } from '../services/callService';

interface ChatContextType {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  activeTab: 'chats' | 'groups' | 'calls';
  setActiveTab: (tab: 'chats' | 'groups' | 'calls') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sendMessage: (chatId: string, content: string, type?: MessageType, mediaUrl?: string) => Promise<void>;
  sendVoiceMessage: (chatId: string, duration?: string, waveform?: number[], audioUrl?: string) => void;
  sendAttachment: (chatId: string, type: MessageType, content: string, mediaUrl?: string, fileName?: string) => void;
  createGroup: (name: string, description: string, memberIds: string[], avatar?: string) => Promise<Chat>;
  getChatById: (id: string) => Chat | undefined;
  getUserById: (id: string) => User | undefined;
  
  // Real-Time Socket state
  isSocketConnected: boolean;

  // Call simulation & WebRTC
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
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Call state
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<number | null>(null);

  // Connect to real-time Socket.IO server on mount/auth
  useEffect(() => {
    if (currentUser?.id) {
      socketService.connect(currentUser.id).then((sock) => {
        setIsSocketConnected(!!sock?.connected);
      });

      // Socket event: incoming real-time message
      const handleNewMessage = (msg: any) => {
        const chatId = msg.chat_id || msg.chatId;
        if (!chatId) return;

        const mapped: Message = {
          id: msg.id,
          chatId,
          senderId: msg.sender_id || msg.senderId,
          type: msg.message_type || msg.type || 'text',
          content: msg.content,
          mediaUrl: msg.file_url || msg.mediaUrl,
          fileName: msg.file_name || msg.fileName,
          createdAt: new Date(msg.created_at || Date.now()).getTime(),
          expiresAt: new Date(msg.expires_at || Date.now() + 24 * 3600 * 1000).getTime(),
          isRead: false,
          isOutgoing: (msg.sender_id || msg.senderId) === currentUser.id,
        };

        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []).filter((m) => m.id !== mapped.id), mapped],
        }));

        // Update chat list snippet
        setChats((prev) =>
          prev.map((c) => {
            if (c.id === chatId) {
              return {
                ...c,
                lastMessage: {
                  text: mapped.content,
                  senderId: mapped.senderId,
                  timestamp: 'Just now',
                  type: mapped.type,
                  isRead: false,
                },
                unreadCount: mapped.isOutgoing ? c.unreadCount : c.unreadCount + 1,
                updatedAt: Date.now(),
              };
            }
            return c;
          })
        );
      };

      // Socket event: typing indicator
      const handleTypingStart = (payload: any) => {
        if (payload.chatId) {
          setChats((prev) =>
            prev.map((c) => (c.id === payload.chatId ? { ...c, isTyping: true } : c))
          );
        }
      };

      const handleTypingStop = (payload: any) => {
        if (payload.chatId) {
          setChats((prev) =>
            prev.map((c) => (c.id === payload.chatId ? { ...c, isTyping: false } : c))
          );
        }
      };

      // Socket event: incoming call
      const handleCallOffer = (payload: any) => {
        const caller = MOCK_USERS.find((u) => u.id === payload.callerId) || {
          id: payload.callerId,
          name: 'Incoming Call',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          isOnline: true,
        };

        setCurrentCall({
          callId: 'call_' + Date.now(),
          chatId: payload.chatId || 'chat_1',
          user: caller,
          type: payload.type || 'voice',
          status: 'ringing',
          durationSeconds: 0,
        });
      };

      const handleCallEnd = () => {
        setCurrentCall(null);
      };

      socketService.on('new_message', handleNewMessage);
      socketService.on('typing_start', handleTypingStart);
      socketService.on('typing_stop', handleTypingStop);
      socketService.on('call_offer', handleCallOffer);
      socketService.on('call_end', handleCallEnd);

      return () => {
        socketService.off('new_message', handleNewMessage);
        socketService.off('typing_start', handleTypingStart);
        socketService.off('typing_stop', handleTypingStop);
        socketService.off('call_offer', handleCallOffer);
        socketService.off('call_end', handleCallEnd);
      };
    }
  }, [currentUser?.id]);

  // Join active chat room when switching conversation
  useEffect(() => {
    if (activeChatId) {
      chatService.joinChatRoom(activeChatId);
    }
    return () => {
      if (activeChatId) {
        chatService.leaveChatRoom(activeChatId);
      }
    };
  }, [activeChatId]);

  // Persist local cache
  useEffect(() => {
    localStorage.setItem('wchat_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('wchat_messages', JSON.stringify(messages));
  }, [messages]);

  // Call timer effect
  useEffect(() => {
    if (currentCall) {
      callTimerRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
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
    return MOCK_USERS.find((u) => u.id === id);
  };

  const getChatById = (id: string): Chat | undefined => {
    return chats.find((c) => c.id === id);
  };

  // SEND MESSAGE
  const sendMessage = async (
    chatId: string,
    content: string,
    type: MessageType = 'text',
    mediaUrl?: string
  ) => {
    if (!content.trim() && !mediaUrl) return;

    // Send through messageService (Socket.IO + Supabase)
    const newMsg = await messageService.sendMessage({
      chatId,
      senderId: currentUser.id,
      content,
      type,
      mediaUrl,
    });

    // Update local state immediately
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: {
              text: type === 'text' ? content : `📎 ${content}`,
              senderId: currentUser.id,
              timestamp: 'Just now',
              type,
              isRead: false,
            },
            updatedAt: Date.now(),
          };
        }
        return c;
      })
    );

    // Auto-respond simulation after 1.5 seconds if chatting with Sarah or Ahmed locally
    if ((chatId === 'chat_1' || chatId === 'chat_2') && !socketService.isConnected()) {
      setTimeout(() => {
        const partner = chatId === 'chat_1' ? MOCK_USERS[0] : MOCK_USERS[1];
        const replies = [
          "Got your message! Looks super smooth 💜",
          "Awesome! Everything is saved in Supabase & Socket.IO ✨",
          "That sounds great, let's meet later!",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg: Message = {
          id: 'reply_' + Date.now(),
          chatId,
          senderId: partner.id,
          type: 'text',
          content: randomReply,
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 3600 * 1000,
          isRead: true,
          isOutgoing: false,
        };

        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), replyMsg],
        }));

        setChats((prev) =>
          prev.map((c) => {
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

  const sendVoiceMessage = (
    chatId: string,
    duration = '0:07',
    waveform?: number[],
    audioUrl?: string
  ) => {
    const defaultWaveform = [25, 45, 80, 50, 90, 70, 30, 85, 95, 60, 40, 75, 55, 90, 35];
    const now = Date.now();

    const newMessage: Message = {
      id: 'voice_' + Date.now(),
      chatId,
      senderId: currentUser.id,
      type: 'voice',
      content: 'Voice message',
      mediaUrl: audioUrl,
      voiceDuration: duration,
      voiceWaveform: waveform || defaultWaveform,
      createdAt: now,
      expiresAt: now + 24 * 3600 * 1000,
      isRead: false,
      isOutgoing: true,
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    setChats((prev) =>
      prev.map((c) => {
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

  const sendAttachment = (
    chatId: string,
    type: MessageType,
    content: string,
    mediaUrl?: string,
    fileName?: string
  ) => {
    const now = Date.now();
    const newMessage: Message = {
      id: 'att_' + Date.now(),
      chatId,
      senderId: currentUser.id,
      type,
      content,
      mediaUrl,
      fileName,
      createdAt: now,
      expiresAt: now + 24 * 3600 * 1000,
      isRead: false,
      isOutgoing: true,
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    setChats((prev) =>
      prev.map((c) => {
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

  const createGroup = async (
    name: string,
    description: string,
    memberIds: string[],
    avatar?: string
  ): Promise<Chat> => {
    const createdChat = await chatService.createGroupChat(name, memberIds, avatar);

    const newGroup: Chat = createdChat || {
      id: 'group_' + Date.now(),
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

    setChats((prev) => [newGroup, ...prev]);

    // Initial system message
    const welcomeMsg: Message = {
      id: 'msg_welcome_' + Date.now(),
      chatId: newGroup.id,
      senderId: currentUser.id,
      type: 'text',
      content: `Welcome to ${newGroup.name}! 🎉 ${description ? `("${description}")` : ''}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600 * 1000,
      isRead: true,
      isOutgoing: true,
    };

    setMessages((prev) => ({
      ...prev,
      [newGroup.id]: [welcomeMsg],
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

    callService.initiateCall(user, type, chatId || 'chat_1');
  };

  const endCall = () => {
    if (currentCall) {
      callService.endCall(currentCall.user.id, currentCall.chatId);
    }
    setCurrentCall(null);
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    callService.toggleMute(nextState);
  };

  const toggleSpeaker = () => setIsSpeaker((prev) => !prev);

  const toggleVideo = () => {
    const nextState = !isVideoEnabled;
    setIsVideoEnabled(nextState);
    callService.toggleVideo(nextState);
  };

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
        isSocketConnected,
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

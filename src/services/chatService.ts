/**
 * @file chatService.ts
 * Future Backend Integration: Supabase Database + Socket.IO
 * Ready for Socket.IO real-time channels:
 * - socket.emit('join_chat', chatId)
 * - socket.on('typing_status', ...)
 * - socket.on('user_presence', ...)
 */

import { Chat } from '../types';

export const chatService = {
  async getChats(_userId: string): Promise<Chat[]> {
    console.log('[chatService] getChats mock');
    return [];
  },

  async createChat(participantIds: string[], type: 'direct' | 'group', name?: string): Promise<Chat> {
    console.log('[chatService] createChat mock:', { participantIds, type, name });
    return {
      id: 'chat_' + Date.now(),
      type,
      name: name || 'Chat',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      participantIds,
      unreadCount: 0,
      updatedAt: Date.now(),
    };
  },

  joinChatRoom(chatId: string) {
    console.log('[chatService] Socket.IO joinChatRoom:', chatId);
  },

  leaveChatRoom(chatId: string) {
    console.log('[chatService] Socket.IO leaveChatRoom:', chatId);
  },

  emitTyping(chatId: string, isTyping: boolean) {
    console.log('[chatService] Socket.IO emitTyping:', { chatId, isTyping });
  },
};

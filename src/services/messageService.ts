/**
 * @file messageService.ts
 * Future Backend Integration: Supabase Database + Storage + Socket.IO
 * Ready for:
 * - socket.emit('send_message', payload)
 * - socket.on('new_message', ...)
 * - Supabase Storage bucket 'wchat-attachments' for photos, audio, documents
 * - Cron/Server 24-hour auto-deletion
 */

import { Message, MessageType } from '../types';

export const messageService = {
  async fetchMessages(_chatId: string): Promise<Message[]> {
    console.log('[messageService] fetchMessages mock');
    return [];
  },

  async sendMessage(payload: {
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    mediaUrl?: string;
  }): Promise<Message> {
    console.log('[messageService] sendMessage via Socket.IO:', payload);
    const now = Date.now();
    return {
      id: 'msg_' + Date.now(),
      chatId: payload.chatId,
      senderId: payload.senderId,
      type: payload.type,
      content: payload.content,
      mediaUrl: payload.mediaUrl,
      createdAt: now,
      expiresAt: now + 24 * 3600 * 1000,
      isRead: false,
      isOutgoing: true,
    };
  },

  async uploadAttachment(file: Blob, fileType: string): Promise<string> {
    console.log('[messageService] uploadAttachment to Supabase Storage:', fileType, file);
    // Future: const { data, error } = await supabase.storage.from('attachments').upload(...)
    return URL.createObjectURL(file);
  },

  async deleteExpiredMessages(): Promise<number> {
    // Future backend cron query: DELETE FROM messages WHERE expires_at < NOW()
    console.log('[messageService] 24-hour message cleanup executed on server');
    return 0;
  },
};

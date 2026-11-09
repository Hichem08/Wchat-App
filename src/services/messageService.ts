import { supabase, isSupabaseConfigured } from './supabaseClient';
import { socketService } from './socketService';
import { Message, MessageType } from '../types';

export const messageService = {
  async fetchMessages(chatId: string, limit: number = 30, beforeTimestamp?: string): Promise<Message[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const now = new Date().toISOString();
      let query = supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .is('deleted_at', null)
        .gt('expires_at', now) // Filter out expired 24h messages
        .order('created_at', { ascending: false })
        .limit(limit);

      if (beforeTimestamp) {
        query = query.lt('created_at', beforeTimestamp);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      return data.reverse().map((m: any) => ({
        id: m.id,
        chatId: m.chat_id,
        senderId: m.sender_id,
        type: m.message_type as MessageType,
        content: m.content,
        mediaUrl: m.file_url,
        fileName: m.file_name,
        fileSize: m.file_size ? `${(m.file_size / 1024 / 1024).toFixed(1)} MB` : undefined,
        createdAt: new Date(m.created_at).getTime(),
        expiresAt: new Date(m.expires_at).getTime(),
        isRead: m.is_read,
        isOutgoing: m.sender_id === currentUserId,
      }));
    } catch {
      return [];
    }
  },

  async sendMessage(payload: {
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: number;
    voiceDuration?: string;
    voiceWaveform?: number[];
  }): Promise<Message> {
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000;

    const localMessage: Message = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      chatId: payload.chatId,
      senderId: payload.senderId,
      type: payload.type,
      content: payload.content,
      mediaUrl: payload.mediaUrl,
      fileName: payload.fileName,
      voiceDuration: payload.voiceDuration,
      voiceWaveform: payload.voiceWaveform,
      createdAt: now,
      expiresAt,
      isRead: false,
      isOutgoing: true,
    };

    // Broadcast through Socket.IO real-time server
    socketService.sendMessage({
      chatId: payload.chatId,
      content: payload.content,
      messageType: payload.type,
      fileUrl: payload.mediaUrl,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
    });

    // Also persist directly if Supabase is connected
    if (isSupabaseConfigured()) {
      supabase.from('messages').insert({
        id: localMessage.id.startsWith('msg_') ? undefined : localMessage.id,
        chat_id: payload.chatId,
        sender_id: payload.senderId,
        content: payload.content,
        message_type: payload.type,
        file_url: payload.mediaUrl,
        file_name: payload.fileName,
        file_size: payload.fileSize,
        created_at: new Date(now).toISOString(),
        expires_at: new Date(expiresAt).toISOString(),
        is_read: false,
      }).then();
    }

    return localMessage;
  },

  markAsRead(chatId: string, messageId: string) {
    if (socketService.isConnected()) {
      socketService.on('message_read', () => {});
    }
    if (isSupabaseConfigured()) {
      supabase.from('messages').update({ is_read: true }).eq('id', messageId).then();
    }
  },
};

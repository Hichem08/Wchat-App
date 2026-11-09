export type Language = 'en' | 'fr' | 'ar';
export type ThemeMode = 'dark' | 'light';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  matricule?: string;
  avatar: string;
  isOnline: boolean;
  statusText?: string;
  lastSeen?: string;
}

export type MessageType = 'text' | 'voice' | 'image' | 'file' | 'location';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string; // text or file url or description
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  voiceDuration?: string;
  voiceWaveform?: number[];
  createdAt: number; // timestamp ms
  expiresAt: number; // timestamp ms (24 hours after creation)
  isRead: boolean;
  isOutgoing: boolean;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  participantIds: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: string;
    type: MessageType;
    isRead: boolean;
  };
  unreadCount: number;
  isOnline?: boolean;
  isTyping?: boolean;
  updatedAt: number;
}

export interface CallSession {
  callId: string;
  chatId: string;
  user: User;
  type: 'voice' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  startedAt?: number;
  durationSeconds: number;
}

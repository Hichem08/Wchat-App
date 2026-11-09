/**
 * @file socketEvents.ts
 * Centralized Socket.IO event name constants and payload types
 */

export const SOCKET_EVENTS = {
  // Connection & Auth
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  UNAUTHORIZED: 'unauthorized',

  // Chat Rooms
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',

  // Messages
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  MESSAGE_DELIVERED: 'message_delivered',
  MESSAGE_READ: 'message_read',

  // Typing
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',

  // Presence
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',

  // Friend System
  FRIEND_REQUEST: 'friend_request',
  FRIEND_REQUEST_ACCEPTED: 'friend_request_accepted',

  // Notifications
  NOTIFICATION: 'notification',

  // WebRTC Signaling
  CALL_OFFER: 'call_offer',
  CALL_ANSWER: 'call_answer',
  ICE_CANDIDATE: 'ice_candidate',
  CALL_END: 'call_end',
} as const;

export type SocketEventName = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

export interface SendMessagePayload {
  chatId: string;
  content: string;
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'voice' | 'file' | 'pdf' | 'location';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  replyToMessageId?: string;
}

export interface TypingPayload {
  chatId: string;
  userId: string;
  userName: string;
}

export interface CallSignalPayload {
  targetUserId: string;
  callerId: string;
  chatId: string;
  type: 'voice' | 'video';
  sdp?: any;
  candidate?: any;
  status?: string;
}

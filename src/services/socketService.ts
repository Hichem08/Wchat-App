import { io, Socket } from 'socket.io-client';
import { supabase } from './supabaseClient';

const SOCKET_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SOCKET_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SOCKET_URL) ||
  'http://localhost:4000';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private listeners: Map<string, Set<Function>> = new Map();

  async connect(customUserId?: string): Promise<Socket | null> {
    if (this.socket?.connected) return this.socket;
    if (this.isConnecting) return null;

    this.isConnecting = true;

    try {
      // Get current Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      this.socket = io(SOCKET_URL, {
        auth: {
          token,
          userId: customUserId || session?.user?.id || 'dev_user',
        },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 10000,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('[SocketService] Connected to real-time server:', SOCKET_URL);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[SocketService] Disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        // Expected when local server is not running during local-only testing
        console.warn('[SocketService] Connection notice:', error.message);
      });

      return this.socket;
    } catch (err: any) {
      console.error('[SocketService Connect Error]:', err.message);
      return null;
    } finally {
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_chat', chatId);
    }
  }

  leaveChat(chatId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave_chat', chatId);
    }
  }

  sendMessage(payload: any, callback?: (res: any) => void) {
    if (this.socket?.connected) {
      this.socket.emit('send_message', payload, callback);
    } else {
      callback?.({ success: true, localOnly: true });
    }
  }

  emitTyping(chatId: string, isTyping: boolean, userName: string) {
    if (this.socket?.connected) {
      const event = isTyping ? 'typing_start' : 'typing_stop';
      this.socket.emit(event, { chatId, userName });
    }
  }

  emitCallOffer(payload: any) {
    if (this.socket?.connected) {
      this.socket.emit('call_offer', payload);
    }
  }

  emitCallAnswer(payload: any) {
    if (this.socket?.connected) {
      this.socket.emit('call_answer', payload);
    }
  }

  emitIceCandidate(payload: any) {
    if (this.socket?.connected) {
      this.socket.emit('ice_candidate', payload);
    }
  }

  emitCallEnd(payload: any) {
    if (this.socket?.connected) {
      this.socket.emit('call_end', payload);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    this.listeners.get(event)?.delete(callback);
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

export const socketService = new SocketService();

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { socketService } from './socketService';
import { Chat } from '../types';
import { INITIAL_CHATS } from '../constants/mockData';

export const chatService = {
  async getChats(userId: string): Promise<Chat[]> {
    if (!isSupabaseConfigured()) {
      return INITIAL_CHATS;
    }

    try {
      const { data: memberships, error } = await supabase
        .from('chat_members')
        .select(`
          chat_id,
          chat:chats(
            id,
            type,
            name,
            avatar_url,
            created_at,
            updated_at,
            members:chat_members(
              user_id,
              profile:profiles(id, full_name, avatar_url, is_online)
            )
          )
        `)
        .eq('user_id', userId);

      if (error || !memberships) return INITIAL_CHATS;

      return memberships
        .map((m: any) => m.chat)
        .filter(Boolean)
        .map((c: any) => {
          const isDirect = c.type === 'private';
          const otherMember = c.members?.find((mem: any) => mem.user_id !== userId)?.profile;

          return {
            id: c.id,
            type: isDirect ? 'direct' : 'group',
            name: isDirect && otherMember ? otherMember.full_name : c.name || 'Conversation',
            avatar: isDirect && otherMember ? otherMember.avatar_url : c.avatar_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
            participantIds: (c.members || []).map((mem: any) => mem.user_id),
            unreadCount: 0,
            isOnline: isDirect && otherMember ? otherMember.is_online : true,
            updatedAt: new Date(c.updated_at || c.created_at).getTime(),
          };
        });
    } catch {
      return INITIAL_CHATS;
    }
  },

  async createPrivateChat(otherUserId: string): Promise<string | null> {
    if (!isSupabaseConfigured()) return 'chat_1';

    try {
      const { data, error } = await supabase.rpc('get_or_create_private_chat', {
        other_user_id: otherUserId,
      });

      if (error) return null;
      return data;
    } catch {
      return null;
    }
  },

  async createGroupChat(name: string, memberIds: string[], avatarUrl?: string): Promise<Chat | null> {
    if (!isSupabaseConfigured()) {
      return {
        id: 'group_' + Date.now(),
        type: 'group',
        name,
        avatar: avatarUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
        participantIds: memberIds,
        unreadCount: 0,
        updatedAt: Date.now(),
      };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          type: 'group',
          name,
          avatar_url: avatarUrl,
          created_by: user.id,
        })
        .select()
        .single();

      if (chatError || !newChat) return null;

      // Add all members
      const allMembers = Array.from(new Set([user.id, ...memberIds]));
      const memberRows = allMembers.map(uid => ({
        chat_id: newChat.id,
        user_id: uid,
        role: uid === user.id ? 'admin' : 'member',
      }));

      await supabase.from('chat_members').insert(memberRows);

      return {
        id: newChat.id,
        type: 'group',
        name: newChat.name,
        avatar: newChat.avatar_url,
        participantIds: allMembers,
        unreadCount: 0,
        updatedAt: Date.now(),
      };
    } catch {
      return null;
    }
  },

  joinChatRoom(chatId: string) {
    socketService.joinChat(chatId);
  },

  leaveChatRoom(chatId: string) {
    socketService.leaveChat(chatId);
  },

  emitTyping(chatId: string, isTyping: boolean, userName: string) {
    socketService.emitTyping(chatId, isTyping, userName);
  },
};

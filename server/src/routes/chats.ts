import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseServer } from '../config/supabase.js';

export const chatsRouter = Router();

// GET /api/chats - Get user's active chats
chatsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch chat IDs user belongs to
    const { data: memberships, error: memError } = await supabaseServer
      .from('chat_members')
      .select('chat_id')
      .eq('user_id', userId);

    if (memError) {
      return res.status(500).json({ error: memError.message });
    }

    const chatIds = (memberships || []).map(m => m.chat_id);
    if (chatIds.length === 0) {
      return res.json({ chats: [] });
    }

    // Fetch chat details
    const { data: chats, error: chatsError } = await supabaseServer
      .from('chats')
      .select(`
        id,
        type,
        name,
        avatar_url,
        created_at,
        updated_at,
        members:chat_members(
          user_id,
          role,
          profile:profiles(id, full_name, username, matricule, avatar_url, is_online, last_seen)
        )
      `)
      .in('id', chatIds)
      .order('updated_at', { ascending: false });

    if (chatsError) {
      return res.status(500).json({ error: chatsError.message });
    }

    res.json({ chats: chats || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chats - Create private or group chat
chatsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserId = req.user!.id;
    const { type = 'private', name, avatarUrl, memberIds = [] } = req.body;

    if (type === 'private') {
      const otherUserId = memberIds[0];
      if (!otherUserId) {
        return res.status(400).json({ error: 'Private chat requires a recipient user ID' });
      }

      // Check existing private chat
      const { data: existingChatId, error: rpcError } = await supabaseServer
        .rpc('get_or_create_private_chat', { other_user_id: otherUserId });

      if (!rpcError && existingChatId) {
        return res.json({ chatId: existingChatId, type: 'private' });
      }
    }

    // Create group chat
    const { data: newChat, error: chatError } = await supabaseServer
      .from('chats')
      .insert({
        type,
        name: name || 'New Group',
        avatar_url: avatarUrl,
        created_by: currentUserId,
      })
      .select()
      .single();

    if (chatError || !newChat) {
      return res.status(500).json({ error: chatError?.message || 'Failed to create chat' });
    }

    // Add members
    const allMembers = Array.from(new Set([currentUserId, ...memberIds]));
    const memberInserts = allMembers.map(uid => ({
      chat_id: newChat.id,
      user_id: uid,
      role: uid === currentUserId ? 'admin' : 'member',
    }));

    await supabaseServer.from('chat_members').insert(memberInserts);

    res.json({ chat: newChat });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chats/:id/messages - Paginated message retrieval (respects 24h expiration)
chatsRouter.get('/:id/messages', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const chatId = req.params.id;
    const limit = parseInt(req.query.limit as string || '30', 10);
    const before = req.query.before as string;

    const now = new Date().toISOString();
    let query = supabaseServer
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .is('deleted_at', null)
      .gt('expires_at', now) // Never return expired 24h messages
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data: messages, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Return in chronological order
    res.json({ messages: (messages || []).reverse() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

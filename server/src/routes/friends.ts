import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseServer } from '../config/supabase.js';

export const friendsRouter = Router();

// GET /api/friends - List all accepted friends and pending requests
friendsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch friendships
    const { data: friendships, error } = await supabaseServer
      .from('friendships')
      .select(`
        id,
        status,
        requester_id,
        receiver_id,
        created_at,
        requester:profiles!requester_id(id, full_name, username, matricule, avatar_url, is_online, last_seen),
        receiver:profiles!receiver_id(id, full_name, username, matricule, avatar_url, is_online, last_seen)
      `)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const friends: any[] = [];
    const pendingIncoming: any[] = [];
    const pendingOutgoing: any[] = [];

    (friendships || []).forEach(f => {
      const isRequester = f.requester_id === userId;
      const otherUser = isRequester ? f.receiver : f.requester;

      if (f.status === 'accepted') {
        friends.push({ friendshipId: f.id, ...otherUser });
      } else if (f.status === 'pending') {
        if (isRequester) {
          pendingOutgoing.push({ friendshipId: f.id, ...otherUser });
        } else {
          pendingIncoming.push({ friendshipId: f.id, ...otherUser });
        }
      }
    });

    res.json({ friends, pendingIncoming, pendingOutgoing });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/friends/request - Send friend request
friendsRouter.post('/request', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requesterId = req.user!.id;
    const { receiverId } = req.body;

    if (!receiverId || receiverId === requesterId) {
      return res.status(400).json({ error: 'Invalid receiver ID' });
    }

    const { data, error } = await supabaseServer
      .from('friendships')
      .upsert(
        { requester_id: requesterId, receiver_id: receiverId, status: 'pending', updated_at: new Date().toISOString() },
        { onConflict: 'requester_id,receiver_id' }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, friendship: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/friends/accept - Accept friend request
friendsRouter.post('/accept', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { friendshipId } = req.body;

    const { data, error } = await supabaseServer
      .from('friendships')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', friendshipId)
      .eq('receiver_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, friendship: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

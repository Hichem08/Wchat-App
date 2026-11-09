import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseServer } from '../config/supabase.js';

export const profileRouter = Router();

// GET /api/profile - Fetch current user's profile
profileRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { data: profile, error } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    res.json({ profile: profile || { id: userId, email: req.user!.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/profile - Update current user's profile
profileRouter.patch('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { full_name, bio, phone, matricule, avatar_url, language } = req.body;

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (full_name !== undefined) updates.full_name = full_name;
    if (bio !== undefined) updates.bio = bio;
    if (phone !== undefined) updates.phone = phone;
    if (matricule !== undefined) updates.matricule = matricule;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (language !== undefined) updates.language = language;

    const { data: updated, error } = await supabaseServer
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ profile: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/search - Search users by name, matricule, phone, or username
profileRouter.get('/search', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = (req.query.q as string || '').trim();
    if (!query) {
      return res.json({ users: [] });
    }

    const { data: users, error } = await supabaseServer
      .from('profiles')
      .select('id, full_name, username, matricule, phone, avatar_url, is_online, last_seen')
      .or(`full_name.ilike.%${query}%,matricule.ilike.%${query}%,username.ilike.%${query}%,phone.ilike.%${query}%`)
      .neq('id', req.user!.id)
      .limit(20);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ users: users || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

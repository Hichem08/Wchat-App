import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import { supabaseServer } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

/**
 * Express REST authentication middleware
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired Supabase authentication token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (err: any) {
    console.error('[Auth Middleware Error]:', err.message);
    return res.status(500).json({ error: 'Internal authentication error' });
  }
}

/**
 * Socket.IO handshake authentication middleware
 * Verifies Supabase JWT token and extracts authenticated user ID
 */
export async function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      // In development / demo mode allow fallback if no token provided
      const devUserId = socket.handshake.auth?.userId;
      if (devUserId) {
        socket.data.user = { id: devUserId, email: 'dev@wchat.app' };
        return next();
      }
      return next(new Error('Authentication error: Missing token'));
    }

    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) {
      return next(new Error('Authentication error: Invalid Supabase token'));
    }

    socket.data.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (err: any) {
    next(new Error(`Authentication failed: ${err.message}`));
  }
}

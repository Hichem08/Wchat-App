/**
 * @file messageCleanupJob.ts
 * Background job that enforces 24-hour message expiration.
 * Deletes all messages whose expires_at timestamp is older than NOW().
 */

import { supabaseServer } from '../config/supabase.js';

export function startMessageCleanupJob(intervalMinutes: number = 10) {
  console.log(`[MessageCleanupJob] Initialized. Running every ${intervalMinutes} minutes.`);

  // Run once immediately on server startup
  executeCleanup();

  // Schedule recurring execution
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(executeCleanup, intervalMs);
}

async function executeCleanup() {
  try {
    const now = new Date().toISOString();

    // 1. Try calling the stored database function
    const { data, error } = await supabaseServer.rpc('cleanup_expired_messages');

    if (!error) {
      if (typeof data === 'number' && data > 0) {
        console.log(`[MessageCleanupJob] Auto-deleted ${data} expired (24h+) messages via RPC.`);
      }
      return;
    }

    // 2. Fallback direct SQL query via PostgREST
    const { count, error: deleteError } = await supabaseServer
      .from('messages')
      .delete({ count: 'exact' })
      .lt('expires_at', now);

    if (deleteError) {
      // Expected if Supabase is offline/not yet configured
      return;
    }

    if (count && count > 0) {
      console.log(`[MessageCleanupJob] Auto-deleted ${count} expired (24h+) messages.`);
    }
  } catch (err: any) {
    // Fail gracefully without crashing server
    console.error('[MessageCleanupJob Error]:', err.message);
  }
}

import { supabase } from './supabase';

/**
 * Fire an analytics event to Supabase.
 *
 * @param {string} eventName - Event name (e.g., 'first_score_viewed')
 * @param {object} properties - Event properties (will be stored as JSONB)
 * @param {string} userId - Optional Supabase user UUID
 *
 * Never throws. Fails silently if:
 * - Supabase is unavailable
 * - RLS policy rejects the insert
 * - Network error occurs
 *
 * Logs to console in development only.
 */
export async function fireEvent(eventName, properties = {}, userId = null) {
  try {
    const isDev = import.meta.env.DEV;

    if (isDev) {
      console.log(`[Analytics] ${eventName}`, properties);
    }

    // Don't await — fire and forget
    supabase
      .from('analytics_events')
      .insert({
        event_name: eventName,
        user_id: userId,
        properties: properties,
      })
      .catch((err) => {
        // Fail silently. In dev, log the error for debugging.
        if (isDev) {
          console.warn(`[Analytics] Failed to fire ${eventName}:`, err?.message);
        }
      });
  } catch (err) {
    // Outer try/catch for safety (should not happen, but defensive)
    if (import.meta.env.DEV) {
      console.warn(`[Analytics] Unexpected error in fireEvent:`, err?.message);
    }
  }
}

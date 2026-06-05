import { supabase } from './supabase';

export async function fireEvent(eventName, properties = {}, userId = null) {
  try {
    const { error } = await supabase.from('analytics_events').insert({
      event_name: eventName,
      user_id: userId || null,
      properties: properties
    });
    if (import.meta.env.DEV) {
      if (error) console.error('[Analytics] Insert error:', error);
      else console.log('[Analytics]', eventName, properties);
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error('[Analytics] Unexpected error in fireEvent:', err);
  }
}

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DeviceTracker({ user }) {
  useEffect(() => {
    if (!user?.id) return;

    const trackDevice = async () => {
      if (typeof window === 'undefined') return;

      const ua = navigator.userAgent;
      const isAndroid = /android/i.test(ua);
      const isIOS = /iphone|ipad|ipod/i.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      const deviceType = isAndroid ? 'android' : isIOS ? 'ios' : 'desktop';
      const deviceOS = isAndroid ? 'Android' : isIOS ? 'iOS'
        : /windows/i.test(ua) ? 'Windows'
        : /mac/i.test(ua) ? 'MacOS' : 'Other';

      try {
        console.log('[DeviceTracker] Attempting to track device:', { deviceType, deviceOS, userId: user.id });

        const { error } = await supabase
          .from('profiles')
          .update({
            device_type: deviceType,
            device_os: deviceOS,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.error('[DeviceTracker] Error updating device info:', error);
        } else {
          console.log('[DeviceTracker] Device tracked successfully:', deviceType);
        }
      } catch (err) {
        console.error('[DeviceTracker] Exception:', err);
      }
    };

    trackDevice();
  }, [user?.id]);

  return null; // invisible component
}

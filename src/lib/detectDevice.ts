export type DeviceType = 'android' | 'ios' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  os: string;
  browser: string;
  userAgent: string;
}

export function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return { type: 'desktop', os: 'Unknown', browser: 'Unknown', userAgent: '' };
  }

  const ua = navigator.userAgent;

  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const browser = /chrome/i.test(ua) ? 'Chrome'
    : /safari/i.test(ua) ? 'Safari'
    : /firefox/i.test(ua) ? 'Firefox'
    : /edge/i.test(ua) ? 'Edge'
    : 'Other';

  const os = isAndroid ? 'Android'
    : isIOS ? 'iOS'
    : /windows/i.test(ua) ? 'Windows'
    : /mac/i.test(ua) ? 'MacOS'
    : /linux/i.test(ua) ? 'Linux'
    : 'Unknown';

  const type: DeviceType = isAndroid ? 'android' : isIOS ? 'ios' : 'desktop';

  return { type, os, browser, userAgent: ua };
}

import { Platform } from 'react-native';

type AdsModule = typeof import('react-native-google-mobile-ads');

let adsModule: AdsModule | null | undefined;

/**
 * react-native-google-mobile-ads links native code that only exists in a custom dev/production
 * build — it isn't present on web or in Expo Go. Requiring it there throws synchronously (the
 * package resolves its native module at import time), so the require is wrapped defensively and
 * every call site here just no-ops when it fails instead of crashing the screen.
 */
function loadAdsModule(): AdsModule | null {
  if (adsModule !== undefined) return adsModule;
  if (Platform.OS === 'web') {
    adsModule = null;
    return adsModule;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    adsModule = require('react-native-google-mobile-ads') as AdsModule;
  } catch {
    adsModule = null;
  }
  return adsModule;
}

let initStarted = false;

/** Call once at app startup. Safe to call from anywhere; no-ops where ads aren't available. */
export function initAds(): void {
  if (initStarted) return;
  initStarted = true;
  const ads = loadAdsModule();
  if (!ads) return;
  // Non-personalized ads only: no IDFA/ATT prompt needed, matches the app's offline,
  // no-tracking posture from the App Store privacy declaration.
  ads.default().setRequestConfiguration({ maxAdContentRating: ads.MaxAdContentRating.PG });
  ads.default().initialize();
}

export function getAdsModule(): AdsModule | null {
  return loadAdsModule();
}

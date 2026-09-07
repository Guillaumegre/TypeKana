import { Platform } from 'react-native';
import { AD_UNITS } from '../config/adUnits';

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
  // The whole init is guarded: a failure here is an ads problem, never a reason for the
  // app itself to fail to start. initialize() also rejects rather than throwing, so it
  // needs its own catch to avoid an unhandled rejection at boot.
  try {
    // Non-personalized ads only: no IDFA/ATT prompt needed, matches the app's offline,
    // no-tracking posture from the App Store privacy declaration.
    ads.default().setRequestConfiguration({ maxAdContentRating: ads.MaxAdContentRating.PG });
    ads.default().initialize().catch(() => {});
  } catch {
    // Ads stay off for this session.
  }
}

export function getAdsModule(): AdsModule | null {
  return loadAdsModule();
}

type UnitKind = 'banner' | 'rewarded' | 'interstitial';

/**
 * Real unit in production, Google's test unit everywhere else. A development build must
 * never request a live unit: impressions and clicks from your own testing are invalid
 * traffic, and AdMob suspends accounts over it.
 */
export function adUnitId(ads: AdsModule, kind: UnitKind): string {
  const testId =
    kind === 'banner'
      ? ads.TestIds.BANNER
      : kind === 'rewarded'
        ? ads.TestIds.REWARDED
        : ads.TestIds.INTERSTITIAL;
  if (__DEV__) return testId;
  const platform = Platform.OS === 'ios' ? AD_UNITS.ios : AD_UNITS.android;
  return platform[kind] || testId;
}

/** How long to wait for an ad to load before giving the session away for free. */
const REWARDED_TIMEOUT_MS = 12000;

/**
 * Shows a rewarded ad and resolves true only once the reward is actually earned.
 *
 * Resolves false when ads aren't available at all (web, Expo Go) — callers are expected to
 * let the player through in that case rather than block them for an infrastructure problem.
 */
export function showRewardedAd(): Promise<boolean> {
  const ads = getAdsModule();
  if (!ads) return Promise.resolve(false);

  return new Promise((resolve) => {
    let settled = false;
    let earned = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      const rewarded = ads.RewardedAd.createForAdRequest(adUnitId(ads, 'rewarded'), {
        requestNonPersonalizedAdsOnly: true,
      });

      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        try {
          rewarded.removeAllListeners();
        } catch {}
        resolve(value);
      };

      rewarded.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
        rewarded.show().catch(() => finish(false));
      });
      rewarded.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => {
        earned = true;
      });
      // CLOSED fires whether or not the reward was earned, so it reports what actually happened.
      rewarded.addAdEventListener(ads.AdEventType.CLOSED, () => finish(earned));
      rewarded.addAdEventListener(ads.AdEventType.ERROR, () => finish(false));

      timer = setTimeout(() => finish(false), REWARDED_TIMEOUT_MS);
      rewarded.load();
    } catch {
      resolve(false);
    }
  });
}

/** How long to wait for an interstitial before letting the user move on without it. */
const INTERSTITIAL_TIMEOUT_MS = 8000;

/**
 * Shows a full-screen ad, resolving once it is closed — or immediately if it can't load.
 *
 * It never reports failure, because the caller's next step is navigation: an ad that
 * doesn't load must not delay or block the screen the user asked for.
 */
export function showInterstitialAd(): Promise<void> {
  const ads = getAdsModule();
  if (!ads) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      const interstitial = ads.InterstitialAd.createForAdRequest(adUnitId(ads, 'interstitial'), {
        requestNonPersonalizedAdsOnly: true,
      });

      const finish = () => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        try {
          interstitial.removeAllListeners();
        } catch {}
        resolve();
      };

      interstitial.addAdEventListener(ads.AdEventType.LOADED, () => {
        interstitial.show().catch(finish);
      });
      interstitial.addAdEventListener(ads.AdEventType.CLOSED, finish);
      interstitial.addAdEventListener(ads.AdEventType.ERROR, finish);

      timer = setTimeout(finish, INTERSTITIAL_TIMEOUT_MS);
      interstitial.load();
    } catch {
      resolve();
    }
  });
}

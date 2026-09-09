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

/**
 * Google requires a certified CMP (the UMP SDK, wrapped here by `AdsConsent`) to gather
 * consent before any ad — personalized or not — is requested from users in the EEA/UK.
 * This starts false and only flips true once consent has actually been resolved, so a
 * screen that renders before init finishes correctly shows no ads rather than jumping
 * ahead of the user's choice.
 */
let canRequestAdsFlag = false;
// Whether the "Confidentialité des annonces" settings row should offer to reopen the
// consent form — true only for users where GDPR requires giving them that ongoing choice.
let privacyOptionsRequiredFlag = false;
const consentListeners = new Set<() => void>();

function notifyConsentListeners(): void {
  consentListeners.forEach((listener) => listener());
}

/** Whether consent has been resolved (or wasn't required) and ads may be requested. */
export function canRequestAds(): boolean {
  return canRequestAdsFlag;
}

export function privacyOptionsRequired(): boolean {
  return privacyOptionsRequiredFlag;
}

/** For components that need to re-render once consent resolves — see AdBanner. */
export function subscribeToConsent(listener: () => void): () => void {
  consentListeners.add(listener);
  return () => consentListeners.delete(listener);
}

/** Lets the settings screen reopen the UMP privacy-options form on demand. */
export async function showAdsPrivacyOptions(): Promise<void> {
  const ads = getAdsModule();
  if (!ads) return;
  try {
    await ads.AdsConsent.showPrivacyOptionsForm();
  } catch {
    // Nothing to do — the row stays visible, the user can try again later.
  }
}

/** Call once at app startup. Safe to call from anywhere; no-ops where ads aren't available. */
export function initAds(): void {
  if (initStarted) return;
  initStarted = true;
  const ads = loadAdsModule();
  if (!ads) return;
  try {
    // Non-personalized ads only: no IDFA/ATT prompt needed, matches the app's offline,
    // no-tracking posture from the App Store privacy declaration.
    ads.default().setRequestConfiguration({ maxAdContentRating: ads.MaxAdContentRating.PG });
  } catch {
    // Ads stay off for this session.
  }
  gatherConsentThenInit(ads);
}

/**
 * Requests up-to-date consent info, shows the UMP form if required, then only starts the
 * Mobile Ads SDK (and unlocks ad requests) once consent is settled. Every step is guarded
 * the same way as the rest of this file: a failure here is an ads problem, never a reason
 * for the app to fail to start, and `initialize()`/`gatherConsent()` reject rather than
 * throw, so each needs its own catch to avoid an unhandled rejection at boot.
 */
async function gatherConsentThenInit(ads: AdsModule): Promise<void> {
  try {
    await ads.AdsConsent.gatherConsent();
  } catch {
    // Consent gathering failed (e.g. no network) — fall back to whatever was resolved
    // in a previous session below, per Google's own guidance for this case.
  }
  let allowed = false;
  try {
    const info = await ads.AdsConsent.getConsentInfo();
    allowed = info.canRequestAds;
    privacyOptionsRequiredFlag =
      info.privacyOptionsRequirementStatus === ads.AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
  } catch {
    allowed = false;
  }
  canRequestAdsFlag = allowed;
  notifyConsentListeners();
  if (!allowed) return;
  try {
    await ads.default().initialize();
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
 * 'earned'      — the reward was granted, the user held up their end.
 * 'dismissed'   — the user closed the ad before earning it. Their choice.
 * 'unavailable' — nothing could be shown: no module, no fill, network down, timeout.
 *
 * The distinction matters: a user who never got an ad to watch must not be punished for
 * our ad network failing, whereas one who skipped it simply didn't earn anything.
 */
export type RewardedOutcome = 'earned' | 'dismissed' | 'unavailable';

export function showRewardedAd(): Promise<RewardedOutcome> {
  const ads = getAdsModule();
  if (!ads || !canRequestAds()) return Promise.resolve('unavailable');

  return new Promise((resolve) => {
    let settled = false;
    let earned = false;
    let shown = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      const rewarded = ads.RewardedAd.createForAdRequest(adUnitId(ads, 'rewarded'), {
        requestNonPersonalizedAdsOnly: true,
      });

      const finish = (value: RewardedOutcome) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        try {
          rewarded.removeAllListeners();
        } catch {}
        resolve(value);
      };

      rewarded.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
        shown = true;
        rewarded.show().catch(() => finish('unavailable'));
      });
      rewarded.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => {
        earned = true;
      });
      // CLOSED fires whether or not the reward was earned, so it reports what actually
      // happened; it only counts as a dismissal if an ad really did appear.
      rewarded.addAdEventListener(ads.AdEventType.CLOSED, () =>
        finish(earned ? 'earned' : shown ? 'dismissed' : 'unavailable'),
      );
      rewarded.addAdEventListener(ads.AdEventType.ERROR, () => finish('unavailable'));

      timer = setTimeout(() => finish('unavailable'), REWARDED_TIMEOUT_MS);
      rewarded.load();
    } catch {
      resolve('unavailable');
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
  if (!ads || !canRequestAds()) return Promise.resolve();

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

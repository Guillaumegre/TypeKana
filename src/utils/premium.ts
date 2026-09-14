import { Platform } from 'react-native';
import { PREMIUM_ENTITLEMENT_ID, REVENUECAT_API_KEYS } from '../config/revenueCat';

// The `Purchases` default export is the singleton with .configure/.getCustomerInfo/etc —
// that's what every call site below needs, not the module namespace itself.
type PurchasesAPI = (typeof import('react-native-purchases'))['default'];
type PurchasesUIModule = typeof import('react-native-purchases-ui');

let purchasesModule: PurchasesAPI | null | undefined;
let purchasesUIModule: PurchasesUIModule | null | undefined;

/**
 * Same defensive-require pattern as src/utils/ads.ts: react-native-purchases links
 * native code that only exists in a custom dev/production build, and resolves its
 * native module at import time — requiring it on web, in Expo Go, or before an API key
 * exists would throw synchronously. Every call site here no-ops instead of crashing.
 */
function apiKeyFor(platform: typeof Platform.OS): string {
  if (platform === 'ios') return REVENUECAT_API_KEYS.ios;
  if (platform === 'android') return REVENUECAT_API_KEYS.android;
  return '';
}

function loadPurchases(): PurchasesAPI | null {
  if (purchasesModule !== undefined) return purchasesModule;
  if (Platform.OS === 'web' || !apiKeyFor(Platform.OS)) {
    purchasesModule = null;
    return purchasesModule;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    purchasesModule = require('react-native-purchases').default as PurchasesAPI;
  } catch {
    purchasesModule = null;
  }
  return purchasesModule;
}

function loadPurchasesUI(): PurchasesUIModule | null {
  if (purchasesUIModule !== undefined) return purchasesUIModule;
  if (!loadPurchases()) {
    purchasesUIModule = null;
    return purchasesUIModule;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    purchasesUIModule = require('react-native-purchases-ui') as PurchasesUIModule;
  } catch {
    purchasesUIModule = null;
  }
  return purchasesUIModule;
}

/**
 * Cached synchronously so every existing call site (ad gating, session limits) can keep
 * reading a plain boolean instead of turning async. Starts false — same as the old
 * stub — until the first customer-info fetch resolves.
 */
let isPremiumFlag = false;
const premiumListeners = new Set<() => void>();

function setPremium(value: boolean): void {
  if (value === isPremiumFlag) return;
  isPremiumFlag = value;
  premiumListeners.forEach((listener) => listener());
}

export function isPremiumUser(): boolean {
  return isPremiumFlag;
}

/** For components that need to re-render when premium status changes — see settings.tsx. */
export function subscribeToPremium(listener: () => void): () => void {
  premiumListeners.add(listener);
  return () => premiumListeners.delete(listener);
}

function hasEntitlement(info: { entitlements: { active: Record<string, unknown> } }): boolean {
  return typeof info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== 'undefined';
}

let initStarted = false;

/** Call once at app startup. Safe to call from anywhere; no-ops where purchases aren't available. */
export function initPremium(): void {
  if (initStarted) return;
  initStarted = true;
  const purchases = loadPurchases();
  if (!purchases) return;

  try {
    purchases.configure({ apiKey: apiKeyFor(Platform.OS) });
    purchases.addCustomerInfoUpdateListener((info) => setPremium(hasEntitlement(info)));
    purchases
      .getCustomerInfo()
      .then((info) => setPremium(hasEntitlement(info)))
      .catch(() => {});
  } catch {
    // Premium stays off for this session.
  }
}

export type PaywallOutcome = 'purchased' | 'restored' | 'cancelled' | 'unavailable';

/** Opens RevenueCat's hosted paywall UI (design lives in the RevenueCat dashboard, not here). */
export async function presentPremiumPaywall(): Promise<PaywallOutcome> {
  const ui = loadPurchasesUI();
  if (!ui) return 'unavailable';
  try {
    const result = await ui.default.presentPaywall();
    if (result === ui.PAYWALL_RESULT.PURCHASED) {
      setPremium(true);
      return 'purchased';
    }
    if (result === ui.PAYWALL_RESULT.RESTORED) {
      setPremium(true);
      return 'restored';
    }
    return 'cancelled';
  } catch {
    return 'unavailable';
  }
}

/**
 * Apple requires a restore path reachable without going through a purchase attempt —
 * exposed here as its own action (see settings.tsx) rather than only inside the paywall.
 */
export async function restorePurchases(): Promise<boolean> {
  const purchases = loadPurchases();
  if (!purchases) return false;
  try {
    const info = await purchases.restorePurchases();
    const restored = hasEntitlement(info);
    if (restored) setPremium(true);
    return restored;
  } catch {
    return false;
  }
}

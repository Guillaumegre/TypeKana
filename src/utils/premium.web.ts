/**
 * Web build of src/utils/premium.ts — see src/utils/ads.web.ts for why this override file
 * exists: Metro statically resolves every require() it can reach regardless of the runtime
 * branch it's wrapped in, so react-native-purchases must never appear in the web bundle's
 * module graph at all, not even behind a Platform.OS guard.
 */
export function isPremiumUser(): boolean {
  return false;
}

export function subscribeToPremium(): () => void {
  return () => {};
}

export function initPremium(): void {}

export function syncPaywallLanguage(_lang: string): void {}

export type PaywallOutcome = 'purchased' | 'restored' | 'cancelled' | 'unavailable';

export function presentPremiumPaywall(): Promise<PaywallOutcome> {
  return Promise.resolve('unavailable');
}

export function restorePurchases(): Promise<boolean> {
  return Promise.resolve(false);
}

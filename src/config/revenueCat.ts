/**
 * RevenueCat public API keys. These are safe to ship in the app (they only allow
 * purchases and read access to this project's own entitlements — RevenueCat's own docs
 * confirm they aren't secrets), unlike a server/secret key which must never appear here.
 *
 * Where to find them: app.revenuecat.com → Project settings → API keys. Each platform
 * has its own key. Leave a value empty and premium stays off on that platform instead of
 * crashing — see src/utils/premium.ts.
 */
export const REVENUECAT_API_KEYS = {
  ios: '',
  android: '',
};

/** Must match the Entitlement identifier created in the RevenueCat dashboard. */
export const PREMIUM_ENTITLEMENT_ID = 'premium';

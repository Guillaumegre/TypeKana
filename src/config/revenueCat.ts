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
  // The App Store app's key (appl_...). Purchases only work once the iOS products exist in
  // App Store Connect and are attached to the packages and the `premium` entitlement.
  ios: 'appl_tPqcIYUqaEfZxLEgfqKSnCOUnfh',
  // The real Google Play app's key (goog_...) — real purchases, real money. The
  // Test Store key (test_...) used earlier for sandboxed testing is retired.
  android: 'goog_AmBQkyQfzSfUdxBEyikQANQdIWS',
};

/**
 * Identifiers of the entitlement that unlocks premium. RevenueCat answers with the
 * *identifier* given when the entitlement was created in the dashboard, so a mismatch is
 * silent: purchases succeed, yet the app never recognizes them (premium lost at the next
 * launch). The real one is `typekana_pro`; `premium` is kept so the app also works if an
 * entitlement of that name is created later.
 */
export const PREMIUM_ENTITLEMENT_IDS = ['typekana_pro', 'premium'];

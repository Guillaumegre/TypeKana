/**
 * Real AdMob ad unit IDs.
 *
 * Where to find them: https://apps.admob.com → your app → "Ad units". Create one
 * "Banner", one "Rewarded" and one "Interstitial" unit per platform, then paste the ids here. They look
 * like "ca-app-pub-1234567890123456/1234567890" (note the slash — the App ID uses a
 * tilde instead, and goes in app.json, not here).
 *
 * Leave a value empty and the app keeps using Google's test unit for it, so a half-filled
 * file never breaks ads — it just doesn't earn anything.
 *
 * These are only used in production builds. A development build always gets test units:
 * loading or clicking your own live ads counts as invalid traffic, which is a common way
 * to get an AdMob account suspended.
 */
export const AD_UNITS = {
  android: {
    banner: 'ca-app-pub-3994431410855220/2081959112',
    rewarded: 'ca-app-pub-3994431410855220/8860683559',
    interstitial: 'ca-app-pub-3994431410855220/8351853994',
  },
  // Units of the iOS app in AdMob. They only serve if the iOS App ID in app.json
  // (`iosAppId` of the react-native-google-mobile-ads plugin) belongs to that same app.
  ios: {
    banner: 'ca-app-pub-3994431410855220/3944966435',
    rewarded: 'ca-app-pub-3994431410855220/9698846839',
    interstitial: 'ca-app-pub-3994431410855220/3892995546',
  },
};

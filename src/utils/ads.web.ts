/**
 * Web build of src/utils/ads.ts. Metro resolves this file instead of ads.ts on web, so the
 * bundler never walks into react-native-google-mobile-ads' module graph at all — a plain
 * runtime Platform.OS guard isn't enough, since Metro statically resolves every `require(...)`
 * it can reach regardless of the runtime branch it's wrapped in.
 */
export function initAds(): void {}

export function getAdsModule(): null {
  return null;
}

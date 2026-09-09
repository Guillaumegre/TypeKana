import { useState, useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import { adUnitId, canRequestAds, getAdsModule, subscribeToConsent } from '../utils/ads';
import { isPremiumUser } from '../utils/premium';

/**
 * Renders nothing on web, in Expo Go, or for a premium user — see getAdsModule(). Also
 * renders nothing until UMP consent is resolved (subscribeToConsent re-renders this once
 * it is): requesting a banner before that is what the EU consent requirement forbids.
 */
export function AdBanner() {
  // An ad that fails to load (no network, no fill, misconfigured unit) must leave the
  // results screen intact rather than showing an empty slot or breaking the layout.
  const [failed, setFailed] = useState(false);
  const consentGiven = useSyncExternalStore(subscribeToConsent, canRequestAds);
  const ads = getAdsModule();
  if (!ads || !consentGiven || isPremiumUser() || failed) return null;

  const { BannerAd, BannerAdSize } = ads;

  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={adUnitId(ads, 'banner')}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: 14,
  },
});

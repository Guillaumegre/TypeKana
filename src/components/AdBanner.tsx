import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getAdsModule } from '../utils/ads';
import { isPremiumUser } from '../utils/premium';

/** Renders nothing on web, in Expo Go, or for a premium user — see getAdsModule(). */
export function AdBanner() {
  // An ad that fails to load (no network, no fill, misconfigured unit) must leave the
  // results screen intact rather than showing an empty slot or breaking the layout.
  const [failed, setFailed] = useState(false);
  const ads = getAdsModule();
  if (!ads || isPremiumUser() || failed) return null;

  const { BannerAd, BannerAdSize, TestIds } = ads;

  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={TestIds.BANNER}
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

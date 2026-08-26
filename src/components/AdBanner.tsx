import { StyleSheet, View } from 'react-native';
import { getAdsModule } from '../utils/ads';
import { isPremiumUser } from '../utils/premium';

/** Renders nothing on web, in Expo Go, or for a premium user — see getAdsModule(). */
export function AdBanner() {
  const ads = getAdsModule();
  if (!ads || isPremiumUser()) return null;

  const { BannerAd, BannerAdSize, TestIds } = ads;

  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
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

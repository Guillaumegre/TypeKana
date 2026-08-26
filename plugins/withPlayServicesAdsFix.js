const { withProjectBuildGradle } = require('expo/config-plugins');

// react-native-google-mobile-ads 16.5.0 pulls in play-services-ads 25.4.0, which now bundles
// Google's new "Ads Mobile SDK" (the Next-Gen line announced Feb 2026) compiled with Kotlin
// 2.3 — newer than the Kotlin toolchain RN 0.86 / Expo SDK 57 ship by default (2.1.x). Gradle
// fails with ":react-native-google-mobile-ads:compileDebugKotlin FAILED — Module was compiled
// with an incompatible version of Kotlin" because it can't read that newer metadata.
//
// Forcing the last pre-Next-Gen release across every module (including the ads library's own)
// sidesteps the mismatch entirely, until either RN bumps its default Kotlin version or the
// wrapper library adapts. Revisit/remove this once that happens upstream.
const PINNED_PLAY_SERVICES_ADS_VERSION = '24.8.0';

module.exports = function withPlayServicesAdsFix(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    if (config.modResults.contents.includes(PINNED_PLAY_SERVICES_ADS_VERSION)) return config;

    const marker = 'allprojects {';
    const injected = `${marker}
    configurations.all {
        resolutionStrategy {
            force 'com.google.android.gms:play-services-ads:${PINNED_PLAY_SERVICES_ADS_VERSION}'
        }
    }`;

    if (!config.modResults.contents.includes(marker)) {
      throw new Error(
        'withPlayServicesAdsFix: could not find "allprojects {" in android/build.gradle to patch.',
      );
    }

    config.modResults.contents = config.modResults.contents.replace(marker, injected);
    return config;
  });
};

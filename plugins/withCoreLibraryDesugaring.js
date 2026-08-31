const { withAppBuildGradle } = require('expo/config-plugins');

// Android 7.x (API 24/25) has no java.time. Expo's own dev launcher calls
// kotlin.time.toJavaDuration() in its network discovery code, so the dev client crashes
// at startup on those devices with:
//   NoClassDefFoundError: Failed resolution of: Ljava/time/Duration;
//   at expo.modules.devlauncher.nsd.NsdDiscoveryBase
//
// Core library desugaring backports those Java 8 APIs at dex time, for the app's own code
// and its dependencies alike. Enabling it is also insurance for any release-path library
// that assumes java.time while we still declare minSdk 24 — raising minSdk to 26 instead
// would drop Android 7 users (and make the project untestable on an Android 7 device).
//
// Remove once Expo fixes the dev launcher and nothing else needs the backport.
const DESUGAR_VERSION = '2.1.5';

module.exports = function withCoreLibraryDesugaring(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error(
        'withCoreLibraryDesugaring: expected a Groovy app/build.gradle, got ' +
          config.modResults.language,
      );
    }

    let contents = config.modResults.contents;

    if (!contents.includes('coreLibraryDesugaringEnabled')) {
      const androidBlock = /^android \{$/m;
      if (!androidBlock.test(contents)) {
        throw new Error('withCoreLibraryDesugaring: could not find the "android {" block.');
      }
      contents = contents.replace(
        androidBlock,
        `android {
    compileOptions {
        coreLibraryDesugaringEnabled true
    }`,
      );
    }

    if (!contents.includes('coreLibraryDesugaring ')) {
      const dependenciesBlock = /^dependencies \{$/m;
      if (!dependenciesBlock.test(contents)) {
        throw new Error('withCoreLibraryDesugaring: could not find the "dependencies {" block.');
      }
      contents = contents.replace(
        dependenciesBlock,
        `dependencies {
    coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:${DESUGAR_VERSION}"`,
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};

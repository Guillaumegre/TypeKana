import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { BackHeader } from '../src/components/BackHeader';
import { useT } from '../src/i18n';
import { C, FONT, R } from '../src/theme';

const STEP_COUNT = 3;

/** Opens Android's "on-screen keyboards" settings page directly. */
function openAndroidKeyboardSettings() {
  // RN core can fire the intent itself, so this needs no extra native dependency.
  Linking.sendIntent('android.settings.INPUT_METHOD_SETTINGS').catch(() => {
    // Some manufacturer ROMs don't expose this screen; the written steps below still apply.
    Linking.openSettings().catch(() => {});
  });
}

function Step({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  return (
    <ScrollView
      style={{ width }}
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {children}
    </ScrollView>
  );
}

function NumberedStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <View style={styles.numberedRow}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberBadgeText}>{n}</Text>
      </View>
      <Text style={styles.numberedText}>{children}</Text>
    </View>
  );
}

/** The five kana reachable from the あ key, laid out the way the flick gesture maps them. */
function FlickDiagram() {
  return (
    <View style={styles.flickBox}>
      <Text style={[styles.flickKana, styles.flickUp]}>う</Text>
      <Text style={[styles.flickKana, styles.flickLeft]}>い</Text>
      <View style={styles.flickCenter}>
        <Text style={styles.flickCenterKana}>あ</Text>
      </View>
      <Text style={[styles.flickKana, styles.flickRight]}>え</Text>
      <Text style={[styles.flickKana, styles.flickDown]}>お</Text>
    </View>
  );
}

/** A stylised keyboard strip highlighting the globe key used to switch languages. */
function GlobeKeyDiagram({ space }: { space: string }) {
  return (
    <View style={styles.keyboardStrip}>
      <View style={[styles.key, styles.keyGlobe]}>
        <Text style={styles.keyGlobeText}>🌐</Text>
      </View>
      <View style={styles.key}>
        <Text style={styles.keyText}>あ</Text>
      </View>
      <View style={styles.key}>
        <Text style={styles.keyText}>か</Text>
      </View>
      <View style={styles.key}>
        <Text style={styles.keyText}>さ</Text>
      </View>
      <View style={[styles.key, styles.keyWide]}>
        <Text style={styles.keyText}>{space}</Text>
      </View>
    </View>
  );
}

export default function TutorialScreen() {
  const router = useRouter();
  const t = useT();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== step) setStep(next);
  };

  const goToStep = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setStep(index);
  };

  const isLast = step === STEP_COUNT - 1;

  return (
    <View style={styles.screen}>
      <BackHeader title={t.tutorial.title} onBack={() => router.replace('/settings')} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        <Step eyebrow={t.tutorial.step(1)} title={t.tutorial.s1Title}>
          <Text style={styles.lead}>{t.tutorial.s1Lead}</Text>

          {Platform.OS === 'android' ? (
            <>
              <Pressable
                onPress={openAndroidKeyboardSettings}
                style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
              >
                <Text style={styles.ctaText}>{t.tutorial.s1Cta}</Text>
              </Pressable>
              <NumberedStep n={1}>{t.tutorial.s1Android1}</NumberedStep>
              <NumberedStep n={2}>{t.tutorial.s1Android2}</NumberedStep>
              <NumberedStep n={3}>
                {t.tutorial.s1Android3a}
                <Text style={styles.strong}>{t.tutorial.s1Android3key}</Text>
                {t.tutorial.s1Android3b}
              </NumberedStep>
            </>
          ) : (
            <>
              <NumberedStep n={1}>{t.tutorial.s1Ios1}</NumberedStep>
              <NumberedStep n={2}>{t.tutorial.s1Ios2}</NumberedStep>
              <NumberedStep n={3}>
                {t.tutorial.s1Ios3a}
                <Text style={styles.strong}>かな</Text>
                {t.tutorial.s1Ios3b}
              </NumberedStep>
              <Text style={styles.note}>{t.tutorial.s1IosNote}</Text>
            </>
          )}
        </Step>

        <Step eyebrow={t.tutorial.step(2)} title={t.tutorial.s2Title}>
          <Text style={styles.lead}>{t.tutorial.s2Lead}</Text>

          <GlobeKeyDiagram space={t.tutorial.s2Space} />

          <Text style={styles.body}>
            {t.tutorial.s2Body1}
            <Text style={styles.strong}>🌐</Text>
            {t.tutorial.s2Body2}
            <Text style={styles.strong}>{t.tutorial.s2Body3}</Text>
            {t.tutorial.s2Body4}
          </Text>
          <Text style={styles.note}>{t.tutorial.s2Note}</Text>
        </Step>

        <Step eyebrow={t.tutorial.step(3)} title={t.tutorial.s3Title}>
          <Text style={styles.lead}>{t.tutorial.s3Lead}</Text>

          <FlickDiagram />

          <Text style={styles.body}>{t.tutorial.s3Body}</Text>
          <Text style={styles.body}>{t.tutorial.s3Body2}</Text>
          <Text style={styles.note}>{t.tutorial.s3Note}</Text>
        </Step>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <Pressable
          onPress={() => (isLast ? router.replace('/settings') : goToStep(step + 1))}
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
        >
          <Text style={styles.nextText}>{isLast ? t.tutorial.done : t.tutorial.next}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
  },
  pager: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.accent,
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.9,
    color: C.ink,
    marginTop: 6,
  },
  lead: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '500',
    color: C.inkSoft,
    marginTop: 10,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: C.inkSoft,
    marginTop: 14,
  },
  strong: {
    fontWeight: '800',
    color: C.ink,
  },
  note: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 16,
  },
  cta: {
    backgroundColor: C.ink,
    borderRadius: R.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  ctaText: {
    color: C.onDark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  pressed: {
    opacity: 0.85,
  },
  numberedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 16,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: C.ink,
  },
  numberedText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: C.inkSoft,
    paddingTop: 1,
  },

  // Flick diagram
  flickBox: {
    alignSelf: 'center',
    width: 230,
    height: 230,
    marginTop: 22,
  },
  flickCenter: {
    position: 'absolute',
    top: 80,
    left: 80,
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flickCenterKana: {
    fontSize: 30,
    fontWeight: '700',
    color: C.onDark,
  },
  flickKana: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    textAlign: 'center',
    lineHeight: 60,
    fontSize: 24,
    fontWeight: '600',
    color: C.inkSoft,
  },
  flickUp: {
    top: 6,
    left: 84,
  },
  flickLeft: {
    top: 84,
    left: 6,
  },
  flickRight: {
    top: 84,
    right: 6,
  },
  flickDown: {
    bottom: 6,
    left: 84,
  },

  // Globe key diagram
  keyboardStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20,22,26,.06)',
    borderRadius: R.md,
    padding: 8,
    marginTop: 22,
  },
  key: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyWide: {
    flex: 1,
    width: undefined,
  },
  keyGlobe: {
    backgroundColor: C.accent,
    borderColor: C.accentDark,
  },
  keyGlobeText: {
    fontSize: 20,
  },
  keyText: {
    fontSize: 16,
    fontWeight: '600',
    color: C.inkSoft,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.lineStrong,
  },
  dotActive: {
    backgroundColor: C.accent,
    width: 20,
  },
  nextButton: {
    flex: 1,
    backgroundColor: C.ink,
    borderRadius: R.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextText: {
    color: C.onDark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
});

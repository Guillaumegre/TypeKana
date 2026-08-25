import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FuriganaText } from '../src/components/FuriganaText';
import { ModeSwitch } from '../src/components/ModeSwitch';
import { useSettings } from '../src/context/SettingsContext';
import { getSentenceById, getSentencesByLevel } from '../src/data/sentences';
import {
  getCategory,
  getWordById,
  getWordsByCategory,
  getWordsByLevel,
  pickRandomWord,
} from '../src/data/vocab';
import { C, FONT, R } from '../src/theme';
import type { GameEntry } from '../src/types/vocab';
import { isTextMatch, normalizeText, shuffle } from '../src/utils/kana';
import { clearResume, getResume, recordSession, saveResume, type ResumePoint } from '../src/utils/progress';
import { getRacePB, saveRacePBIfBetter, type RaceScore } from '../src/utils/raceStats';

type Feedback = 'idle' | 'correct' | 'incorrect';

const SESSION_LENGTH = 10;
const RACE_DURATION = 60;
const RACE_QUEUE_SIZE = 3;

function makeRaceQueue(used: Set<string>): GameEntry[] {
  const queue: GameEntry[] = [];
  for (let i = 0; i < RACE_QUEUE_SIZE; i++) {
    const word = pickRandomWord(used);
    used.add(word.id);
    queue.push(word);
  }
  return queue;
}

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode, category, level, contentType, resume } = useLocalSearchParams<{
    mode: string;
    category?: string;
    level?: string;
    contentType?: string;
    resume?: string;
  }>();
  const { kanjiMode, hintMode, blindMode, setBlindMode } = useSettings();
  const isRace = mode === 'race';
  const wantsResume = resume === '1' && !isRace;

  // A resumed session replays the exact saved list from where it stopped, so the
  // "3/10" shown on the home card stays true once the session reopens.
  const [restored, setRestored] = useState<ResumePoint | null>(null);
  const [restoring, setRestoring] = useState(wantsResume);
  useEffect(() => {
    if (!wantsResume) return;
    getResume()
      .then((point) => setRestored(point?.ids?.length ? point : null))
      .finally(() => setRestoring(false));
  }, [wantsResume]);

  const sessionWords: GameEntry[] = useMemo(() => {
    if (isRace || restoring) return [];

    if (restored) {
      const lookup = (id: string): GameEntry | undefined =>
        restored.contentType === 'phrases'
          ? (() => {
              const s = getSentenceById(id);
              return s ? { ...s, emoji: null, color: null } : undefined;
            })()
          : getWordById(id);
      const entries = restored.ids.map(lookup).filter((e): e is GameEntry => !!e);
      if (entries.length) return entries;
    }

    let pool: GameEntry[];
    if (level) {
      pool =
        contentType === 'phrases'
          ? getSentencesByLevel(level).map((s) => ({ ...s, emoji: null, color: null }))
          : getWordsByLevel(level);
    } else {
      pool = getWordsByCategory(category ?? '');
    }
    return shuffle(pool).slice(0, SESSION_LENGTH);
  }, [isRace, restoring, restored, category, level, contentType]);

  const usedWordIdsRef = useRef<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (restored) setIndex(Math.min(restored.index, Math.max(restored.ids.length - 1, 0)));
  }, [restored]);
  const [raceQueue, setRaceQueue] = useState<GameEntry[]>(() =>
    isRace ? makeRaceQueue(usedWordIdsRef.current) : [],
  );
  const [raceWordsSeen, setRaceWordsSeen] = useState(1);
  const [raceStarted, setRaceStarted] = useState(false);
  const [racePB, setRacePB] = useState<RaceScore | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RACE_DURATION);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [hasMissedCurrent, setHasMissedCurrent] = useState(false);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const [liveInvalid, setLiveInvalid] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const lastTextRef = useRef('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const themeLabel = level
    ? `${level} · ${contentType === 'phrases' ? 'PHRASES' : 'MOTS'}`
    : (getCategory(category ?? '')?.label ?? '').toUpperCase();

  // Race mode doesn't offer Rappel (blind recall doesn't fit a pure speed test).
  // If it was left on from a Training session, turn it off on entry.
  useEffect(() => {
    if (isRace && blindMode) setBlindMode(false);
  }, [isRace, blindMode, setBlindMode]);

  const currentWord = isRace ? raceQueue[0] : sessionWords[index];
  const upcomingWords = isRace ? raceQueue.slice(1) : [];
  const showKanji = !blindMode && kanjiMode && !!currentWord?.kanji;
  const answerTarget = showKanji ? currentWord!.kanji! : currentWord?.kana;
  const acceptedAnswers = blindMode
    ? [currentWord?.kana, currentWord?.kanji].filter((v): v is string => !!v)
    : [answerTarget].filter((v): v is string => !!v);
  // While the IME is still composing the kana reading, the kanji hasn't appeared yet — accept
  // the kana as a valid "in progress" prefix too, so live feedback doesn't flash red mid-conversion.
  const liveCheckAnswers = showKanji
    ? [currentWord?.kana, currentWord?.kanji].filter((v): v is string => !!v)
    : acceptedAnswers;
  const inputPlaceholder = blindMode || (kanjiMode && !hintMode) ? '' : currentWord?.kana;
  const displayText = showKanji ? currentWord?.kanji : currentWord?.kana;
  const targetFontSize = !displayText || displayText.length <= 6 ? 52 : displayText.length <= 10 ? 34 : 26;

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, raceQueue]);

  useEffect(() => {
    if (isRace) getRacePB().then(setRacePB);
  }, [isRace]);

  // Keep a resume point so the home screen can offer to pick the session back up.
  useEffect(() => {
    if (isRace || sessionWords.length === 0) return;
    if (index === 0) return;
    saveResume({
      label: level ? `JLPT ${level}` : (getCategory(category ?? '')?.label ?? 'Training'),
      glyph: level ? '級' : (getCategory(category ?? '')?.glyph ?? '練'),
      index,
      total: sessionWords.length,
      ids: sessionWords.map((w) => w.id),
      ...(category ? { category } : {}),
      ...(level ? { level } : {}),
      ...(contentType ? { contentType } : {}),
    });
  }, [isRace, index, sessionWords, category, level, contentType]);

  const runShake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -1, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const goToResults = useCallback(
    (finalCorrect: number, finalTotal: number) => {
      recordSession(finalCorrect);
      clearResume();
      router.replace({
        pathname: '/results',
        params: {
          mode: isRace ? 'race' : 'training',
          correct: String(finalCorrect),
          total: String(finalTotal),
          ...(category ? { category } : {}),
          ...(level ? { level } : {}),
          ...(contentType ? { contentType } : {}),
        },
      });
    },
    [router, isRace, category, level, contentType],
  );

  const correctRef = useRef(correctFirstTry);
  const seenRef = useRef(raceWordsSeen);
  useEffect(() => {
    correctRef.current = correctFirstTry;
    seenRef.current = raceWordsSeen;
  }, [correctFirstTry, raceWordsSeen]);

  const finishRace = useCallback(async () => {
    setFinished((already) => {
      if (already) return already;
      const finalCorrect = correctRef.current;
      const finalSeen = seenRef.current;
      recordSession(finalCorrect);
      saveRacePBIfBetter({
        correct: finalCorrect,
        accuracy: finalSeen > 0 ? Math.round((finalCorrect / finalSeen) * 100) : 0,
      }).then(({ isNewPB, pb }) => {
        router.replace({
          pathname: '/results',
          params: {
            mode: 'race',
            correct: String(finalCorrect),
            total: String(finalSeen),
            isNewPB: isNewPB ? '1' : '0',
            pbCorrect: String(pb.correct),
          },
        });
      });
      return true;
    });
  }, [router]);

  useEffect(() => {
    if (!isRace || !raceStarted) return;
    if (secondsLeft <= 0) {
      finishRace();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRace, raceStarted, secondsLeft, finishRace]);

  if (restoring) return <View style={styles.screen} />;

  if (!isRace && sessionWords.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.empty}>
          {level
            ? contentType === 'phrases'
              ? 'Aucune phrase disponible pour ce niveau.'
              : 'Aucun mot disponible pour ce niveau.'
            : 'Aucun mot trouvé pour ce thème.'}
        </Text>
      </View>
    );
  }

  const clearInput = () => {
    inputRef.current?.clear();
    lastTextRef.current = '';
    setLiveInvalid(false);
  };

  const nextRaceWord = () =>
    setRaceQueue((q) => {
      const rest = q.slice(1);
      const word = pickRandomWord(usedWordIdsRef.current);
      usedWordIdsRef.current.add(word.id);
      return [...rest, word];
    });

  const advance = (nextCorrect: number) => {
    clearInput();
    setFeedback('idle');
    setHasMissedCurrent(false);

    if (isRace) {
      setCorrectFirstTry(nextCorrect);
      setRaceWordsSeen((n) => n + 1);
      nextRaceWord();
      return;
    }

    if (index + 1 >= sessionWords.length) {
      goToResults(nextCorrect, sessionWords.length);
    } else {
      setCorrectFirstTry(nextCorrect);
      setIndex((i) => i + 1);
    }
  };

  const checkAndAdvance = (text: string) => {
    if (!text.trim() || !currentWord) return false;
    const correct = acceptedAnswers.some((answer) => isTextMatch(text, answer));
    if (!correct) return false;

    const nextCorrect = hasMissedCurrent ? correctFirstTry : correctFirstTry + 1;
    setFeedback('correct');
    setTimeout(() => advance(nextCorrect), isRace ? 180 : 350);
    return true;
  };

  const handleChangeText = (text: string) => {
    lastTextRef.current = text;

    if (isRace) {
      if (!raceStarted && text.length > 0) setRaceStarted(true);
      if (checkAndAdvance(text)) {
        setLiveInvalid(false);
        return;
      }
    }

    if (feedback === 'incorrect') setFeedback('idle');

    if (!text) {
      setLiveInvalid(false);
      return;
    }

    // Give the last kana a one-keystroke grace period before flagging it: dakuten/handakuten
    // (は → ば) and small-tsu replace the last character in place rather than appending, so
    // checking it immediately would flash red mid-composition, before the IME is done with it.
    const settled = normalizeText(text).slice(0, -1);
    const validSoFar = liveCheckAnswers.some((answer) => normalizeText(answer).startsWith(settled));
    setLiveInvalid(!validSoFar);
  };

  const handleSubmit = () => {
    if (!currentWord) return;
    const text = lastTextRef.current;
    const advanced = checkAndAdvance(text);
    if (!advanced && text.trim()) {
      setHasMissedCurrent(true);
      setFeedback('incorrect');
      runShake();
      clearInput();
    }
  };

  const handleSkip = () => {
    clearInput();
    setFeedback('idle');
    setHasMissedCurrent(false);

    if (isRace) {
      setRaceStarted(true);
      setRaceWordsSeen((n) => n + 1);
      nextRaceWord();
      return;
    }

    if (index + 1 >= sessionWords.length) {
      goToResults(correctFirstTry, sessionWords.length);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (!currentWord) return null;

  const handleBack = () => {
    if (isRace) {
      router.replace('/');
    } else if (level) {
      router.replace('/training/level');
    } else {
      router.replace('/training/theme');
    }
  };

  const showError = feedback === 'incorrect' || liveInvalid;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top + 14 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressedSoft]}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <View style={styles.modeSwitchWrap}>
          <ModeSwitch allowBlind={!isRace} />
        </View>
        {/* Mirrors the back button so the switch sits centred on the screen, not on the leftover space. */}
        <View style={styles.backButtonSpacer} />
      </View>

      {isRace ? (
        <View style={styles.raceHeader}>
          <View style={styles.raceRow}>
            <View style={styles.timerGroup}>
              <Text style={[styles.timerValue, secondsLeft <= 10 && raceStarted && styles.timerUrgent]}>
                {raceStarted ? secondsLeft : RACE_DURATION}
              </Text>
              <Text style={styles.timerUnit}>s</Text>
            </View>
            <View style={styles.scoreGroup}>
              <Text style={styles.scoreValue}>{correctFirstTry}</Text>
              <Text style={styles.scoreLabel}>MOTS</Text>
            </View>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.trackFillAccent,
                { width: `${((raceStarted ? secondsLeft : RACE_DURATION) / RACE_DURATION) * 100}%` },
              ]}
            />
          </View>
          {racePB && <Text style={styles.recordLine}>RECORD {racePB.correct}</Text>}
        </View>
      ) : (
        <View style={styles.progressHeader}>
          <View style={styles.track}>
            <View style={[styles.trackFillInk, { width: `${(index / sessionWords.length) * 100}%` }]} />
          </View>
          <Text style={styles.counter}>
            MOT {index + 1} / {sessionWords.length}
          </Text>
        </View>
      )}

      <View style={styles.stage}>
        {!!themeLabel && !isRace && <Text style={styles.themeLabel}>{themeLabel}</Text>}

        {!isRace &&
          (currentWord.color ? (
            <View
              style={[styles.colorSwatch, blindMode && styles.colorSwatchLarge, { backgroundColor: currentWord.color }]}
            />
          ) : (
            !!currentWord.emoji && (
              <Text style={[styles.emoji, blindMode && styles.emojiLarge]}>{currentWord.emoji}</Text>
            )
          ))}

        {!blindMode && showKanji && hintMode && currentWord.furigana ? (
          <FuriganaText segments={currentWord.furigana} fontSize={targetFontSize} color={C.ink} />
        ) : (
          <>
            {showKanji && hintMode && <Text style={styles.furigana}>{currentWord.kana}</Text>}
            {!blindMode && (
              <Text style={[styles.target, { fontSize: targetFontSize }]}>{displayText}</Text>
            )}
          </>
        )}

        <Text style={blindMode ? styles.meaningPrimary : styles.meaning}>{currentWord.meaning_fr}</Text>

        {isRace && upcomingWords.length > 0 && (
          <View style={styles.upcomingRow}>
            {upcomingWords.map((w, i) => (
              <Text key={`${w.id}-${i}`} style={styles.upcomingWord} numberOfLines={1}>
                {w.kana}
              </Text>
            ))}
          </View>
        )}

        <Animated.View
          style={[
            styles.inputWrap,
            showError && styles.inputWrapError,
            feedback === 'correct' && styles.inputWrapOk,
            {
              transform: [
                { translateX: shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] }) },
              ],
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[styles.input, showError && styles.inputError]}
            defaultValue=""
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmit}
            placeholder={isRace && !raceStarted ? 'Tape pour commencer…' : inputPlaceholder}
            placeholderTextColor="rgba(20,22,26,.25)"
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            returnKeyType="done"
          />
        </Animated.View>

        {!isRace && (
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submitButton, pressed && styles.pressedCard]}
          >
            <Text style={styles.submitText}>Valider</Text>
          </Pressable>
        )}

        <Pressable
          onPress={handleSkip}
          hitSlop={8}
          style={({ pressed }) => [styles.skipButton, pressed && styles.pressedSoft]}
        >
          <Text style={styles.skipText}>Passer</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
    paddingHorizontal: 24,
  },
  empty: {
    fontSize: 16,
    color: C.inkSoft,
    marginTop: 60,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.12)',
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonSpacer: {
    width: 34,
    height: 34,
  },
  backButtonText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: C.ink,
  },
  pressedSoft: {
    opacity: 0.6,
  },
  pressedCard: {
    opacity: 0.9,
  },
  modeSwitchWrap: {
    flex: 1,
    alignItems: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.line,
    overflow: 'hidden',
  },
  trackFillInk: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: C.ink,
  },
  trackFillAccent: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  counter: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: C.inkFaint,
  },
  raceHeader: {
    marginTop: 16,
  },
  raceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timerGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  timerValue: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2.5,
    lineHeight: 54,
    color: C.ink,
  },
  timerUrgent: {
    color: C.accent,
  },
  timerUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: C.inkFaint,
    marginBottom: 6,
  },
  scoreGroup: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1.2,
    lineHeight: 34,
    color: C.ink,
  },
  scoreLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: C.inkFaint,
  },
  recordLine: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: C.inkFaint,
    marginTop: 8,
    textAlign: 'right',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    // Anchored to the top rather than vertically centred: the keyboard opens on its own
    // (autoFocus), and centred content visibly slides up as the free height shrinks.
    justifyContent: 'flex-start',
    paddingTop: 14,
    minHeight: 0,
  },
  themeLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.accent,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 36,
    lineHeight: 42,
    marginBottom: 6,
  },
  emojiLarge: {
    fontSize: 56,
    lineHeight: 64,
    marginBottom: 10,
  },
  colorSwatch: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.lineStrong,
    marginBottom: 10,
  },
  colorSwatchLarge: {
    width: 74,
    height: 74,
    borderRadius: 18,
    marginBottom: 12,
  },
  furigana: {
    fontSize: 16,
    color: C.inkSoft,
    marginBottom: 4,
  },
  target: {
    fontWeight: '700',
    color: C.ink,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 15,
    fontWeight: '500',
    color: C.inkSoft,
    marginTop: 8,
    textAlign: 'center',
  },
  meaningPrimary: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: C.ink,
    marginTop: 4,
    textAlign: 'center',
  },
  upcomingRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  upcomingWord: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(20,22,26,.22)',
  },
  inputWrap: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: C.lineStrong,
    marginTop: 18,
  },
  inputWrapError: {
    borderBottomColor: C.accent,
  },
  inputWrapOk: {
    borderBottomColor: C.ok,
  },
  input: {
    fontSize: 28,
    fontWeight: '600',
    color: C.ink,
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 4,
  },
  inputError: {
    color: C.accent,
  },
  submitButton: {
    width: '100%',
    backgroundColor: C.ink,
    borderRadius: R.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  submitText: {
    color: C.onDark,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  skipButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.14)',
    borderRadius: R.sm,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.inkSoft,
  },
});

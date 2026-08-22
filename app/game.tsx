import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FuriganaText } from '../src/components/FuriganaText';
import { ModeSwitch } from '../src/components/ModeSwitch';
import { useSettings } from '../src/context/SettingsContext';
import { getSentencesByLevel } from '../src/data/sentences';
import { getWordsByCategory, getWordsByLevel, pickRandomWord } from '../src/data/vocab';
import type { GameEntry } from '../src/types/vocab';
import { isTextMatch, normalizeText, shuffle } from '../src/utils/kana';
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
  const { mode, category, level, contentType } = useLocalSearchParams<{
    mode: string;
    category?: string;
    level?: string;
    contentType?: string;
  }>();
  const { kanjiMode, hintMode, blindMode, setBlindMode } = useSettings();
  const isRace = mode === 'race';

  const sessionWords: GameEntry[] = useMemo(() => {
    if (isRace) return [];
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
  }, [isRace, category, level, contentType]);

  const usedWordIdsRef = useRef<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
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
  const inputRef = useRef<TextInput>(null);
  const lastTextRef = useRef('');

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
  const targetFontSize = !displayText || displayText.length <= 6 ? 56 : displayText.length <= 10 ? 34 : 26;

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, raceQueue]);

  useEffect(() => {
    if (isRace) getRacePB().then(setRacePB);
  }, [isRace]);

  const goToResults = useCallback(
    (finalCorrect: number, finalTotal: number) => {
      router.replace({
        pathname: '/results',
        params: {
          mode: isRace ? 'race' : 'training',
          correct: String(finalCorrect),
          total: String(finalTotal),
          accuracy: String(finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 0),
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
      const accuracy = finalSeen > 0 ? Math.round((finalCorrect / finalSeen) * 100) : 0;
      saveRacePBIfBetter({ correct: finalCorrect, accuracy }).then(({ isNewPB, pb }) => {
        router.replace({
          pathname: '/results',
          params: {
            mode: 'race',
            correct: String(finalCorrect),
            total: String(finalSeen),
            accuracy: String(accuracy),
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

  if (!isRace && sessionWords.length === 0) {
    return (
      <View style={styles.container}>
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
  };

  const advance = (nextCorrect: number) => {
    clearInput();
    setFeedback('idle');
    setHasMissedCurrent(false);

    if (isRace) {
      setCorrectFirstTry(nextCorrect);
      setRaceWordsSeen((n) => n + 1);
      setRaceQueue((q) => {
        const rest = q.slice(1);
        const word = pickRandomWord(usedWordIdsRef.current);
        usedWordIdsRef.current.add(word.id);
        return [...rest, word];
      });
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
      if (checkAndAdvance(text)) return;
    }

    if (!text) {
      setFeedback('idle');
      return;
    }

    const typed = normalizeText(text);
    const validSoFar = liveCheckAnswers.some((answer) => normalizeText(answer).startsWith(typed));
    setFeedback(validSoFar ? 'idle' : 'incorrect');
  };

  const handleSubmit = () => {
    if (!currentWord) return;
    const text = lastTextRef.current;
    const advanced = checkAndAdvance(text);
    if (!advanced && text.trim()) {
      setHasMissedCurrent(true);
      setFeedback('incorrect');
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
      setRaceQueue((q) => {
        const rest = q.slice(1);
        const word = pickRandomWord(usedWordIdsRef.current);
        usedWordIdsRef.current.add(word.id);
        return [...rest, word];
      });
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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + 20 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <View style={styles.modeSwitchWrap}>
          <ModeSwitch allowBlind={!isRace} />
        </View>
      </View>

      {isRace ? (
        <View style={styles.timerRow}>
          <Text style={styles.timerText}>⏱ {raceStarted ? `${secondsLeft}s` : '60s'}</Text>
          <Text style={styles.timerScore}>
            {correctFirstTry} correct{correctFirstTry > 1 ? 's' : ''}
            {racePB ? ` · record ${racePB.correct}` : ''}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${(index / sessionWords.length) * 100}%` }]} />
          </View>
          <Text style={styles.progress}>
            Mot {index + 1} / {sessionWords.length}
          </Text>
        </>
      )}

      <View style={styles.wordCard}>
        {!isRace &&
          (currentWord.color ? (
            <View
              style={[styles.colorSwatch, blindMode && styles.colorSwatchLarge, { backgroundColor: currentWord.color }]}
            />
          ) : (
            currentWord.emoji && (
              <Text style={[styles.emoji, blindMode && styles.emojiLarge]}>{currentWord.emoji}</Text>
            )
          ))}
        {!blindMode && showKanji && hintMode && currentWord.furigana ? (
          <FuriganaText segments={currentWord.furigana} fontSize={targetFontSize} color="#1E293B" />
        ) : (
          <>
            {showKanji && hintMode && <Text style={styles.furigana}>{currentWord.kana}</Text>}
            {!blindMode && (
              <Text style={[styles.targetKana, { fontSize: targetFontSize }]}>{displayText}</Text>
            )}
          </>
        )}
        <Text style={blindMode ? styles.meaningPrimary : styles.meaning}>{currentWord.meaning_fr}</Text>
      </View>

      {isRace && (
        <View style={styles.upcomingRow}>
          {upcomingWords.map((w, i) => (
            <Text key={`${w.kana}-${i}`} style={styles.upcomingWord} numberOfLines={1}>
              {w.kana}
            </Text>
          ))}
        </View>
      )}

      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          feedback === 'correct' && styles.inputCorrect,
          feedback === 'incorrect' && styles.inputIncorrect,
        ]}
        defaultValue=""
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        placeholder={isRace && !raceStarted ? 'Tape pour commencer...' : inputPlaceholder}
        placeholderTextColor="#94A3B8"
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        returnKeyType="done"
      />

      {feedback === 'incorrect' && <Text style={styles.feedbackText}>Essaie encore</Text>}
      {feedback === 'correct' && <Text style={[styles.feedbackText, styles.feedbackCorrect]}>Correct !</Text>}

      {!isRace && (
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Valider</Text>
        </Pressable>
      )}

      <Pressable onPress={handleSkip} hitSlop={8} style={styles.skipLink}>
        <Text style={styles.skipLinkText}>Passer</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 40,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#334155',
    fontWeight: '600',
  },
  modeSwitchWrap: {
    flex: 1,
    alignItems: 'center',
  },
  timerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
  },
  timerScore: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  progress: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  wordCard: {
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 2,
  },
  emojiLarge: {
    fontSize: 56,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 4,
  },
  colorSwatchLarge: {
    width: 72,
    height: 72,
    borderRadius: 14,
    marginBottom: 10,
  },
  furigana: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 2,
  },
  targetKana: {
    fontSize: 56,
    fontWeight: '700',
    color: '#1E293B',
  },
  meaning: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
  meaningPrimary: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1E293B',
  },
  upcomingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  upcomingWord: {
    fontSize: 15,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
  },
  inputCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  inputIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    color: '#EF4444',
  },
  feedbackText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  feedbackCorrect: {
    color: '#22C55E',
  },
  submitButton: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skipLink: {
    marginTop: 12,
    paddingVertical: 4,
  },
  skipLinkText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
});

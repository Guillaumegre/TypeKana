import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModeSwitch } from '../src/components/ModeSwitch';
import { useSettings } from '../src/context/SettingsContext';
import { getSentencesByLevel } from '../src/data/sentences';
import { getWordsByCategory, pickRandomWord } from '../src/data/vocab';
import type { GameEntry } from '../src/types/vocab';
import { isTextMatch, shuffle } from '../src/utils/kana';
import { saveRacePBIfBetter } from '../src/utils/raceStats';

type Feedback = 'idle' | 'correct' | 'incorrect';

const SESSION_LENGTH = 10;
const RACE_DURATION = 60;

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode, category, level } = useLocalSearchParams<{ mode: string; category?: string; level?: string }>();
  const { kanjiMode, hintMode, blindMode } = useSettings();
  const isRace = mode === 'race';

  const sessionWords: GameEntry[] = useMemo(() => {
    if (isRace) return [];
    const pool: GameEntry[] = level
      ? getSentencesByLevel(level).map((s) => ({ ...s, emoji: null, color: null }))
      : getWordsByCategory(category ?? '');
    return shuffle(pool).slice(0, SESSION_LENGTH);
  }, [isRace, category, level]);

  const [index, setIndex] = useState(0);
  const [raceWord, setRaceWord] = useState<GameEntry | null>(() => (isRace ? pickRandomWord() : null));
  const [raceWordsSeen, setRaceWordsSeen] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(RACE_DURATION);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [hasMissedCurrent, setHasMissedCurrent] = useState(false);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const currentWord = isRace ? raceWord : sessionWords[index];
  const showKanji = !blindMode && kanjiMode && !!currentWord?.kanji;
  const answerTarget = showKanji ? currentWord!.kanji! : currentWord?.kana;
  const acceptedAnswers = blindMode
    ? [currentWord?.kana, currentWord?.kanji].filter((v): v is string => !!v)
    : [answerTarget].filter((v): v is string => !!v);
  const inputPlaceholder = blindMode || (kanjiMode && !hintMode) ? '' : currentWord?.kana;
  const displayText = showKanji ? currentWord?.kanji : currentWord?.kana;
  const targetFontSize = !displayText || displayText.length <= 6 ? 56 : displayText.length <= 10 ? 34 : 26;

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, raceWord]);

  const goToResults = useCallback(
    (finalCorrect: number, finalTotal: number) => {
      router.replace({
        pathname: '/results',
        params: {
          mode: isRace ? 'race' : 'training',
          correct: String(finalCorrect),
          total: String(finalTotal),
          accuracy: String(finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 0),
        },
      });
    },
    [router, isRace],
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
    if (!isRace) return;
    if (secondsLeft <= 0) {
      finishRace();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRace, secondsLeft, finishRace]);

  if (!isRace && sessionWords.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>
          {level ? 'Aucune phrase disponible pour ce niveau.' : 'Aucun mot trouvé pour ce thème.'}
        </Text>
      </View>
    );
  }

  const advance = (nextCorrect: number) => {
    setInput('');
    setFeedback('idle');
    setHasMissedCurrent(false);

    if (isRace) {
      setCorrectFirstTry(nextCorrect);
      setRaceWordsSeen((n) => n + 1);
      setRaceWord(pickRandomWord(currentWord?.kana));
      return;
    }

    if (index + 1 >= sessionWords.length) {
      goToResults(nextCorrect, sessionWords.length);
    } else {
      setCorrectFirstTry(nextCorrect);
      setIndex((i) => i + 1);
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || !currentWord) return;

    const correct = acceptedAnswers.some((answer) => isTextMatch(input, answer));

    if (correct) {
      const nextCorrect = hasMissedCurrent ? correctFirstTry : correctFirstTry + 1;
      setFeedback('correct');
      setTimeout(() => advance(nextCorrect), 350);
    } else {
      setHasMissedCurrent(true);
      setFeedback('incorrect');
      setInput('');
    }
  };

  const handleSkip = () => {
    if (isRace) {
      setInput('');
      setFeedback('idle');
      setHasMissedCurrent(false);
      setRaceWordsSeen((n) => n + 1);
      setRaceWord(pickRandomWord(currentWord?.kana));
      return;
    }

    setInput('');
    setFeedback('idle');
    setHasMissedCurrent(false);

    if (index + 1 >= sessionWords.length) {
      goToResults(correctFirstTry, sessionWords.length);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (!currentWord) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + 20 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <View style={styles.modeSwitchWrap}>
          <ModeSwitch />
        </View>
      </View>

      {isRace ? (
        <View style={styles.timerRow}>
          <Text style={styles.timerText}>⏱ {secondsLeft}s</Text>
          <Text style={styles.timerScore}>{correctFirstTry} correct{correctFirstTry > 1 ? 's' : ''}</Text>
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
        {currentWord.color ? (
          <View style={[styles.colorSwatch, blindMode && styles.colorSwatchLarge, { backgroundColor: currentWord.color }]} />
        ) : (
          currentWord.emoji && (
            <Text style={[styles.emoji, blindMode && styles.emojiLarge]}>{currentWord.emoji}</Text>
          )
        )}
        {showKanji && hintMode && <Text style={styles.furigana}>{currentWord.kana}</Text>}
        {!blindMode && (
          <Text style={[styles.targetKana, { fontSize: targetFontSize }]}>{displayText}</Text>
        )}
        <Text style={blindMode ? styles.meaningPrimary : styles.meaning}>{currentWord.meaning_fr}</Text>
      </View>

      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          feedback === 'correct' && styles.inputCorrect,
          feedback === 'incorrect' && styles.inputIncorrect,
        ]}
        value={input}
        onChangeText={(text) => {
          setInput(text);
          if (feedback !== 'idle') setFeedback('idle');
        }}
        onSubmitEditing={handleSubmit}
        placeholder={inputPlaceholder}
        placeholderTextColor="#94A3B8"
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        returnKeyType="done"
      />

      {feedback === 'incorrect' && <Text style={styles.feedbackText}>Essaie encore</Text>}
      {feedback === 'correct' && <Text style={[styles.feedbackText, styles.feedbackCorrect]}>Correct !</Text>}

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Valider</Text>
      </Pressable>

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
    fontSize: 14,
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
    marginBottom: 20,
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

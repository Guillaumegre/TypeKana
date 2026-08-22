import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModeSwitch } from '../src/components/ModeSwitch';
import { useSettings } from '../src/context/SettingsContext';
import { getSentencesByLevel } from '../src/data/sentences';
import { getWordsByCategory } from '../src/data/vocab';
import type { GameEntry } from '../src/types/vocab';
import { isTextMatch, shuffle } from '../src/utils/kana';

type Feedback = 'idle' | 'correct' | 'incorrect';

const SESSION_LENGTH = 10;

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode, category, level } = useLocalSearchParams<{ mode: string; category?: string; level?: string }>();
  const { kanjiMode, hintMode, blindMode } = useSettings();

  const words: GameEntry[] = useMemo(() => {
    const pool: GameEntry[] = level
      ? getSentencesByLevel(level).map((s) => ({ ...s, emoji: null, color: null }))
      : getWordsByCategory(category ?? '');
    return shuffle(pool).slice(0, SESSION_LENGTH);
  }, [category, level]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [hasMissedCurrent, setHasMissedCurrent] = useState(false);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const currentWord = words[index];
  const showKanji = !blindMode && kanjiMode && !!currentWord?.kanji;
  const answerTarget = showKanji ? currentWord.kanji! : currentWord?.kana;
  const inputPlaceholder = blindMode || (kanjiMode && !hintMode) ? '' : currentWord?.kana;
  const displayText = showKanji ? currentWord?.kanji : currentWord?.kana;
  const targetFontSize = !displayText || displayText.length <= 6 ? 56 : displayText.length <= 10 ? 34 : 26;

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>
          {level ? 'Aucune phrase disponible pour ce niveau.' : 'Aucun mot trouvé pour ce thème.'}
        </Text>
      </View>
    );
  }

  const goToResults = (finalCorrect: number) => {
    router.replace({
      pathname: '/results',
      params: {
        mode: mode ?? 'training',
        correct: String(finalCorrect),
        total: String(words.length),
        accuracy: String(Math.round((finalCorrect / words.length) * 100)),
      },
    });
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    const correct = isTextMatch(input, answerTarget);

    if (correct) {
      const finalCorrect = hasMissedCurrent ? correctFirstTry : correctFirstTry + 1;
      setFeedback('correct');
      setTimeout(() => {
        setInput('');
        setFeedback('idle');
        setHasMissedCurrent(false);
        if (!hasMissedCurrent) setCorrectFirstTry(finalCorrect);

        if (index + 1 >= words.length) {
          goToResults(finalCorrect);
        } else {
          setIndex((i) => i + 1);
        }
      }, 450);
    } else {
      setHasMissedCurrent(true);
      setFeedback('incorrect');
      setInput('');
    }
  };

  const handleSkip = () => {
    setInput('');
    setFeedback('idle');
    setHasMissedCurrent(false);

    if (index + 1 >= words.length) {
      goToResults(correctFirstTry);
    } else {
      setIndex((i) => i + 1);
    }
  };

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

      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${(index / words.length) * 100}%` }]} />
      </View>
      <Text style={styles.progress}>
        Mot {index + 1} / {words.length}
      </Text>

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

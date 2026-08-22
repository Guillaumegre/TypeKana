import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getWordsByCategory } from '../src/data/vocab';
import { isKanaMatch, shuffle } from '../src/utils/kana';

type Feedback = 'idle' | 'correct' | 'incorrect';

export default function GameScreen() {
  const router = useRouter();
  const { mode, category } = useLocalSearchParams<{ mode: string; category: string }>();

  const words = useMemo(() => shuffle(getWordsByCategory(category ?? '')), [category]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [hasMissedCurrent, setHasMissedCurrent] = useState(false);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const currentWord = words[index];

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Aucun mot trouvé pour ce thème.</Text>
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

    const correct = isKanaMatch(input, currentWord.kana);

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

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Mot {index + 1} / {words.length}
      </Text>

      <View style={styles.wordCard}>
        {currentWord.emoji && <Text style={styles.emoji}>{currentWord.emoji}</Text>}
        <Text style={styles.targetKana}>{currentWord.kana}</Text>
        <Text style={styles.meaning}>{currentWord.meaning_fr}</Text>
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
        placeholder={currentWord.meaning_fr}
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
    </View>
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
  progress: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  wordCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 4,
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
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  feedbackCorrect: {
    color: '#22C55E',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

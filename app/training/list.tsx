import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../../src/components/BackHeader';
import { useT } from '../../src/i18n';
import { C, R } from '../../src/theme';
import {
  addWord,
  getList,
  removeWord,
  renameList,
  type CustomList,
} from '../../src/utils/customLists';

export default function CustomListEditScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [list, setList] = useState<CustomList | null>(null);
  const [name, setName] = useState('');
  const [kana, setKana] = useState('');
  const [kanji, setKanji] = useState('');
  const [meaning, setMeaning] = useState('');

  const reload = useCallback(() => {
    if (!id) return;
    getList(id).then((l) => {
      setList(l);
      if (l) setName(l.name);
    });
  }, [id]);

  useEffect(reload, [reload]);

  const canAdd = kana.trim().length > 0 && meaning.trim().length > 0;

  const onAdd = async () => {
    if (!id || !canAdd) return;
    await addWord(id, {
      kana: kana.trim(),
      kanji: kanji.trim() || null,
      meaning: meaning.trim(),
    });
    setKana('');
    setKanji('');
    setMeaning('');
    reload();
  };

  const onRemove = async (wordId: string) => {
    if (!id) return;
    await removeWord(id, wordId);
    reload();
  };

  // Persist as it is typed rather than on blur: leaving the screen without blurring
  // (tapping back straight after typing) would otherwise lose the name.
  const onNameChange = (value: string) => {
    setName(value);
    const trimmed = value.trim();
    if (id && trimmed) renameList(id, trimmed);
  };

  if (!list) {
    return (
      <View style={styles.screen}>
        <BackHeader title={t.listEdit.fallbackTitle} onBack={() => router.replace('/training/custom')} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BackHeader
        title={t.listEdit.title}
        subtitle={t.listEdit.wordCount(list.words.length)}
        onBack={() => router.replace('/training/custom')}
      />

      <FlatList
        data={list.words}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.form}>
            <Text style={styles.fieldLabel}>{t.listEdit.listName}</Text>
            <TextInput
              value={name}
              onChangeText={onNameChange}
              style={styles.nameInput}
              placeholder={t.listEdit.namePlaceholder}
              placeholderTextColor="rgba(20,22,26,.3)"
            />

            <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>{t.listEdit.addWord}</Text>
            <TextInput
              value={kana}
              onChangeText={setKana}
              style={styles.input}
              placeholder={t.listEdit.kanaPlaceholder}
              placeholderTextColor="rgba(20,22,26,.3)"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              value={kanji}
              onChangeText={setKanji}
              style={styles.input}
              placeholder={t.listEdit.kanjiPlaceholder}
              placeholderTextColor="rgba(20,22,26,.3)"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              value={meaning}
              onChangeText={setMeaning}
              style={styles.input}
              placeholder={t.listEdit.meaningPlaceholder}
              placeholderTextColor="rgba(20,22,26,.3)"
              onSubmitEditing={onAdd}
              returnKeyType="done"
            />
            <Pressable
              onPress={onAdd}
              disabled={!canAdd}
              style={({ pressed }) => [styles.addButton, !canAdd && styles.addDisabled, pressed && styles.pressed]}
            >
              <Text style={styles.addText}>{t.listEdit.add}</Text>
            </Pressable>

            {list.words.length > 0 && (
              <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>{t.listEdit.listWords}</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.wordRow}>
            <View style={styles.wordText}>
              <Text style={styles.wordKana}>
                {item.kana}
                {item.kanji ? `  ·  ${item.kanji}` : ''}
              </Text>
              <Text style={styles.wordMeaning}>{item.meaning}</Text>
            </View>
            <Pressable hitSlop={8} onPress={() => onRemove(item.id)} style={styles.removeButton}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
  },
  list: {
    paddingHorizontal: 24,
    gap: 8,
  },
  form: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: C.inkFaint,
    marginBottom: 8,
  },
  fieldLabelSpaced: {
    marginTop: 22,
  },
  nameInput: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.12)',
    borderRadius: R.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
  },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.12)',
    borderRadius: R.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15.5,
    color: C.ink,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: C.accent,
    borderRadius: R.sm,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 2,
  },
  addDisabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.9,
  },
  addText: {
    color: '#FBF9F5',
    fontSize: 15,
    fontWeight: '900',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.09)',
    borderRadius: R.md,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 6,
  },
  wordText: {
    flex: 1,
  },
  wordKana: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
  },
  wordMeaning: {
    fontSize: 12.5,
    color: C.inkFaint,
    marginTop: 2,
  },
  removeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 15,
    color: C.accent,
  },
});

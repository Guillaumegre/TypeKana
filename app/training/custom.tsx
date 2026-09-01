import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../../src/components/BackHeader';
import { useT } from '../../src/i18n';
import { C, R } from '../../src/theme';
import { createList, deleteList, getLists, type CustomList } from '../../src/utils/customLists';

export default function CustomListsScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();
  const [lists, setLists] = useState<CustomList[]>([]);

  const reload = useCallback(() => {
    getLists().then(setLists);
  }, []);

  useFocusEffect(reload);

  const onCreate = async () => {
    const list = await createList(t.lists.defaultName(lists.length + 1));
    router.push({ pathname: '/training/list', params: { id: list.id } });
  };

  const onDelete = (list: CustomList) => {
    Alert.alert(t.lists.deleteTitle, t.lists.deleteBody(list.name, list.words.length), [
      { text: t.lists.cancel, style: 'cancel' },
      {
        text: t.lists.delete,
        style: 'destructive',
        onPress: async () => {
          await deleteList(list.id);
          reload();
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={t.lists.title} subtitle={t.lists.subtitle} onBack={() => router.replace('/training')} />

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 26 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>{t.lists.empty}</Text>
        }
        renderItem={({ item }) => {
          const playable = item.words.length > 0;
          return (
            <View style={styles.card}>
              <Pressable
                style={styles.cardMain}
                onPress={() =>
                  playable
                    ? router.push({ pathname: '/game', params: { mode: 'training', listId: item.id } })
                    : router.push({ pathname: '/training/list', params: { id: item.id } })
                }
              >
                <Text style={styles.cardLabel} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardCount}>
                  {playable ? t.lists.wordCount(item.words.length) : t.lists.emptyList}
                </Text>
              </Pressable>

              <Pressable
                hitSlop={8}
                style={styles.iconButton}
                onPress={() => router.push({ pathname: '/training/list', params: { id: item.id } })}
              >
                <Text style={styles.iconText}>✎</Text>
              </Pressable>
              <Pressable hitSlop={8} style={styles.iconButton} onPress={() => onDelete(item)}>
                <Text style={[styles.iconText, styles.iconDanger]}>✕</Text>
              </Pressable>
            </View>
          );
        }}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable onPress={onCreate} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <Text style={styles.addText}>{t.lists.newList}</Text>
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
  list: {
    paddingHorizontal: 24,
    gap: 9,
  },
  empty: {
    fontSize: 14,
    lineHeight: 20,
    color: C.inkFaint,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.09)',
    borderRadius: R.lg,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
  },
  cardMain: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: C.ink,
  },
  cardCount: {
    fontSize: 11.5,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 3,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 17,
    color: C.inkSoft,
  },
  iconDanger: {
    color: C.accent,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  addButton: {
    backgroundColor: C.ink,
    borderRadius: R.md,
    paddingVertical: 15,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  addText: {
    color: C.onDark,
    fontSize: 15.5,
    fontWeight: '900',
  },
});

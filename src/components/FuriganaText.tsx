import { StyleSheet, Text, View } from 'react-native';
import { C } from '../theme';
import type { FuriganaSegment } from '../types/vocab';

export function FuriganaText({
  segments,
  fontSize,
  color,
}: {
  segments: FuriganaSegment[];
  fontSize: number;
  color: string;
}) {
  const readingSize = Math.max(11, Math.round(fontSize * 0.32));

  return (
    <View style={styles.row}>
      {segments.map((segment, i) => (
        <View key={i} style={styles.unit}>
          <Text style={[styles.reading, { fontSize: readingSize, lineHeight: readingSize + 3 }]}>
            {segment.reading ?? ''}
          </Text>
          <Text style={[styles.text, { fontSize, lineHeight: fontSize * 1.25, color }]}>{segment.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  unit: {
    alignItems: 'center',
  },
  reading: {
    color: C.inkSoft,
    fontWeight: '600',
  },
  text: {
    fontWeight: '700',
  },
});

import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getLevel, levels } from '@/game/levels';
import { useProgress } from '@/game/progress';
import { palette, radius } from '@/theme/tokens';

export default function LevelsScreen() {
  const { records, unlocked } = useProgress();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.container}>
          <Pressable accessibilityLabel="Back to home" accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
          <Text style={styles.eyebrow}>CHOOSE YOUR ROUTE</Text>
          <Text style={styles.title}>Little adventures,{ '\n' }one grid at a time.</Text>
          <Text style={styles.subheading}>Clear each route to unlock the next. Ten puzzles are ready for you.</Text>
          <View style={styles.grid}>
            {Array.from({ length: 10 }, (_, i) => {
              const id = i + 1;
              const level = getLevel(id);
              const available = !!level && id <= unlocked;
              const record = records[id];
              return (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={record ? 'Level ' + id + ' completed with ' + record.stars + ' stars' : available ? 'Play level ' + id : 'Level ' + id + ' locked'}
                  accessibilityState={{ disabled: !available }}
                  disabled={!available}
                  onPress={() => router.push({ pathname: '/game/[id]', params: { id: String(id) } })}
                  style={[styles.tile, available && styles.unlocked, !!record && styles.completed]}
                >
                  <Text style={styles.tileTop}>{record ? 'DONE' : available ? 'READY' : level ? 'LOCKED' : 'SOON'}</Text>
                  <Text style={[styles.tileNumber, !available && styles.lockedNumber]}>{String(id).padStart(2, '0')}</Text>
                  <Text style={[styles.tileBottom, available && styles.readyLabel]}>{record ? '★'.repeat(record.stars) : available ? 'PLAY →' : 'LOCKED'}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.note}>Available now: {levels.length} solver-verified puzzles. Stars and best moves are saved on this device.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 18 },
  container: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  back: { height: 48, width: 48, borderRadius: 17, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  backText: { color: palette.ink, fontSize: 34, marginTop: -5 },
  eyebrow: { color: '#269F93', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  title: { color: palette.ink, fontSize: 32, fontWeight: '900', letterSpacing: -1.1, lineHeight: 38 },
  subheading: { marginTop: 14, color: palette.muted, fontSize: 14, lineHeight: 22, maxWidth: 350 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', marginTop: 34 },
  tile: { width: '22%', aspectRatio: 0.79, minHeight: 107, backgroundColor: '#EBE8E2', borderRadius: radius.md, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13 },
  unlocked: { backgroundColor: palette.tealPale, borderWidth: 2, borderColor: palette.teal },
  completed: { backgroundColor: palette.yellowPale, borderColor: palette.yellow },
  tileTop: { color: '#9A9B9A', fontSize: 8, letterSpacing: 1.1, fontWeight: '900' },
  tileNumber: { color: '#139587', fontSize: 27, fontWeight: '900' },
  lockedNumber: { color: '#ADB0B1' },
  tileBottom: { fontWeight: '800', fontSize: 8, color: '#A7AAA9', letterSpacing: 0.8 },
  readyLabel: { color: '#139587' },
  note: { marginTop: 26, fontSize: 12, color: palette.muted, lineHeight: 19 },
});

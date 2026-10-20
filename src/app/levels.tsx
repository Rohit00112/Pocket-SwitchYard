import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getLevel } from '@/game/levels';
import { palette, radius } from '@/theme/tokens';

export default function LevelsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.container}>
          <Pressable accessibilityLabel="Back to home" accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
          <Text style={styles.eyebrow}>CHOOSE YOUR ROUTE</Text>
          <Text style={styles.title}>Little adventures,{ '\n' }one grid at a time.</Text>
          <Text style={styles.subheading}>Your first level is ready. More hand-crafted puzzles arrive in the next development phases.</Text>
          <View style={styles.grid}>
            {Array.from({ length: 10 }, (_, i) => {
              const id = i + 1;
              const level = getLevel(id);
              return (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={level ? 'Preview level ' + id : 'Level ' + id + ' coming soon'}
                  accessibilityState={{ disabled: !level }}
                  disabled={!level}
                  onPress={() => router.push({ pathname: '/game/[id]', params: { id: String(id) } })}
                  style={[styles.tile, !!level && styles.unlocked]}
                >
                  <Text style={styles.tileTop}>{level ? 'READY' : 'SOON'}</Text>
                  <Text style={[styles.tileNumber, !level && styles.lockedNumber]}>{String(id).padStart(2, '0')}</Text>
                  <Text style={[styles.tileBottom, !!level && styles.readyLabel]}>{level ? 'VIEW →' : 'LOCKED'}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.note}>Phase 1 includes one board preview. Playable moves and verified puzzle packs follow in Phase 2 and Phase 4.</Text>
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
  tileTop: { color: '#9A9B9A', fontSize: 8, letterSpacing: 1.1, fontWeight: '900' },
  tileNumber: { color: '#139587', fontSize: 27, fontWeight: '900' },
  lockedNumber: { color: '#ADB0B1' },
  tileBottom: { fontWeight: '800', fontSize: 8, color: '#A7AAA9', letterSpacing: 0.8 },
  readyLabel: { color: '#139587' },
  note: { marginTop: 26, fontSize: 12, color: palette.muted, lineHeight: 19 },
});

import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { GameBoard } from '@/components/GameBoard';
import { GameButton } from '@/components/GameButton';
import { levels } from '@/game/levels';
import { useProgress } from '@/game/progress';
import { palette, radius, space } from '@/theme/tokens';

const openingLevel = levels[0];

export default function HomeScreen() {
  const progress = useProgress();
  const nextLevel = levels.find((level) => !progress.records[level.id]) ?? levels[levels.length - 1];
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.wordmark}>
              <BrandMark size={43} />
              <View>
                <Text style={styles.brand}>POCKET</Text>
                <Text style={styles.brandSecond}>SWITCHYARD</Text>
              </View>
            </View>
            <View style={styles.offlinePill}><View style={styles.statusDot} /><Text style={styles.offlineText}>OFFLINE FUN</Text></View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>A LITTLE THINKING, A LOT OF FUN</Text>
            <Text style={styles.title}>Tiny carts.{ '\n' }Big brain moves<Text style={styles.titleDot}>.</Text></Text>
            <Text style={styles.subtitle}>Find a clear route for every cart. The next little victory is yours.</Text>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewHeading}>
              <View><Text style={styles.previewOverline}>SNEAK PEEK</Text><Text style={styles.previewTitle}>The switchyard</Text></View>
              <View style={styles.sizePill}><Text style={styles.sizeLabel}>4 × 4</Text></View>
            </View>
            <View style={styles.boardWrap}><GameBoard board={openingLevel.initialBoard} showRowControls={false} preview /></View>
            <View style={styles.previewCaption}><View style={styles.captionDot} /><Text style={styles.previewCaptionText}>A colorful little logic challenge</Text></View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View><Text style={styles.progressOverline}>YOUR JOURNEY CONTINUES</Text><Text style={styles.progressTitle}>Level {String(nextLevel.id).padStart(2, '0')} <Text style={styles.levelTitle}> / {nextLevel.title}</Text></Text></View>
              <View style={styles.starBadge}><Text style={styles.starGlyph}>★</Text><Text style={styles.starNumber}>{progress.totalStars}</Text></View>
            </View>
            <GameButton title={progress.completedCount ? 'Keep playing' : "Let's play"} accessory="→" onPress={() => router.push({ pathname: '/game/[id]', params: { id: String(nextLevel.id) } })} />
          </View>

          <View style={styles.secondaryRow}>
            <GameButton title="Select level" kind="secondary" onPress={() => router.push('/levels')} style={styles.halfButton} />
            <GameButton title="Settings · soon" kind="secondary" disabled style={styles.halfButton} />
          </View>
          <Text style={styles.footer}>NO RUSH. JUST ONE MORE PUZZLE.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  container: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.xxl },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: { color: palette.ink, fontWeight: '900', letterSpacing: 2, fontSize: 13, lineHeight: 16 },
  brandSecond: { color: palette.ink, fontWeight: '900', letterSpacing: 1.45, fontSize: 11, lineHeight: 15 },
  offlinePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAF1E9', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 9, gap: 6 },
  statusDot: { height: 7, width: 7, borderRadius: 4, backgroundColor: palette.teal },
  offlineText: { color: '#517568', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  intro: { marginBottom: 24 },
  eyebrow: { color: '#269F93', fontWeight: '800', fontSize: 10, letterSpacing: 1.8, marginBottom: 12 },
  title: { color: palette.ink, fontWeight: '900', fontSize: 37, lineHeight: 43, letterSpacing: -1.4 },
  titleDot: { color: palette.coral },
  subtitle: { marginTop: 12, color: palette.muted, fontSize: 14, lineHeight: 22, maxWidth: 325 },
  previewCard: { padding: 18, backgroundColor: palette.white, borderRadius: radius.xl, borderWidth: 1, borderColor: '#F0EEE9', shadowColor: palette.shadow, shadowOpacity: 0.065, shadowRadius: 22, shadowOffset: { width: 0, height: 9 }, elevation: 3 },
  previewHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewOverline: { color: '#9AA4B0', fontSize: 9, letterSpacing: 2.2, fontWeight: '800', marginBottom: 5 },
  previewTitle: { color: palette.ink, fontSize: 19, fontWeight: '800', letterSpacing: -0.5 },
  sizePill: { borderRadius: radius.pill, backgroundColor: palette.yellowPale, paddingVertical: 8, paddingHorizontal: 12 },
  sizeLabel: { color: '#967018', fontWeight: '800', fontSize: 12 },
  boardWrap: { paddingTop: 12, paddingBottom: 6, alignItems: 'center' },
  previewCaption: { flexDirection: 'row', gap: 7, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  captionDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: palette.coral },
  previewCaptionText: { color: palette.muted, fontSize: 11, fontWeight: '600' },
  progressCard: { backgroundColor: palette.yellowPale, borderRadius: radius.lg, padding: 18, marginTop: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  progressOverline: { color: '#B18D46', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  progressTitle: { color: palette.ink, fontWeight: '900', fontSize: 17 },
  levelTitle: { fontWeight: '500', color: '#7A7780', fontSize: 12 },
  starBadge: { backgroundColor: palette.white, borderRadius: 18, height: 43, minWidth: 61, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 5 },
  starGlyph: { color: '#E9B946', fontSize: 20 },
  starNumber: { color: palette.ink, fontWeight: '800', fontSize: 16 },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  halfButton: { flex: 1 },
  footer: { marginTop: 24, color: '#B8B8B5', textAlign: 'center', fontWeight: '800', letterSpacing: 2, fontSize: 9 },
});

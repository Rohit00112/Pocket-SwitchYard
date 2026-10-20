import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameBoard } from '@/components/GameBoard';
import { GameButton } from '@/components/GameButton';
import { getLevel, levels } from '@/game/levels';
import { useProgress } from '@/game/progress';
import { calculateStars } from '@/game/scoring';
import type { LevelDefinition } from '@/game/types';
import { useGame } from '@/hooks/useGame';
import { palette, radius } from '@/theme/tokens';

export default function GameScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const level = getLevel(Number(params.id));
  const { unlocked } = useProgress();

  if (!level || level.id > unlocked) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.unknown}>
          <Text style={styles.heading}>Route not found</Text>
          <Text style={styles.helper}>Complete the earlier puzzles to unlock this route.</Text>
          <GameButton title="Back to levels" onPress={() => router.replace('/levels')} />
        </View>
      </SafeAreaView>
    );
  }

  return <GameSession key={level.id} level={level} />;
}

function GameSession({ level }: { level: LevelDefinition }) {
  const game = useGame(level);
  const { state, busy, animation, blocked, exitArrow, shift, undo, restart, togglePause, finishAnimation } = game;
  const progress = useProgress();
  const awardRecorded = useRef<number | null>(null);
  const stars = calculateStars(state.moves, level.parMoves);
  const isPaused = state.status === 'paused';
  const completed = state.status === 'complete';
  const nextLevel = levels.find((next) => next.id === level.id + 1);

  useEffect(() => {
    if (completed && awardRecorded.current !== state.moves) {
      awardRecorded.current = state.moves;
      progress.complete(level.id, state.moves, stars);
    }
  }, [completed, level.id, progress, stars, state.moves]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="Back to levels" style={styles.iconButton} onPress={() => router.back()}><Text style={styles.backIcon}>‹</Text></Pressable>
            <View style={styles.headingWrap}><Text style={styles.eyebrow}>CLEAR THE SWITCHYARD</Text><Text style={styles.heading}>Level {String(level.id).padStart(2, '0')}</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel={isPaused ? 'Resume' : 'Pause'} accessibilityState={{ disabled: busy || completed }} disabled={busy || completed} style={[styles.iconButton, (busy || completed) && styles.dimmed]} onPress={togglePause}><Text style={styles.pauseIcon}>{isPaused ? '▶' : 'Ⅱ'}</Text></Pressable>
          </View>

          <View style={styles.levelInfo}><View><Text style={styles.levelName}>{level.title}</Text><Text style={styles.levelDetail}>PAR {level.parMoves} MOVES · {level.difficulty.toUpperCase()}</Text></View><View style={styles.movesPill}><Text style={styles.movesCount}>{state.moves}</Text><Text style={styles.movesLabel}>MOVES</Text></View></View>

          <View style={styles.boardCard}>
            <View style={styles.boardTop}><View style={styles.previewDot} /><Text style={styles.boardLabel}>LIVE SWITCHYARD</Text><View style={styles.boardTopFill} /><Text style={styles.boardSize}>{level.size} × {level.size}</Text></View>
            <View style={styles.boardCenter}><GameBoard board={state.board} controlsDisabled={busy || isPaused || completed} animation={animation} blocked={blocked} onArrowPress={exitArrow} onShiftRow={shift} onAnimationComplete={finishAnimation} /></View>
            <View style={styles.boardFooter}><Text style={styles.boardFooterText}>Tap a clear cart · Use ‹ and › to shift a row</Text></View>
            {isPaused && <View style={styles.pauseOverlay}><Text style={styles.pausedTitle}>On a little break?</Text><Text style={styles.pausedText}>The switchyard is ready when you are.</Text><GameButton title="Resume game" onPress={togglePause} style={styles.resume} /><GameButton title="Level selection" kind="secondary" onPress={() => router.replace('/levels')} style={styles.resume} /></View>}
          </View>

          <View style={styles.guideCard}><View style={styles.guideMark}><Text style={styles.guideMarkText}>i</Text></View><View style={styles.guideCopy}><Text style={styles.guideTitle}>How it works</Text><Text style={styles.guideText}>{level.tutorial} Shift rows left or right when a cart is blocked.</Text></View></View>
          <View style={styles.actionRow}><GameButton title="Undo" kind="secondary" disabled={busy || state.history.length === 0 || isPaused || completed} onPress={undo} style={styles.actionButton} /><GameButton title="Restart" kind="secondary" disabled={busy || isPaused || completed} onPress={restart} style={styles.actionButton} /><GameButton title="Hint · soon" kind="secondary" disabled style={styles.actionButton} /></View>
          <Text style={styles.phaseNote}>ALL CARTS MUST EXIT TO WIN</Text>
        </View>
      </ScrollView>
      {completed && (
        <View style={styles.completeOverlay}>
          <View style={styles.completeCard}>
            <Text style={styles.eyebrow}>ALL CARTS DELIVERED</Text>
            <Text style={styles.completeTitle}>Switchyard cleared!</Text>
            <Text style={styles.stars} accessibilityLabel={stars + ' out of three stars'}>{'★'.repeat(stars)}<Text style={styles.emptyStars}>{'☆'.repeat(3 - stars)}</Text></Text>
            <Text style={styles.completeMoves}>{state.moves} moves · Par {level.parMoves}</Text>
            <Text style={styles.completeBest}>Best in this session: {Math.min(state.moves, progress.records[level.id]?.bestMoves ?? state.moves)} moves</Text>
            {nextLevel ? <GameButton title={'Continue · Level ' + nextLevel.id} accessory="→" onPress={() => router.replace({ pathname: '/game/[id]', params: { id: String(nextLevel.id) } })} style={styles.completeButton} /> : <Text style={styles.completeBest}>You cleared all five starter puzzles!</Text>}
            <GameButton title="Play again" kind="secondary" onPress={restart} style={styles.completeButton} />
            <GameButton title="Level selection" kind="ghost" onPress={() => router.replace('/levels')} style={styles.completeButton} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  container: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 49, height: 49, borderRadius: 17, backgroundColor: palette.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: palette.stroke },
  backIcon: { fontSize: 34, color: palette.ink, marginTop: -5 },
  pauseIcon: { color: palette.ink, fontWeight: '900', fontSize: 21 },
  headingWrap: { alignItems: 'center' },
  eyebrow: { color: palette.teal, letterSpacing: 1.5, fontSize: 9, fontWeight: '900' },
  heading: { color: palette.ink, fontWeight: '900', fontSize: 22, marginTop: 3 },
  levelInfo: { marginTop: 32, marginBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelName: { fontWeight: '900', fontSize: 25, letterSpacing: -0.8, color: palette.ink },
  levelDetail: { color: '#9AA4B0', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: 6 },
  movesPill: { width: 69, height: 69, borderRadius: 23, backgroundColor: palette.yellowPale, alignItems: 'center', justifyContent: 'center' },
  movesCount: { color: palette.ink, fontWeight: '900', fontSize: 24, lineHeight: 30 },
  movesLabel: { fontWeight: '900', fontSize: 9, letterSpacing: 1, color: '#A38C63' },
  boardCard: { backgroundColor: palette.white, borderRadius: radius.xl, paddingHorizontal: 11, paddingTop: 20, paddingBottom: 19, borderWidth: 1, borderColor: palette.stroke, shadowColor: palette.shadow, shadowOpacity: 0.06, shadowRadius: 22, shadowOffset: { width: 0, height: 9 }, elevation: 2, overflow: 'hidden' },
  boardTop: { flexDirection: 'row', alignItems: 'center', gap: 7, marginHorizontal: 9 },
  previewDot: { width: 7, height: 7, backgroundColor: palette.coral, borderRadius: 4 },
  boardLabel: { color: palette.muted, fontWeight: '900', fontSize: 10, letterSpacing: 1.4 },
  boardTopFill: { flex: 1 },
  boardSize: { color: '#9AA4B0', fontSize: 12, fontWeight: '800' },
  boardCenter: { alignItems: 'center', justifyContent: 'center', marginTop: 22, marginBottom: 14 },
  boardFooter: { alignItems: 'center', marginHorizontal: 8 },
  boardFooterText: { fontSize: 10, lineHeight: 17, color: palette.muted, textAlign: 'center' },
  guideCard: { flexDirection: 'row', backgroundColor: palette.tealPale, padding: 16, borderRadius: 19, marginTop: 20, gap: 12 },
  guideMark: { backgroundColor: palette.teal, height: 27, width: 27, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  guideMarkText: { color: palette.white, fontWeight: '900', fontSize: 17 },
  guideCopy: { flex: 1 },
  guideTitle: { fontWeight: '900', fontSize: 14, color: palette.ink },
  guideText: { color: '#457D77', fontSize: 12, lineHeight: 19, marginTop: 5 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 22 },
  actionButton: { flex: 1, paddingHorizontal: 6 },
  phaseNote: { color: '#B6B8B7', fontSize: 9, fontWeight: '900', letterSpacing: 1.8, textAlign: 'center', marginTop: 20 },
  pauseOverlay: { ...StyleSheet.absoluteFill, zIndex: 10, backgroundColor: 'rgba(248,246,242,0.97)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 25 },
  pausedTitle: { color: palette.ink, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  pausedText: { color: palette.muted, textAlign: 'center', lineHeight: 21, fontSize: 13, marginTop: 9 },
  resume: { marginTop: 25, minWidth: 190 },
  unknown: { padding: 28, flex: 1, justifyContent: 'center', gap: 16 },
  helper: { color: palette.muted, fontSize: 15 },
  dimmed: { opacity: 0.45 },
  completeOverlay: { ...StyleSheet.absoluteFill, padding: 24, backgroundColor: 'rgba(23,43,77,0.50)', alignItems: 'center', justifyContent: 'center' },
  completeCard: { width: '100%', maxWidth: 430, backgroundColor: palette.background, borderRadius: 30, padding: 24, alignItems: 'center' },
  completeTitle: { fontWeight: '900', color: palette.ink, fontSize: 28, marginTop: 10, textAlign: 'center' },
  stars: { fontSize: 52, color: '#E9B946', letterSpacing: 6, marginTop: 14 },
  emptyStars: { color: '#CACAC7' },
  completeMoves: { marginTop: 12, color: palette.ink, fontSize: 16, fontWeight: '700' },
  completeBest: { marginTop: 9, marginBottom: 10, color: palette.muted, fontSize: 12, textAlign: 'center' },
  completeButton: { alignSelf: 'stretch', marginTop: 10 },
});

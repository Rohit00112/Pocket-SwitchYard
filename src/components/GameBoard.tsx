import { memo, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { Board, Cell } from '@/game/types';
import type { BoardAnimation } from '@/hooks/useGame';
import { palette } from '@/theme/tokens';

import { GridCell } from './GridCell';
import { RowControls } from './RowControls';

interface GameBoardProps {
  board: Board;
  showRowControls?: boolean;
  controlsDisabled?: boolean;
  preview?: boolean;
  animation?: BoardAnimation | null;
  blocked?: { arrowId: string; nonce: number } | null;
  onArrowPress?: (arrowId: string) => void;
  onShiftRow?: (row: number, direction: 'LEFT' | 'RIGHT') => void;
  onAnimationComplete?: () => void;
}

const GAP = 6;

interface LaneProps {
  cells: readonly Cell[];
  rowIndex: number;
  size: number;
  locked: boolean;
  animation?: BoardAnimation | null;
  blocked?: { arrowId: string; nonce: number } | null;
  onArrowPress?: (id: string) => void;
  onAnimationComplete?: () => void;
}

const RowLane = memo(function RowLane({ cells, rowIndex, size, locked, animation, blocked, onArrowPress, onAnimationComplete }: LaneProps) {
  const travel = useSharedValue(0);
  const pitch = size + GAP;
  const span = cells.length * pitch;
  const activeShift = animation?.type === 'SHIFT_ROW' && animation.row === rowIndex ? animation.direction : null;

  useEffect(() => {
    travel.value = 0;
    if (!activeShift) return;
    travel.value = withTiming(activeShift === 'LEFT' ? -pitch : pitch, {
      duration: 270,
      easing: Easing.inOut(Easing.cubic),
    }, (finished) => {
      if (finished && onAnimationComplete) runOnJS(onAnimationComplete)();
    });
  }, [activeShift, pitch, travel, onAnimationComplete]);

  const animated = useAnimatedStyle(() => ({ transform: [{ translateX: travel.value }] }));

  const drawCells = (interactive: boolean) => (
    <View pointerEvents={interactive ? 'auto' : 'none'} style={[styles.cells, { width: span }]}>
      {cells.map((cell, column) => {
        const activeExit = interactive && animation?.type === 'EXIT_ARROW' && cell?.id === animation.arrowId;
        const exitDistance = activeExit
          ? ((cell.direction === 'LEFT' ? column + 1 : cell.direction === 'RIGHT' ? cells.length - column : cell.direction === 'UP' ? rowIndex + 1 : cells.length - rowIndex) * pitch + size)
          : undefined;
        return (
          <View key={cell?.id ?? 'empty-' + column} style={{ marginRight: GAP }}>
            <GridCell
              cell={cell}
              size={size}
              disabled={locked || !interactive}
              onArrowPress={interactive ? onArrowPress : undefined}
              exitDistance={exitDistance}
              blockedNonce={interactive && cell?.id === blocked?.arrowId ? blocked?.nonce : undefined}
              onExitComplete={onAnimationComplete}
            />
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={{ width: span - GAP, height: size, overflow: activeShift ? 'hidden' : 'visible' }}>
      {activeShift ? (
        <Animated.View style={[styles.track, { left: -span }, animated]}>
          {drawCells(false)}
          {drawCells(true)}
          {drawCells(false)}
        </Animated.View>
      ) : drawCells(true)}
    </View>
  );
});

export const GameBoard = memo(function GameBoard({
  board, showRowControls = true, controlsDisabled = true, preview = false,
  animation, blocked, onArrowPress, onShiftRow, onAnimationComplete,
}: GameBoardProps) {
  const { width } = useWindowDimensions();
  const count = board.length;
  const available = Math.max(140, Math.min(width, 520) - (showRowControls ? 172 : 110));
  const cellSize = Math.max(30, Math.floor(Math.min(preview ? 48 : 66, (available - GAP * (count - 1)) / count)));

  return (
    <View style={styles.outer}>
      <View style={styles.rows}>
        {board.map((row, rowIndex) => (
          <View key={'row-' + rowIndex} style={[styles.row, { marginBottom: rowIndex === count - 1 ? 0 : GAP }]}>
            {showRowControls && <RowControls side="LEFT" row={rowIndex} cellSize={cellSize} disabled={controlsDisabled} onPress={onShiftRow} />}
            <RowLane cells={row} rowIndex={rowIndex} size={cellSize} locked={controlsDisabled || preview} animation={animation} blocked={blocked} onArrowPress={onArrowPress} onAnimationComplete={onAnimationComplete} />
            {showRowControls && <RowControls side="RIGHT" row={rowIndex} cellSize={cellSize} disabled={controlsDisabled} onPress={onShiftRow} />}
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outer: { alignItems: 'center', justifyContent: 'center' },
  rows: { padding: 6, borderRadius: 22, backgroundColor: palette.board },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cells: { flexDirection: 'row' },
  track: { position: 'absolute', top: 0, flexDirection: 'row' },
});

import { memo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import type { Board } from '@/game/types';
import { palette } from '@/theme/tokens';

import { GridCell } from './GridCell';
import { RowControls } from './RowControls';

interface GameBoardProps {
  board: Board;
  showRowControls?: boolean;
  controlsDisabled?: boolean;
  preview?: boolean;
  onShiftRow?: (row: number, direction: 'LEFT' | 'RIGHT') => void;
}

const GAP = 6;

export const GameBoard = memo(function GameBoard({ board, showRowControls = true, controlsDisabled = true, preview = false, onShiftRow }: GameBoardProps) {
  const { width } = useWindowDimensions();
  const count = board.length;
  // Reserve space for both row-control columns and the card's padding.
  const available = Math.max(144, Math.min(width, 520) - (showRowControls ? 140 : 100));
  const cellSize = Math.max(30, Math.floor(Math.min(preview ? 48 : 66, (available - GAP * (count - 1)) / count)));

  return (
    <View style={styles.outer}>
      <View style={styles.rows}>
        {board.map((row, rowIndex) => (
          <View key={'row-' + rowIndex} style={[styles.row, { marginBottom: rowIndex === count - 1 ? 0 : GAP }]}>
            {showRowControls && <RowControls side="LEFT" row={rowIndex} cellSize={cellSize} disabled={controlsDisabled} onPress={onShiftRow} />}
            <View style={styles.cells}>
              {row.map((cell, colIndex) => (
                <View key={cell?.id ?? 'empty-' + rowIndex + '-' + colIndex} style={{ marginRight: colIndex === row.length - 1 ? 0 : GAP }}>
                  <GridCell cell={cell} size={cellSize} />
                </View>
              ))}
            </View>
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
});

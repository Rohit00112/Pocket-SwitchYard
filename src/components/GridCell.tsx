import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Cell } from '@/game/types';
import { palette } from '@/theme/tokens';

import { ArrowTile } from './ArrowTile';

interface GridCellProps {
  cell: Cell; size: number; disabled?: boolean; onArrowPress?: (id: string) => void;
  exitDistance?: number; blockedNonce?: number; onExitComplete?: () => void;
  highlighted?: boolean;
  reducedMotion?: boolean;
}

export const GridCell = memo(function GridCell({ cell, size, disabled, onArrowPress, exitDistance, blockedNonce, onExitComplete, highlighted, reducedMotion }: GridCellProps) {
  return (
    <View style={[styles.cell, { width: size, height: size, borderRadius: Math.max(11, size * 0.25) }]}>
      {cell && <ArrowTile arrow={cell} size={size} disabled={disabled} onPress={() => onArrowPress?.(cell.id)} exitDistance={exitDistance} blockedNonce={blockedNonce} onExitComplete={onExitComplete} highlighted={highlighted} reducedMotion={reducedMotion} />}
    </View>
  );
});

const styles = StyleSheet.create({ cell: { backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' } });

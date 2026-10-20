import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Cell } from '@/game/types';
import { palette } from '@/theme/tokens';

import { ArrowTile } from './ArrowTile';

interface GridCellProps { cell: Cell; size: number; }

export const GridCell = memo(function GridCell({ cell, size }: GridCellProps) {
  return (
    <View style={[styles.cell, { width: size, height: size, borderRadius: Math.max(11, size * 0.25) }]}>
      {cell && <ArrowTile arrow={cell} size={size} />}
    </View>
  );
});

const styles = StyleSheet.create({ cell: { backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' } });

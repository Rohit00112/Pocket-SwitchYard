import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Arrow, Direction } from '@/game/types';
import { directionStyles } from '@/theme/tokens';

const rotations: Record<Direction, string> = {
  RIGHT: '0deg', DOWN: '90deg', LEFT: '180deg', UP: '-90deg',
};

interface ArrowTileProps {
  arrow: Arrow;
  size: number;
}

/** The arrow is drawn from Views to stay crisp at any device density. */
export const ArrowTile = memo(function ArrowTile({ arrow, size }: ArrowTileProps) {
  const color = directionStyles[arrow.direction];
  return (
    <View
      accessibilityLabel={arrow.direction.toLowerCase() + ' cart'}
      style={[styles.tile, { width: size, height: size, borderRadius: Math.max(10, size * 0.24), backgroundColor: color.surface }]}
    >
      <View style={[styles.symbol, { width: size * 0.58, height: size * 0.58, transform: [{ rotate: rotations[arrow.direction] }] }] }>
        <View style={[styles.shaft, { height: Math.max(3, size * 0.09), backgroundColor: color.icon }]} />
        <View style={[styles.arrowTip, { borderColor: color.icon, width: size * 0.19, height: size * 0.19, borderTopWidth: Math.max(3, size * 0.09), borderRightWidth: Math.max(3, size * 0.09) }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  tile: { justifyContent: 'center', alignItems: 'center' },
  symbol: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  shaft: { width: '62%', borderRadius: 8 },
  arrowTip: { transform: [{ rotate: '45deg' }], marginLeft: -8 },
});

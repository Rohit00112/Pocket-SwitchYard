import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import type { Arrow, Direction } from '@/game/types';
import { directionStyles } from '@/theme/tokens';

const rotations: Record<Direction, string> = {
  RIGHT: '0deg', DOWN: '90deg', LEFT: '180deg', UP: '-90deg',
};

interface ArrowTileProps {
  arrow: Arrow;
  size: number;
  disabled?: boolean;
  onPress?: () => void;
  exitDistance?: number;
  blockedNonce?: number;
  onExitComplete?: () => void;
}

/** The arrow is drawn from Views to stay crisp at any device density. */
export const ArrowTile = memo(function ArrowTile({ arrow, size, disabled = false, onPress, exitDistance, blockedNonce, onExitComplete }: ArrowTileProps) {
  const color = directionStyles[arrow.direction];
  const exitProgress = useSharedValue(0);
  const shakeX = useSharedValue(0);
  useEffect(() => {
    if (exitDistance === undefined) {
      exitProgress.value = 0;
      return;
    }
    exitProgress.value = 0;
    exitProgress.value = withTiming(1, { duration: 280, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished && onExitComplete) runOnJS(onExitComplete)();
    });
  }, [exitDistance, exitProgress, onExitComplete]);
  useEffect(() => {
    if (!blockedNonce) return;
    shakeX.value = withSequence(withTiming(-6, { duration: 45 }), withTiming(6, { duration: 80 }), withTiming(-3, { duration: 65 }), withTiming(0, { duration: 45 }));
  }, [blockedNonce, shakeX]);
  const animated = useAnimatedStyle(() => {
    const distance = exitProgress.value * (exitDistance ?? 0);
    const horizontal = arrow.direction === 'LEFT' ? -distance : arrow.direction === 'RIGHT' ? distance : 0;
    const vertical = arrow.direction === 'UP' ? -distance : arrow.direction === 'DOWN' ? distance : 0;
    return { opacity: 1 - exitProgress.value * 0.35, transform: [{ translateX: horizontal + shakeX.value }, { translateY: vertical }] };
  });
  return (
    <Animated.View style={animated}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={arrow.direction.toLowerCase() + ' cart'}
        accessibilityHint="Send this cart off the board when its path is clear"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={[styles.tile, { width: size, height: size, borderRadius: Math.max(10, size * 0.24), backgroundColor: color.surface }]}
      >
        <View style={[styles.symbol, { width: size * 0.58, height: size * 0.58, transform: [{ rotate: rotations[arrow.direction] }] }] }>
          <View style={[styles.shaft, { height: Math.max(3, size * 0.09), backgroundColor: color.icon }]} />
          <View style={[styles.arrowTip, { borderColor: color.icon, width: size * 0.19, height: size * 0.19, borderTopWidth: Math.max(3, size * 0.09), borderRightWidth: Math.max(3, size * 0.09) }]} />
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  tile: { justifyContent: 'center', alignItems: 'center' },
  symbol: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  shaft: { width: '62%', borderRadius: 8 },
  arrowTip: { transform: [{ rotate: '45deg' }], marginLeft: -8 },
});

import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/theme/tokens';

interface RowControlsProps { side: 'LEFT' | 'RIGHT'; row: number; cellSize: number; disabled: boolean; highlighted?: boolean; onPress?: (row: number, direction: 'LEFT' | 'RIGHT') => void; }

export const RowControls = memo(function RowControls({ side, row, cellSize, disabled, highlighted, onPress }: RowControlsProps) {
  return (
    <View style={[styles.slot, { height: Math.max(44, cellSize) }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={'Shift row ' + (row + 1) + ' ' + side.toLowerCase()}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => onPress?.(row, side)}
        style={({ pressed }) => [styles.control, highlighted && styles.highlight, pressed && !disabled && styles.pressed]}
      >
        <Text style={[styles.arrow, disabled && styles.disabled]}>{side === 'LEFT' ? '‹' : '›'}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  slot: { width: 40, alignItems: 'center', justifyContent: 'center' },
  control: { width: 40, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white, borderWidth: 1, borderColor: palette.stroke },
  pressed: { transform: [{ scale: 0.92 }] },
  arrow: { color: palette.ink, fontSize: 29, fontWeight: '600', lineHeight: 31, marginTop: -3 },
  disabled: { color: '#B4BDC4' },
  highlight: { borderColor: '#167D6D', borderWidth: 3, backgroundColor: '#C4F3E4' },
});

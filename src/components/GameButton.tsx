import { memo } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { palette, radius } from '@/theme/tokens';

interface GameButtonProps {
  title: string;
  onPress?: () => void;
  kind?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  accessory?: string;
}

export const GameButton = memo(function GameButton({ title, onPress, kind = 'primary', disabled = false, style, accessory }: GameButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.base, styles[kind], disabled && styles.disabled, pressed && styles.pressed, style]}
    >
      <Text style={[styles.label, kind === 'primary' ? styles.primaryLabel : styles.otherLabel, disabled && styles.disabledLabel]}>{title}</Text>
      {accessory && <Text style={[styles.accessory, kind === 'primary' ? styles.primaryLabel : styles.otherLabel]}>{accessory}</Text>}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: { minHeight: 54, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 20 },
  primary: { backgroundColor: palette.ink },
  secondary: { backgroundColor: palette.white, borderColor: palette.stroke, borderWidth: 1 },
  ghost: { backgroundColor: '#EDEAE4' },
  label: { fontSize: 15, fontWeight: '700', letterSpacing: 0.1 },
  primaryLabel: { color: palette.white },
  otherLabel: { color: palette.ink },
  accessory: { fontSize: 22, fontWeight: '500', marginTop: -2 },
  disabled: { opacity: 0.4 },
  disabledLabel: { color: palette.muted },
  pressed: { transform: [{ scale: 0.975 }], opacity: 0.92 },
});

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette } from '@/theme/tokens';

/** Three miniature tracks and a cart form the Pocket Switchyard mark. */
export const BrandMark = memo(function BrandMark({ size = 68 }: { size?: number }) {
  const scale = size / 68;
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: 20 * scale }]}>
      <View style={[styles.track, { width: 36 * scale, height: 6 * scale, top: 21 * scale, left: 16 * scale }]} />
      <View style={[styles.track, { width: 29 * scale, height: 6 * scale, top: 31 * scale, left: 16 * scale }]} />
      <View style={[styles.track, { width: 36 * scale, height: 6 * scale, top: 41 * scale, left: 16 * scale }]} />
      <View style={[styles.cart, { width: 16 * scale, height: 16 * scale, borderRadius: 5 * scale, top: 26 * scale, left: 32 * scale }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  outer: { backgroundColor: palette.ink, justifyContent: 'center', overflow: 'hidden' },
  track: { position: 'absolute', backgroundColor: '#7A8EA5', borderRadius: 10 },
  cart: { position: 'absolute', backgroundColor: palette.yellow, borderWidth: 2, borderColor: palette.ink },
});

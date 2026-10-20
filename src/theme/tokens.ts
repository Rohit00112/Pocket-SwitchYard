/** Shared visual tokens. Keep colors and spacing consistent across screens. */
export const palette = {
  background: '#F8F6F2',
  ink: '#172B4D',
  muted: '#738095',
  teal: '#35B7A6',
  tealPale: '#D7F4EB',
  sky: '#62A8E5',
  skyPale: '#DCEFFD',
  coral: '#FF8073',
  coralPale: '#FFE4DD',
  yellow: '#FFD76E',
  yellowPale: '#FFF3D1',
  white: '#FFFFFF',
  stroke: '#E9E7E2',
  board: '#F0EEE9',
  shadow: '#223555',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, huge: 48 } as const;
export const radius = { sm: 12, md: 18, lg: 24, xl: 32, pill: 999 } as const;

export const directionStyles = {
  UP: { surface: palette.skyPale, icon: '#3F89CC' },
  DOWN: { surface: palette.yellowPale, icon: '#D19A24' },
  LEFT: { surface: palette.coralPale, icon: '#E86D61' },
  RIGHT: { surface: palette.tealPale, icon: '#199988' },
} as const;

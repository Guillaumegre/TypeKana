import { Platform } from 'react-native';

/**
 * Warm-paper palette: cream page, ink text, vermillion seal accent.
 */
export const C = {
  paper: '#F2EFE8',
  card: '#FBF9F5',
  ink: '#14161A',
  inkSoft: 'rgba(20,22,26,.5)',
  inkFaint: 'rgba(20,22,26,.38)',
  line: 'rgba(20,22,26,.1)',
  lineStrong: 'rgba(20,22,26,.16)',
  accent: '#C8452A',
  accentDark: '#B23A21',
  onDark: '#F2EFE8',
  onDarkSoft: 'rgba(242,239,232,.6)',
  onDarkFaint: 'rgba(242,239,232,.4)',
  watermark: 'rgba(242,239,232,.09)',
  watermarkWarm: 'rgba(255,255,255,.14)',
  watermarkInk: 'rgba(20,22,26,.06)',
  ok: '#2F7D4F',
};

/**
 * Japanese display type without bundling webfonts: iOS ships Hiragino Mincho ProN
 * (serif/mincho) and Hiragino Sans, Android exposes Noto CJK as serif/sans-serif.
 * Bundling Zen Kaku Gothic New + Shippori Mincho would add several MB per weight.
 */
export const FONT = {
  mincho: Platform.select({ ios: 'Hiragino Mincho ProN', android: 'serif', default: 'serif' }),
  gothic: Platform.select({ ios: 'Hiragino Sans', android: 'sans-serif', default: 'sans-serif' }),
};

export const R = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 22,
};

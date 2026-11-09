import { colors, ThemeColors } from './colors';
import { ThemeMode } from '../types';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  roundness: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}

export const getTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: colors[mode],
  roundness: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    xl: '28px',
    full: '9999px',
  },
});

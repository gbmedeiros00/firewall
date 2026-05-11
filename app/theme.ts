import { Platform } from 'react-native';

// Paleta Clara (Light Mode)
export const lightColors = {
  background: '#F4F5F7', 
  surface: '#FFFFFF',
  surfaceAlt: '#ECEEF2',
  primary: '#1F3864',
  secondary: '#536079',
  tertiary: '#2E59A8',
  neutral: '#77777B',
  border: '#DDE1E9',
  textPrimary: '#1A1F2E',
  textSecondary: '#536079',
  textDisabled: '#A0A9B8',
  placeholder: '#A0A9B8',
  success: '#1D9E75',
  warning: '#EF9F27',
  error: '#E24B4A',
  info: '#2E59A8',
  white: '#FFFFFF',
  black: '#000000',
};

// Paleta Vault Sentinel - Dark Matte Edition
export const darkColors = {
  background: '#0F141E', // Grafite profundo
  surface: '#1A2235',    // Cards um pouco mais claros para profundidade
  surfaceAlt: '#252F48', // Elementos de destaque em hover/alt
  primary: '#2E59A8',    // Azul vibrante para manter ações primárias ativas
  secondary: '#8F9BB3',
  tertiary: '#3B6199',
  neutral: '#9CA3AF',
  border: '#2E3A59',
  textPrimary: '#F9FAFB', // Branco Gelo
  textSecondary: '#D1D5DB', // Cinza claro
  textDisabled: '#6B7280',
  placeholder: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',      // Vermelho Alerta
  info: '#3B82F6',
  white: '#FFFFFF',
  black: '#000000',
};

export type ThemeColors = typeof lightColors;

// Mantido para compatibilidade reversa temporária com componentes não refatorados
export const COLORS = {
  primary:   '#1F3864',
  secondary: '#536079',
  tertiary:  '#2E59A8',
  neutral:   '#77777B',

  // Tints
  primaryLight:   '#2E4A7A',
  primaryLighter: '#3B6199',
  tertiaryLight:  '#4472C4',
  tertiaryFaint:  '#EEF3FB',

  // Neutrals
  white:       '#FFFFFF',
  surface:     '#F4F5F7',
  surfaceAlt:  '#ECEEF2',
  border:      '#DDE1E9',
  borderFocus: '#2E59A8',

  // Text
  textPrimary:  '#1A1F2E',
  textSecondary:'#536079',
  textDisabled: '#A0A9B8',
  placeholder:  '#A0A9B8',

  // Semantic
  success: '#1D9E75',
  warning: '#EF9F27',
  error:   '#E24B4A',
  info:    '#2E59A8',
} as const;

export const FONTS = {
  // Space Grotesk → headings
  headline: Platform.select({ ios: 'Georgia', default: 'serif' }),
  // Inter → body / labels
  body:     Platform.select({ ios: 'System',  default: 'sans-serif' }),
  // Monospace → passwords
  mono:     Platform.select({ ios: 'Courier', default: 'monospace' }),
} as const;

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl:32,
} as const;

export const RADIUS = {
  sm:  6,
  md:  10,
  lg:  14,
  xl:  20,
  full: 999,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#1F3864',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

// Button variants matching style guide
export const BUTTON = {
  primary: {
    background: COLORS.primary,
    text:       COLORS.white,
    border:     COLORS.primary,
  },
  secondary: {
    background: COLORS.white,
    text:       COLORS.primary,
    border:     COLORS.primary,
  },
  inverted: {
    background: COLORS.textPrimary,
    text:       COLORS.white,
    border:     COLORS.textPrimary,
  },
  outlined: {
    background: 'transparent',
    text:       COLORS.textPrimary,
    border:     COLORS.border,
  },
} as const;
// Radix color utility functions and constants
export const colors = {
  // Primary brand colors (Blue - Havahart style)
  primary: {
    50: 'var(--blue-1)',
    100: 'var(--blue-2)',
    200: 'var(--blue-3)',
    300: 'var(--blue-4)',
    400: 'var(--blue-5)',
    500: 'var(--blue-6)',
    600: 'var(--blue-7)',
    700: 'var(--blue-8)',
    800: 'var(--blue-9)',
    900: 'var(--blue-10)',
    950: 'var(--blue-11)',
  },
  
  // Secondary colors (Red for CTAs)
  secondary: {
    50: 'var(--red-1)',
    100: 'var(--red-2)',
    200: 'var(--red-3)',
    300: 'var(--red-4)',
    400: 'var(--red-5)',
    500: 'var(--red-6)',
    600: 'var(--red-7)',
    700: 'var(--red-8)',
    800: 'var(--red-9)',
    900: 'var(--red-10)',
    950: 'var(--red-11)',
  },
  
  // Gray scale
  gray: {
    50: 'var(--slate-1)',
    100: 'var(--slate-2)',
    200: 'var(--slate-3)',
    300: 'var(--slate-4)',
    400: 'var(--slate-5)',
    500: 'var(--slate-6)',
    600: 'var(--slate-7)',
    700: 'var(--slate-8)',
    800: 'var(--slate-9)',
    900: 'var(--slate-10)',
    950: 'var(--slate-11)',
  },
  
  // Success colors
  success: {
    50: 'var(--green-1)',
    500: 'var(--green-6)',
    600: 'var(--green-7)',
    700: 'var(--green-8)',
    800: 'var(--green-9)',
    900: 'var(--green-10)',
  },
  
  // Warning colors
  warning: {
    50: 'var(--amber-1)',
    500: 'var(--amber-6)',
    600: 'var(--amber-7)',
    700: 'var(--amber-8)',
    800: 'var(--amber-9)',
    900: 'var(--amber-10)',
  },
} as const;

// Modern, sophisticated color palette for wildlife control brand
export const brandColors = {
  // Primary brand colors - Deep forest green (nature, wildlife)
  primary: '#0F4C3A', // Deep forest green
  primaryHover: '#1A5D4A',
  primaryLight: '#E8F5F1',
  primaryLighter: '#F5FAFB',
  
  // Secondary accent - Warm earth orange
  secondary: '#D97706', // Warm amber/orange
  secondaryHover: '#B45309',
  secondaryLight: '#FEF3C7',
  
  // Tertiary - Professional blue-gray
  tertiary: '#374151',
  tertiaryHover: '#4B5563',
  tertiaryLight: '#F3F4F6',
  
  // Action colors
  success: '#10B981', // Modern green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Modern red
  info: '#3B82F6', // Blue
  
  // Neutral palette - Warm grays
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Special accent colors
  accent: '#8B5CF6', // Purple for premium features
  accentLight: '#F3E8FF',
  
  // Background variations
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  textInverse: '#FFFFFF',
} as const;

// Utility function to get CSS custom property
export function getCSSVar(variable: string): string {
  return `var(--${variable})`;
}

// Modern button and component styles
export const componentStyles = {
  buttons: {
    primary: {
      background: brandColors.primary,
      hover: brandColors.primaryHover,
      text: brandColors.white,
      shadow: '0 4px 12px rgba(15, 76, 58, 0.15)',
      hoverShadow: '0 8px 20px rgba(15, 76, 58, 0.2)',
    },
    secondary: {
      background: brandColors.secondary,
      hover: brandColors.secondaryHover,
      text: brandColors.white,
      shadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
      hoverShadow: '0 8px 20px rgba(217, 119, 6, 0.2)',
    },
    outline: {
      background: 'transparent',
      hover: brandColors.gray50,
      text: brandColors.primary,
      border: brandColors.primary,
      hoverBorder: brandColors.primaryHover,
    },
    ghost: {
      background: 'transparent',
      hover: brandColors.gray100,
      text: brandColors.textSecondary,
    },
  },
  
  cards: {
    primary: {
      background: brandColors.white,
      border: brandColors.gray200,
      shadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      hoverShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      radius: '12px',
    },
    elevated: {
      background: brandColors.white,
      border: 'none',
      shadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      hoverShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
      radius: '16px',
    },
  },
  
  gradients: {
    primary: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryHover} 100%)`,
    hero: `linear-gradient(135deg, ${brandColors.primary} 0%, #0A3D2E 50%, ${brandColors.tertiary} 100%)`,
    accent: `linear-gradient(135deg, ${brandColors.secondary} 0%, ${brandColors.warning} 100%)`,
  },
} as const;

// Typography system
export const typography = {
  fontFamilies: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;
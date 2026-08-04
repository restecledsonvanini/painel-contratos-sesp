/** Design tokens — espelho dos CSS vars (logo DEST). Preferir var(--*) no CSS. */
export const theme = {
  colors: {
    primary: '#002d54',
    primaryDark: '#001f3d',
    primaryLight: '#e8eef5',
    brandGreen: '#0e5235',
    secondary: '#475569',
    background: '#f3f4f6',
    surface: '#ffffff',
    surfaceMuted: '#f9fafb',
    text: '#0f172a',
    textMuted: '#6b7280',
    textInverse: '#ffffff',
    border: '#e5e7eb',
    borderStrong: '#d1d5db',
    success: '#0e5235',
    danger: '#dc2626',
    warning: '#d97706',
    heading: '#002d54',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.375rem',
      '2xl': '1.75rem',
    },
  },
  layout: {
    sidebarExpanded: '16rem',
    sidebarCollapsed: '4.5rem',
    headerHeight: '3.75rem',
  },
} as const;

export type ThemeTokens = typeof theme;

export const Theme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceSecondary: '#2A2A2A',
    border: '#333333',
    orange: '#FF9500',
    green: '#34C759',
    white: '#FFFFFF',
    textPrimary: '#FFFFFF',
    textSecondary: '#888888',
    error: '#FF3B30',
    overlay: 'rgba(0,0,0,0.85)',
  },
  typography: {
    anton: 'Anton-Regular',
    inter: 'Inter-Regular',
    interMedium: 'Inter-Medium',
    interSemiBold: 'Inter-SemiBold',
  },
  spring: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  },
  /** Centralised motion tokens – used by every animated component. */
  motion: {
    /** Duration tiers in milliseconds */
    duration: {
      micro: 100, // hover / press feedback
      short: 160, // menu enter / label fade
      screen: 250, // screen-level transition
    },
    /** Vertical lift distances for "soft reveal" feel */
    lift: {
      sm: 6, // tab crossfade lift
      md: 12, // menu / sheet lift
    },
    /**
     * Cubic-bezier control points for `Easing.bezier()`.
     * outCubic: fast decelerate – good for enters.
     * outQuad:  gentler decelerate – good for layout shifts.
     */
    easing: {
      outCubic: [0.33, 1, 0.68, 1] as const,
      outQuad: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  borderRadius: {
    default: 16,
    large: 24,
    pill: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  shadows: {
    morphicInner: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    morphicOuter: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  glassmorphism: {
    background: 'rgba(30,30,30,0.9)',
    borderWidth: 1,
    borderColor: '#333333',
    blurRadius: 20,
  },
} as const;

export type ThemeColors = typeof Theme.colors;
export type SpringConfig = typeof Theme.spring;

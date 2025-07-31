/**
 * Centralized design tokens for Nexus
 * Following the minimalist design philosophy
 */

// Base unit for spacing (8px)
const SPACE_UNIT = 8;

export const tokens = {
  // Spacing system (8px base)
  space: {
    0: '0',
    1: `${SPACE_UNIT}px`,      // 8px
    2: `${SPACE_UNIT * 2}px`,   // 16px
    3: `${SPACE_UNIT * 3}px`,   // 24px
    4: `${SPACE_UNIT * 4}px`,   // 32px
    5: `${SPACE_UNIT * 5}px`,   // 40px
    6: `${SPACE_UNIT * 6}px`,   // 48px
    7: `${SPACE_UNIT * 7}px`,   // 56px
    8: `${SPACE_UNIT * 8}px`,   // 64px
  },

  // Border radius values
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },

  // Consistent shadows
  shadow: {
    none: 'none',
    sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 12px 40px rgba(0, 0, 0, 0.15)',
    focus: '0 0 0 3px rgba(78, 205, 196, 0.1)',
  },

  // Color palette
  colors: {
    // Canvas layers
    canvas: {
      base: '#0F0F23',
      raised: 'rgba(255, 255, 255, 0.02)',
      overlay: 'rgba(255, 255, 255, 0.03)',
      section: 'rgba(255, 255, 255, 0.02)',
    },

    // Text hierarchy
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.85)',
      tertiary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.6)',
      placeholder: 'rgba(255, 255, 255, 0.4)',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },

    // Brand colors
    brand: {
      primary: '#4ECDC4',
      primaryAlpha: 'rgba(78, 205, 196, 0.9)',
      primaryHover: 'rgba(78, 205, 196, 1)',
      primaryFocus: 'rgba(78, 205, 196, 0.3)',
      primarySubtle: 'rgba(78, 205, 196, 0.1)',
    },

    // Accent colors
    accent: {
      coral: '#FF6B6B',
      coralAlpha: 'rgba(255, 107, 107, 0.9)',
      amber: '#FFE66D',
      amberAlpha: 'rgba(255, 230, 109, 0.9)',
      emerald: '#10B981',
      emeraldAlpha: 'rgba(16, 185, 129, 0.9)',
    },

    // Borders
    border: {
      default: 'rgba(255, 255, 255, 0.06)',
      hover: 'rgba(255, 255, 255, 0.08)',
      focus: 'rgba(78, 205, 196, 0.3)',
      subtle: 'rgba(255, 255, 255, 0.04)',
    },
  },

  // Glass morphism effects
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      blur: 'blur(40px)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      blur: 'blur(40px)',
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      blur: 'blur(40px)',
    },
    dark: {
      background: 'rgba(15, 15, 35, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      blur: 'blur(20px)',
    },
  },

  // Typography
  typography: {
    // Font families
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
    },

    // Font sizes
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '15px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      display: '56px',
    },

    // Font weights
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    // Line heights
    lineHeight: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },

    // Letter spacing
    letterSpacing: {
      tighter: '-0.03em',
      tight: '-0.02em',
      normal: '0',
      wide: '0.01em',
    },
  },

  // Transitions
  transition: {
    // Timing functions
    ease: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Duration
    duration: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    base: 0,
    raised: 10,
    dropdown: 20,
    overlay: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Content widths
  contentWidth: {
    xs: '480px',
    sm: '600px',
    md: '768px',
    lg: '900px',
    xl: '1200px',
    '2xl': '1400px',
    full: '1600px',
  },
};

// Helper functions for using tokens
export const getSpacing = (multiplier: number): string => {
  return `${SPACE_UNIT * multiplier}px`;
};

export const getGlassStyle = (variant: 'light' | 'medium' | 'strong' | 'dark' = 'light') => {
  const glass = tokens.glass[variant];
  return {
    background: glass.background,
    backdropFilter: glass.blur,
    border: glass.border,
  };
};

export const getFocusStyle = () => ({
  boxShadow: tokens.shadow.focus,
  borderColor: tokens.colors.border.focus,
  outline: 'none',
});

export const getTextStyle = (level: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'placeholder' = 'primary') => ({
  color: tokens.colors.text[level],
});

// Export as default for convenience
export default tokens;
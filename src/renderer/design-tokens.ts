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

  // Consistent shadows - Warmer tones
  shadow: {
    none: 'none',
    sm: '0 1px 3px rgba(61, 40, 23, 0.06)',
    md: '0 2px 8px rgba(61, 40, 23, 0.08)',
    lg: '0 4px 16px rgba(61, 40, 23, 0.10)',
    xl: '0 8px 32px rgba(61, 40, 23, 0.12)',
    focus: '0 0 0 3px rgba(255, 140, 66, 0.15)',
    glow: '0 4px 20px rgba(255, 140, 66, 0.3)',
  },

  // Color palette - Warm, energetic, cohesive
  colors: {
    // Canvas layers - Warm, inviting backgrounds
    canvas: {
      base: '#FFF9F5',  // Warm white with orange tint
      raised: '#FFFFFF',
      overlay: 'rgba(255, 255, 255, 0.95)',
      section: '#FFFBF8',
    },

    // Text hierarchy - Refined contrast
    text: {
      primary: '#1F1611',     // Rich warm black
      secondary: '#5C4033',    // Warm brown
      tertiary: '#8B6750',     // Muted warm brown
      muted: '#A08875',        // Light brown
      placeholder: '#BFAB9E',  // Very light brown
      disabled: '#D4C4B8',    // Lightest brown
    },

    // Brand colors - Vibrant orange gradient
    brand: {
      primary: '#FF8C42',      // Core orange
      primaryAlpha: 'rgba(255, 140, 66, 0.9)',
      primaryHover: '#FF9652',  // Lighter on hover
      primaryActive: '#FF7A35', // Darker on press
      primaryFocus: 'rgba(255, 140, 66, 0.15)',
      primarySubtle: 'rgba(255, 140, 66, 0.06)',
    },

    // Accent colors - Harmonious warm palette
    accent: {
      warm: '#FFB084',         // Peach
      warmAlpha: 'rgba(255, 176, 132, 0.9)',
      light: '#FFF0E5',        // Light peach
      lightAlpha: 'rgba(255, 240, 229, 0.9)',
      dark: '#3D2817',         // Rich dark brown
      darkAlpha: 'rgba(61, 40, 23, 0.9)',
      success: '#7FB069',      // Sage green for success states
      error: '#E56B6F',        // Coral red for errors
    },

    // Borders - Subtle and minimal
    border: {
      default: 'rgba(0, 0, 0, 0.08)',
      hover: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(255, 140, 66, 0.4)',
      subtle: 'rgba(0, 0, 0, 0.04)',
    },
  },

  // Glass morphism effects - Warm and inviting
  glass: {
    light: {
      background: 'rgba(255, 249, 245, 0.7)',
      border: '1px solid rgba(255, 140, 66, 0.08)',
      blur: 'blur(10px)',
    },
    medium: {
      background: 'rgba(255, 249, 245, 0.85)',
      border: '1px solid rgba(255, 140, 66, 0.1)',
      blur: 'blur(12px)',
    },
    strong: {
      background: 'rgba(255, 249, 245, 0.95)',
      border: '1px solid rgba(255, 140, 66, 0.12)',
      blur: 'blur(16px)',
    },
    dark: {
      background: 'rgba(255, 251, 248, 0.98)',
      border: '1px solid rgba(255, 140, 66, 0.1)',
      blur: 'blur(8px)',
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
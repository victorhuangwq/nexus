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

  // Color palette - Sophisticated, elegant, readable
  colors: {
    // Canvas layers - Clean, sophisticated backgrounds
    canvas: {
      base: '#FEFEFE',         // Pure white base
      raised: '#FFFFFF',       // Crisp white for elevated content
      overlay: 'rgba(255, 255, 255, 0.98)',
      section: '#FAFAFA',      // Subtle warm off-white
      subtle: '#F8F9FA',       // Very light neutral background
    },

    // Text hierarchy - High contrast, readable
    text: {
      primary: '#1A1D21',      // Rich charcoal (high contrast)
      secondary: '#4A5568',    // Professional gray
      tertiary: '#718096',     // Muted gray
      muted: '#A0AEC0',        // Light gray
      placeholder: '#CBD5E0',  // Placeholder gray
      disabled: '#E2E8F0',     // Disabled gray
      inverse: '#FFFFFF',      // White text for dark backgrounds
    },

    // Brand colors - Refined orange with better contrast
    brand: {
      primary: '#F56500',      // More sophisticated orange
      primaryAlpha: 'rgba(245, 101, 0, 0.9)',
      primaryHover: '#E55D00',  // Darker on hover for better UX
      primaryActive: '#D4550A', // Darker on press
      primaryFocus: 'rgba(245, 101, 0, 0.12)',
      primarySubtle: 'rgba(245, 101, 0, 0.04)',
      primaryGradient: 'linear-gradient(135deg, #F56500 0%, #FF8A50 100%)',
    },

    // Surface colors - For cards, headers, backgrounds
    surface: {
      primary: '#FFFFFF',      // Pure white surfaces
      secondary: '#F7FAFC',    // Light neutral surface
      tertiary: '#EDF2F7',     // Lighter neutral
      accent: '#FFF4E6',       // Warm accent surface (very light orange)
      accentStrong: '#FFE5CC', // Stronger warm accent
      border: '#E2E8F0',       // Clean borders
      divider: '#F1F5F9',      // Subtle dividers
    },

    // Accent colors - Expanded sophisticated palette
    accent: {
      // Warm tones
      warm: '#FF8A50',         // Warm accent
      warmAlpha: 'rgba(255, 138, 80, 0.9)',
      warmSubtle: '#FFF7F0',   // Very light warm
      
      // Cool balance
      cool: '#4299E1',         // Cool blue accent
      coolAlpha: 'rgba(66, 153, 225, 0.9)',
      coolSubtle: '#F0F8FF',   // Very light blue
      
      // Neutrals
      light: '#F7FAFC',        // Light neutral
      dark: '#2D3748',         // Dark neutral
      darkAlpha: 'rgba(45, 55, 72, 0.9)',
      
      // Status colors
      success: '#48BB78',      // Modern green
      successSubtle: '#F0FFF4', // Light green background
      warning: '#ED8936',      // Warm warning
      warningSubtle: '#FFFAF0', // Light warning background
      error: '#F56565',        // Modern red
      errorSubtle: '#FFF5F5',   // Light error background
      info: '#4299E1',         // Info blue
      infoSubtle: '#F0F8FF',    // Light info background
    },

    // Borders - More nuanced border system
    border: {
      default: 'rgba(226, 232, 240, 1)',      // Clean default border
      hover: 'rgba(203, 213, 224, 1)',        // Hover state
      focus: 'rgba(245, 101, 0, 0.5)',        // Focus state
      subtle: 'rgba(241, 245, 249, 1)',       // Very subtle border
      strong: 'rgba(160, 174, 192, 1)',       // Strong border for emphasis
    },
  },

  // Glass morphism effects - Modern, sophisticated
  glass: {
    // Subtle glass effects
    light: {
      background: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      blur: 'blur(20px)',
      shadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      blur: 'blur(16px)',
      shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      blur: 'blur(12px)',
      shadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
    },
    // For dark/accent backgrounds
    dark: {
      background: 'rgba(26, 29, 33, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      blur: 'blur(20px)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    // Accent glass with warm tint
    accent: {
      background: 'rgba(255, 244, 230, 0.85)',
      border: '1px solid rgba(245, 101, 0, 0.12)',
      blur: 'blur(16px)',
      shadow: '0 8px 32px rgba(245, 101, 0, 0.15)',
    },
  },

  // Surface treatments - For different UI contexts
  surface: {
    // Card surfaces
    card: {
      background: '#FFFFFF',
      border: '1px solid rgba(226, 232, 240, 1)',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      hoverShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    },
    // Header/hero surfaces
    hero: {
      background: 'linear-gradient(135deg, #F56500 0%, #FF8A50 100%)',
      overlay: 'rgba(0, 0, 0, 0.1)',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    },
    // Input surfaces
    input: {
      background: '#FFFFFF',
      border: '2px solid rgba(226, 232, 240, 1)',
      focusBorder: '2px solid rgba(245, 101, 0, 0.5)',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      focusShadow: '0 0 0 3px rgba(245, 101, 0, 0.1)',
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
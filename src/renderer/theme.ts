import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { tokens } from './design-tokens';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#F0F9FF',
      100: '#E0F2FE', 
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#0EA5E9', // Clean iOS blue
      600: '#0284C7',
      700: '#0369A1',
      800: '#075985',
      900: '#0C4A6E',
    },
    gray: {
      50: '#FAFAFA', // Pure light background
      100: '#F5F5F5',
      200: '#EEEEEE', 
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    accent: {
      purple: '#8B5CF6', // Soft purple
      pink: '#EC4899',   // Gentle pink
      emerald: '#10B981', // Fresh green
      amber: '#F59E0B',   // Warm amber
      indigo: '#6366F1',  // Clean indigo
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  styles: {
    global: {
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      body: {
        bg: 'linear-gradient(135deg, #FAFAFA 0%, #F0F9FF 100%)',
        color: 'gray.800',
        fontFamily: 'Inter',
      },
      '*': {
        boxSizing: 'border-box',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: tokens.typography.fontWeight.medium,
        borderRadius: tokens.radius.md,
        transition: `all ${tokens.transition.duration.fast}`,
      },
      variants: {
        clean: {
          bg: tokens.colors.brand.primaryAlpha,
          color: 'rgba(0, 0, 0, 0.9)',
          fontSize: tokens.typography.fontSize.sm,
          padding: `${tokens.space[1]} ${tokens.space[2]}`,
          _hover: {
            bg: tokens.colors.brand.primaryHover,
            transform: 'translateY(-1px)',
          },
          _active: {
            transform: 'scale(0.98)',
          },
        },
        glass: {
          bg: 'transparent',
          color: tokens.colors.text.secondary,
          border: '1px solid',
          borderColor: tokens.colors.border.default,
          fontSize: tokens.typography.fontSize.sm,
          _hover: {
            bg: tokens.glass.medium.background,
            color: tokens.colors.text.primary,
            borderColor: tokens.colors.border.hover,
            transform: 'translateY(-1px)',
          },
          _active: {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    Input: {
      variants: {
        glass: {
          field: {
            bg: tokens.glass.light.background,
            backdropFilter: tokens.glass.light.blur,
            border: '1px solid',
            borderColor: tokens.colors.border.default,
            borderRadius: tokens.radius.lg,
            color: tokens.colors.text.primary,
            fontSize: tokens.typography.fontSize.base,
            _placeholder: {
              color: tokens.colors.text.placeholder,
            },
            _hover: {
              borderColor: tokens.colors.border.hover,
            },
            _focus: {
              borderColor: tokens.colors.border.focus,
              boxShadow: tokens.shadow.focus,
              bg: tokens.glass.medium.background,
            },
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: tokens.glass.light.background,
          backdropFilter: tokens.glass.light.blur,
          border: tokens.glass.light.border,
          borderRadius: tokens.radius.xl,
          boxShadow: tokens.shadow.md,
        },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: 'rgba(250, 250, 250, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
  },
});

export default theme;
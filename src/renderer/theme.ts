import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

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
      body: {
        bg: 'linear-gradient(135deg, #FAFAFA 0%, #F0F9FF 100%)',
        color: 'gray.800',
        fontFamily: 'Inter',
        overflow: 'hidden',
      },
      '*': {
        boxSizing: 'border-box',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: '16px',
      },
      variants: {
        clean: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          color: 'gray.700',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.9)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    Input: {
      variants: {
        glass: {
          field: {
            bg: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            color: 'gray.800',
            fontSize: 'lg',
            _placeholder: {
              color: 'gray.500',
            },
            _focus: {
              border: '2px solid',
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px rgba(14, 165, 233, 0.1)',
              bg: 'rgba(255, 255, 255, 0.95)',
            },
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
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
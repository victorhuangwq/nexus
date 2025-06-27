import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  HStack,
  Text,
  Container,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import theme from './theme';
import { OmniPrompt } from './components/OmniPrompt';
import { DevHUD } from './components/DevHUD';
import { GraphingCalculator, TokyoTrip, BTCChart, WeatherWidget, PhysicsHomework } from './components/static';
import { matchIntent, type IntentMatch } from './utils/intentMatcher';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Extend the window interface to include our bridge
declare global {
  interface Window {
    bridge: {
      test: () => Promise<{ message: string; timestamp: number }>;
      getEnv: (key: string) => Promise<string | null>;
      callClaude: (type: 'schema' | 'component', payload: any) => Promise<{
        success: boolean;
        data: any;
        type: string;
        payload: any;
      }>;
    };
  }
}

interface RenderedContent {
  id: string;
  type: 'static' | 'generated';
  component?: string;
  content: any;
  timestamp: number;
}

export const App: React.FC = () => {
  const [currentIntent, setCurrentIntent] = useState<string>('');
  const [renderedContent, setRenderedContent] = useState<RenderedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>({});
  const { isOpen: isDevHUDOpen, onOpen: onDevHUDOpen, onClose: onDevHUDClose } = useDisclosure();

  const handleIntentSubmit = async (intent: string) => {
    setCurrentIntent(intent);
    setIsLoading(true);
    
    const startTime = Date.now();
    
    try {
      // First, try to match against static components
      const intentMatch = matchIntent(intent);
      
      if (intentMatch && intentMatch.confidence >= 70) {
        // Add artificial loading delay for demo sites to feel more realistic
        const baseDelay = 1000; // Increased base delay for better demo presentation
        const loadingDelayMs = baseDelay + Math.random() * 800; // 1500-2300ms random delay
        await new Promise(resolve => setTimeout(resolve, loadingDelayMs));
        
        // Use static component
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        setDebugData(prev => ({
          ...prev,
          intentMatch,
          renderTiming: {
            ...prev.renderTiming,
            T_schema: processingTime,
            T_components: loadingDelayMs, // Track the artificial loading time
            T_firstRender: processingTime,
          },
        }));
        
        const newContent: RenderedContent = {
          id: `content-${Date.now()}`,
          type: 'static',
          component: intentMatch.component,
          content: {
            intent,
            match: intentMatch,
          },
          timestamp: Date.now(),
        };
        
        setRenderedContent([newContent]);
      } else {
        // Fall back to Claude API for dynamic generation
        const result = await window.bridge.callClaude('schema', { intent });
        
        const endTime = Date.now();
        const schemaTime = endTime - startTime;
        
        setDebugData(prev => ({
          ...prev,
          schema: result.data,
          intentMatch: intentMatch || null,
          renderTiming: {
            ...prev.renderTiming,
            T_schema: schemaTime,
          },
        }));
        
        const newContent: RenderedContent = {
          id: `content-${Date.now()}`,
          type: 'generated',
          content: {
            intent,
            message: 'I can help with this, but need more details to build something specific.',
            result,
            intentMatch,
          },
          timestamp: Date.now(),
        };
        
        setRenderedContent([newContent]);
      }
      
    } catch (error) {
      console.error('Intent processing failed:', error);
      setDebugData(prev => ({
        ...prev,
        error: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    setCurrentIntent('');
    setRenderedContent([]);
    setDebugData({});
  };

  // Keyboard shortcut for Dev HUD (Option + D)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'd') {
        event.preventDefault();
        if (isDevHUDOpen) {
          onDevHUDClose();
        } else {
          onDevHUDOpen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDevHUDOpen, onDevHUDOpen, onDevHUDClose]);

  const logoVariants = {
    idle: {
      scale: 1,
      opacity: 0.9,
    },
    hover: {
      scale: 1.05,
      opacity: 1,
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <ChakraProvider theme={theme}>
      <Box 
        minH="100vh" 
        bg="linear-gradient(135deg, #0F0F23 0%, #1A1A2E 25%, #16213E 50%, #0F0F23 100%)"
        position="relative"
        overflow="hidden"
      >
        {/* Premium background effects */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.15"
          bgGradient="radial(circle at 20% 20%, #FF6B6B 0%, transparent 50%)"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.12"
          bgGradient="radial(circle at 80% 30%, #4ECDC4 0%, transparent 50%)"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.08"
          bgGradient="radial(circle at 50% 80%, #FFE66D 0%, transparent 60%)"
        />
        
        {/* Animated floating elements - positioned to avoid content */}
        <MotionBox
          position="absolute"
          top="5%"
          right="5%"
          w="150px"
          h="150px"
          borderRadius="50%"
          bg="rgba(255, 107, 107, 0.02)"
          filter="blur(30px)"
          zIndex={1}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <MotionBox
          position="absolute"
          bottom="10%"
          left="5%"
          w="120px"
          h="120px"
          borderRadius="50%"
          bg="rgba(78, 205, 196, 0.02)"
          filter="blur(25px)"
          zIndex={1}
          animate={{
            y: [0, 10, 0],
            x: [0, 5, 0],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <Container maxW="100%" minH="100vh" px={8} position="relative" zIndex={1}>
          {/* Header */}
          <HStack justify="space-between" align="center" py={6} mb={4}>
            <MotionBox
              variants={logoVariants}
              initial="idle"
              whileHover="hover"
              onClick={handleLogoClick}
              cursor="pointer"
            >
              <HStack spacing={3} align="center">
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="8px"
                  bgGradient="linear(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  _before={{
                    content: '""',
                    position: "absolute",
                    inset: "2px",
                    borderRadius: "6px",
                    bg: "rgba(15, 15, 35, 0.9)",
                  }}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color="white"
                    position="relative"
                    zIndex={1}
                  >
                    S
                  </Text>
                </Box>
                <Text
                  fontSize="2xl"
                  fontWeight="700"
                  bgGradient="linear(135deg, #FFFFFF 0%, #E0E0E0 100%)"
                  bgClip="text"
                  userSelect="none"
                  letterSpacing="-0.02em"
                >
                  SquashOS
                </Text>
              </HStack>
            </MotionBox>
            
            <Box
              px={4}
              py={2}
              bg="rgba(255, 255, 255, 0.05)"
              borderRadius="full"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
            >
              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" fontWeight="500">
                v2.0 Beta
              </Text>
            </Box>
          </HStack>

          {/* Main content area */}
          <Box px={4} py={4} position="relative" zIndex={10}>
            <AnimatePresence mode="wait">
              {renderedContent.length === 0 ? (
                <MotionVStack
                  key="prompt-view"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  transition={{ duration: 0.5 }}
                  spacing={8}
                  align="center"
                  w="full"
                  maxW="900px"
                  mx="auto"
                  justify="center"
                  minH="70vh"
                >
                  <VStack spacing={6} textAlign="center">
                    <MotionBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Text
                        fontSize="6xl"
                        fontWeight="800"
                        bgGradient="linear(135deg, #FFFFFF 0%, #FFE66D 30%, #4ECDC4 70%, #FF6B6B 100%)"
                        bgClip="text"
                        lineHeight="1.1"
                        letterSpacing="-0.02em"
                        mb={6}
                      >
                        The Internet.
                        <br />
                        Without the mess.
                      </Text>
                    </MotionBox>
                    
                    <MotionBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Text
                        fontSize="2xl"
                        color="rgba(255, 255, 255, 0.8)"
                        fontWeight="400"
                        lineHeight="1.6"
                        maxW="700px"
                      >
                        Just describe what you need. No tabs, no hunting.
                      </Text>
                    </MotionBox>
                    
                  </VStack>
                  
                  <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    w="full"
                    maxW="700px"
                  >
                    <OmniPrompt
                      onSubmit={handleIntentSubmit}
                      isLoading={isLoading}
                      placeholder="check my gmail, weather in tokyo, latest crypto prices, news about AI..."
                    />
                  </MotionBox>
                </MotionVStack>
              ) : (
                <MotionVStack
                  key="content-view"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  transition={{ duration: 0.5 }}
                  spacing={4}
                  align="center"
                  w="full"
                  maxW="1600px"
                  mx="auto"
                  pb={8}
                >
                  {renderedContent.map(content => (
                    <MotionBox
                      key={content.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      w="full"
                      display="flex"
                      justifyContent="center"
                    >
                      {content.type === 'static' && content.component ? (
                        <Box
                          position="relative"
                          zIndex={20}
                          w="full"
                          bg="rgba(15, 15, 35, 0.8)"
                          borderRadius="24px"
                          p={6}
                          backdropFilter="blur(20px)"
                          border="1px solid rgba(255, 255, 255, 0.1)"
                          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
                        >
                          {content.component === 'GraphingCalculator' && <GraphingCalculator />}
                          {content.component === 'TokyoTrip' && <TokyoTrip />}
                          {content.component === 'BTCChart' && <BTCChart />}
                          {content.component === 'WeatherWidget' && <WeatherWidget />}
                          {content.component === 'PhysicsHomework' && <PhysicsHomework />}
                        </Box>
                      ) : (
                        <Box
                          p={8}
                          bg="rgba(255, 255, 255, 0.05)"
                          backdropFilter="blur(20px)"
                          border="1px solid rgba(255, 255, 255, 0.1)"
                          borderRadius="24px"
                          textAlign="center"
                          boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
                          maxW="600px"
                          position="relative"
                          zIndex={20}
                          overflow="hidden"
                          _before={{
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "1px",
                            bgGradient: "linear(to-r, transparent, rgba(255, 255, 255, 0.3), transparent)"
                          }}
                        >
                          <VStack spacing={6}>
                            <Text fontSize="2xl" fontWeight="700" color="white">
                              "{content.content.intent}"
                            </Text>
                            <Text fontSize="lg" color="rgba(255, 255, 255, 0.8)" fontWeight="400" lineHeight="1.6">
                              {content.content.message}
                            </Text>
                            {content.content.intentMatch && (
                              <Box
                                px={3}
                                py={1}
                                bg="rgba(255, 230, 109, 0.1)"
                                borderRadius="full"
                                border="1px solid rgba(255, 230, 109, 0.2)"
                              >
                                <Text fontSize="sm" color="rgba(255, 230, 109, 0.9)" fontWeight="500">
                                  {content.content.intentMatch.confidence}% match found
                                </Text>
                              </Box>
                            )}
                            <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)" fontWeight="400">
                              Click SquashOS to start over
                            </Text>
                          </VStack>
                        </Box>
                      )}
                    </MotionBox>
                  ))}
                </MotionVStack>
              )}
            </AnimatePresence>
          </Box>

          {/* Footer */}
          <HStack justify="center" py={6} mt={8}>
            <HStack spacing={6}>
              <Text fontSize="xs" color="rgba(255, 255, 255, 0.4)" fontWeight="400">
                Press ⌥ + D for dev tools
              </Text>
              <Box w="1px" h="12px" bg="rgba(255, 255, 255, 0.1)" />
              <Text fontSize="xs" color="rgba(255, 255, 255, 0.4)" fontWeight="400">
                The Future of Browsing • No Tabs Required
              </Text>
            </HStack>
          </HStack>
        </Container>

        {/* Dev HUD */}
        <DevHUD
          isOpen={isDevHUDOpen}
          onClose={onDevHUDClose}
          debugData={debugData}
        />
      </Box>
    </ChakraProvider>
  );
};
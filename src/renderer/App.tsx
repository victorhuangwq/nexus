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
        bg="linear-gradient(135deg, #FAFAFA 0%, #F0F9FF 100%)"
        position="relative"
      >
        {/* Subtle background effects */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.03"
          bgGradient="radial(circle at 25% 25%, brand.500 0%, transparent 60%)"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.02"
          bgGradient="radial(circle at 75% 75%, accent.purple 0%, transparent 60%)"
        />

        <Container maxW="container.xl" minH="100vh" px={6}>
          {/* Header */}
          <HStack justify="space-between" align="center" py={4} mb={2}>
            <MotionBox
              variants={logoVariants}
              initial="idle"
              whileHover="hover"
              onClick={handleLogoClick}
              cursor="pointer"
            >
              <Text
                fontSize="xl"
                fontWeight="600"
                bgGradient="linear(to-r, brand.500, accent.purple)"
                bgClip="text"
                userSelect="none"
              >
                IntentOS
              </Text>
            </MotionBox>
          </HStack>

          {/* Main content area */}
          <Box px={4} py={4}>
            <AnimatePresence mode="wait">
              {renderedContent.length === 0 ? (
                <MotionVStack
                  key="prompt-view"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  transition={{ duration: 0.5 }}
                  spacing={6}
                  align="center"
                  w="full"
                  maxW="600px"
                  mx="auto"
                  justify="center"
                  minH="60vh"
                >
                  <VStack spacing={3} textAlign="center">
                    <Text
                      fontSize="3xl"
                      fontWeight="600"
                      color="gray.800"
                      lineHeight="1.2"
                    >
                      What can I help you with?
                    </Text>
                    <Text
                      fontSize="md"
                      color="gray.600"
                      fontWeight="400"
                      lineHeight="1.5"
                    >
                      Describe what you need and I'll build it for you
                    </Text>
                  </VStack>
                  
                  <OmniPrompt
                    onSubmit={handleIntentSubmit}
                    isLoading={isLoading}
                    placeholder="tools for my physics homework, plan a trip to tokyo, bitcoin chart..."
                  />
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
                  maxW="1400px"
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
                        <Box>
                          {content.component === 'GraphingCalculator' && <GraphingCalculator />}
                          {content.component === 'TokyoTrip' && <TokyoTrip />}
                          {content.component === 'BTCChart' && <BTCChart />}
                          {content.component === 'WeatherWidget' && <WeatherWidget />}
                          {content.component === 'PhysicsHomework' && <PhysicsHomework />}
                        </Box>
                      ) : (
                        <Box
                          p={8}
                          bg="rgba(255, 255, 255, 0.8)"
                          backdropFilter="blur(20px)"
                          border="1px solid rgba(255, 255, 255, 0.9)"
                          borderRadius="24px"
                          textAlign="center"
                          boxShadow="0 8px 32px rgba(0, 0, 0, 0.04)"
                          maxW="600px"
                        >
                          <VStack spacing={4}>
                            <Text fontSize="2xl" fontWeight="600" color="brand.600">
                              "{content.content.intent}"
                            </Text>
                            <Text fontSize="lg" color="gray.700" fontWeight="400">
                              {content.content.message}
                            </Text>
                            {content.content.intentMatch && (
                              <Text fontSize="sm" color="gray.500" fontWeight="400">
                                Partial match ({content.content.intentMatch.confidence}% confidence)
                              </Text>
                            )}
                            <Text fontSize="sm" color="gray.500" fontWeight="400">
                              Click IntentOS to start over
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
          <HStack justify="center" py={3}>
            <Text fontSize="xs" color="gray.400" fontWeight="400">
              Press ⌥ + D for debug info
            </Text>
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
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
import { tokens } from './design-tokens';
import { OmniPrompt } from './components/OmniPrompt';
import { DevHUD } from './components/DevHUD';
import { FloatingInputBar } from './components/FloatingInputBar';
import { GraphingCalculator, TokyoTrip, BTCChart, WeatherWidget, PhysicsHomework } from './components/static';
import { matchIntent, type IntentMatch } from './utils/intentMatcher';
import { workspaceGenerator, type InteractionData } from './services/DynamicWorkspaceGenerator';
import { GeneratedWorkspace } from './components/GeneratedWorkspace';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Bridge interface is defined in preload.ts

interface RenderedContent {
  id: string;
  type: 'static' | 'generated' | 'workspace';
  component?: string;
  content: any;
  timestamp: number;
  workspaceHtml?: string;
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
        
        setDebugData((prev: any) => ({
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
        // Use dynamic workspace generation for all unmatched queries
        const workspaceResult = await workspaceGenerator.generateWorkspace(intent);
        
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        setDebugData((prev: any) => ({
          ...prev,
          workspaceResult,
          renderTiming: {
            ...prev.renderTiming,
            T_workspace: processingTime,
            T_firstRender: processingTime,
          },
        }));
        
        const newContent: RenderedContent = {
          id: `content-${Date.now()}`,
          type: 'workspace',
          workspaceHtml: workspaceResult.htmlContent,
          content: {
            intent,
            metadata: workspaceResult.metadata,
          },
          timestamp: Date.now(),
        };
        
        setRenderedContent([newContent]);
      }
      
    } catch (error) {
      console.error('Intent processing failed:', error);
      
      // Emergency fallback: try static matching with lower confidence threshold
      const intentMatch = matchIntent(intent);
      if (intentMatch && intentMatch.confidence >= 50) {
        const newContent: RenderedContent = {
          id: `content-${Date.now()}`,
          type: 'static',
          component: intentMatch.component,
          content: {
            intent,
            match: intentMatch,
            fallback: true,
          },
          timestamp: Date.now(),
        };
        setRenderedContent([newContent]);
      } else {
        // Show error workspace with basic tools as fallback
        try {
          const fallbackHtml = `
            <div style="padding: 40px; text-align: center; color: #e0e0e0; font-family: system-ui, -apple-system, sans-serif;">
              <h2 style="color: #ff6b6b; margin-bottom: 20px;">Unable to process your request</h2>
              <p style="margin-bottom: 30px; color: #999;">We encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
              <p style="margin-bottom: 40px; color: #999;">Here are some tools you can use instead:</p>
              <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <a href="https://www.google.com/search?q=${encodeURIComponent(intent)}" target="_blank" style="padding: 12px 24px; background: #4285f4; color: white; text-decoration: none; border-radius: 8px;">Search Google</a>
                <a href="https://www.wolframalpha.com/input?i=${encodeURIComponent(intent)}" target="_blank" style="padding: 12px 24px; background: #ff6c2c; color: white; text-decoration: none; border-radius: 8px;">Try Wolfram Alpha</a>
              </div>
            </div>
          `;
          
          const newContent: RenderedContent = {
            id: `content-${Date.now()}`,
            type: 'workspace',
            workspaceHtml: fallbackHtml,
            content: {
              intent,
              error: error instanceof Error ? error.message : String(error),
              fallback: true,
            },
            timestamp: Date.now(),
          };
          setRenderedContent([newContent]);
        } catch (fallbackError) {
          // Last resort: show simple error message
          const newContent: RenderedContent = {
            id: `content-${Date.now()}`,
            type: 'generated',
            content: {
              intent,
              message: 'Sorry, I encountered an error processing your request. Please try again.',
              error: error instanceof Error ? error.message : String(error),
            },
            timestamp: Date.now(),
          };
          setRenderedContent([newContent]);
        }
      }
      
      setDebugData((prev: any) => ({
        ...prev,
        error: error instanceof Error ? error.message : String(error),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    setCurrentIntent('');
    setRenderedContent([]);
    setDebugData({});
    workspaceGenerator.clearHistory();
  };
  
  // Handle interactions from generated workspace
  const handleWorkspaceInteraction = async (interaction: InteractionData) => {
    setIsLoading(true);
    try {
      const workspaceResult = await workspaceGenerator.handleInteraction(interaction);
      
      const newContent: RenderedContent = {
        id: `content-${Date.now()}`,
        type: 'workspace',
        workspaceHtml: workspaceResult.htmlContent,
        content: {
          intent: currentIntent,
          metadata: workspaceResult.metadata,
          interaction,
        },
        timestamp: Date.now(),
      };
      
      setRenderedContent([newContent]);
      
      setDebugData((prev: any) => ({
        ...prev,
        lastInteraction: interaction,
        workspaceHistory: workspaceGenerator.getHistory(),
      }));
    } catch (error) {
      console.error('Workspace interaction failed:', error);
    } finally {
      setIsLoading(false);
    }
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
        bg={`
          radial-gradient(
            ellipse at top left, 
            rgba(78, 205, 196, 0.03) 0%, 
            transparent 50%
          ),
          radial-gradient(
            ellipse at bottom right, 
            rgba(255, 107, 107, 0.02) 0%, 
            transparent 50%
          ),
          linear-gradient(
            135deg, 
            #0F0F23 0%, 
            #1A1A2E 100%
          )
        `}
        position="relative"
        overflow="hidden"
      >

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
                  borderRadius={tokens.radius.sm}
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
                  <Box
                    position="relative"
                    zIndex={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="3" cy="3" r="2" fill="white" />
                      <circle cx="13" cy="3" r="2" fill="white" />
                      <circle cx="3" cy="13" r="2" fill="white" />
                      <circle cx="13" cy="13" r="2" fill="white" />
                      <path d="M3 3L13 13M13 3L3 13" stroke="white" strokeWidth="1.5" opacity="0.6" />
                    </svg>
                  </Box>
                </Box>
                <Text
                  fontSize="2xl"
                  fontWeight="700"
                  bgGradient="linear(135deg, #FFFFFF 0%, #E0E0E0 100%)"
                  bgClip="text"
                  userSelect="none"
                  letterSpacing="-0.02em"
                >
                  Nexus
                </Text>
              </HStack>
            </MotionBox>
            
            <Box
              px={tokens.space[2]}
              py={tokens.space[1]}
              bg={tokens.glass.light.background}
              borderRadius={tokens.radius.full}
              border={tokens.glass.light.border}
              backdropFilter={tokens.glass.light.blur}
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
                        Type a task.
                        <br />
                        Nexus builds the workspace.
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
                        Stop chasing menus and juggling tabs. Just work.
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
                      placeholder="plan a weekend in Kyoto, track BTC/ETH, export slides + email Alice..."
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
                      {content.type === 'workspace' && content.workspaceHtml ? (
                        <Box
                          position="relative"
                          zIndex={20}
                          w="full"
                          bg={tokens.glass.dark.background}
                          borderRadius={tokens.radius['2xl']}
                          backdropFilter={tokens.glass.dark.blur}
                          border={tokens.glass.dark.border}
                          boxShadow={tokens.shadow.lg}
                          overflow="hidden"
                          minH="600px"
                        >
                          <GeneratedWorkspace
                            htmlContent={content.workspaceHtml}
                            onInteract={handleWorkspaceInteraction}
                            workspaceContext={content.id}
                            isLoading={isLoading}
                          />
                        </Box>
                      ) : content.type === 'static' && content.component ? (
                        <Box
                          position="relative"
                          zIndex={20}
                          w="full"
                          bg={tokens.glass.dark.background}
                          borderRadius={tokens.radius['2xl']}
                          p={tokens.space[3]}
                          backdropFilter={tokens.glass.dark.blur}
                          border={tokens.glass.dark.border}
                          boxShadow={tokens.shadow.lg}
                        >
                          {content.component === 'GraphingCalculator' && <GraphingCalculator />}
                          {content.component === 'TokyoTrip' && <TokyoTrip />}
                          {content.component === 'BTCChart' && <BTCChart />}
                          {content.component === 'WeatherWidget' && <WeatherWidget />}
                          {content.component === 'PhysicsHomework' && <PhysicsHomework />}
                        </Box>
                      ) : (
                        <Box
                          p={tokens.space[4]}
                          bg={tokens.glass.medium.background}
                          backdropFilter={tokens.glass.medium.blur}
                          border={tokens.glass.medium.border}
                          borderRadius={tokens.radius['2xl']}
                          textAlign="center"
                          boxShadow={tokens.shadow.md}
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
                              Click Nexus to start over
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
                Your AI workspace builder • One task at a time
              </Text>
            </HStack>
          </HStack>
        </Container>

        {/* Floating Input Bar - only show when viewing generated content */}
        <AnimatePresence>
          {renderedContent.length > 0 && (
            <FloatingInputBar
              onSubmit={handleIntentSubmit}
              isLoading={isLoading}
              placeholder="Type another task..."
            />
          )}
        </AnimatePresence>

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
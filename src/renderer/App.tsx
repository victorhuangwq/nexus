import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  HStack,
  Text,
  Container,
  Button,
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
import { HistoricalWorkspaces } from './components/HistoricalWorkspaces';
import { workspaceCache, type CachedWorkspace } from './services/WorkspaceCache';

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

  // Load workspace cache on app initialization
  useEffect(() => {
    workspaceCache.loadCache();
  }, []);

  const handleIntentSubmit = async (intent: string) => {
    setCurrentIntent(intent);
    setIsLoading(true);
    
    const startTime = Date.now();
    
    try {
      // First, check if we have a cached workspace for this intent
      const cachedWorkspace = workspaceCache.findByIntent(intent);
      if (cachedWorkspace) {
        await handleCachedWorkspaceSelect(cachedWorkspace);
        return;
      }
      
      // Then, try to match against static components
      const intentMatch = matchIntent(intent);
      
      if (intentMatch && intentMatch.confidence >= 80) {
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
        
        // Cache the static workspace
        await workspaceCache.cacheWorkspace(
          intent,
          '', // Static components don't have HTML content
          'static',
          intentMatch.component
        );
        
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
        
        // Cache the dynamic workspace
        await workspaceCache.cacheWorkspace(
          intent,
          workspaceResult.htmlContent,
          'dynamic'
        );
        
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
            <div style="padding: 40px; text-align: center; color: #333; font-family: system-ui, -apple-system, sans-serif;">
              <h2 style="color: #ff6b6b; margin-bottom: 20px;">Unable to process your request</h2>
              <p style="margin-bottom: 30px; color: #666;">We encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
              <p style="margin-bottom: 40px; color: #666;">Here are some tools you can use instead:</p>
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
  
  // Handle selecting a cached workspace
  const handleCachedWorkspaceSelect = async (workspace: CachedWorkspace) => {
    setCurrentIntent(workspace.intent);
    setIsLoading(true);
    
    try {
      if (workspace.metadata.workspaceType === 'static' && workspace.metadata.component) {
        // Render static component from cache
        const newContent: RenderedContent = {
          id: `content-${Date.now()}`,
          type: 'static',
          component: workspace.metadata.component,
          content: {
            intent: workspace.intent,
            cached: true,
          },
          timestamp: Date.now(),
        };
        setRenderedContent([newContent]);
      } else if (workspace.metadata.workspaceType === 'dynamic' && workspace.htmlContent) {
        // Render dynamic workspace from cache
        const newContent: RenderedContent = {
          id: `content-${Date.now()}`,
          type: 'workspace',
          workspaceHtml: workspace.htmlContent,
          content: {
            intent: workspace.intent,
            cached: true,
          },
          timestamp: Date.now(),
        };
        setRenderedContent([newContent]);
      }
      
      // Update access time for cache
      await workspaceCache.updateWorkspaceState(workspace.id, {});
      
    } catch (error) {
      console.error('Failed to load cached workspace:', error);
    } finally {
      setIsLoading(false);
    }
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Dev HUD (Option + D)
      if (event.altKey && event.key === 'd') {
        event.preventDefault();
        if (isDevHUDOpen) {
          onDevHUDClose();
        } else {
          onDevHUDOpen();
        }
      }
      
      // Clear workspace (ESC)
      if (event.key === 'Escape' && renderedContent.length > 0) {
        event.preventDefault();
        handleLogoClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDevHUDOpen, onDevHUDOpen, onDevHUDClose, renderedContent]);

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
        bg={tokens.colors.canvas.base}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle, ${tokens.colors.border.subtle} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      >

        <Container maxW="100%" minH="100vh" px={8} position="relative" zIndex={1}>
          {/* Minimal Header */}
          <HStack justify="space-between" align="center" py={4} mb={2}>
            <MotionBox
              variants={logoVariants}
              initial="idle"
              whileHover="hover"
              onClick={handleLogoClick}
              cursor="pointer"
              opacity={renderedContent.length > 0 ? 1 : 0}
              pointerEvents={renderedContent.length > 0 ? 'auto' : 'none'}
              transition={{ opacity: { duration: 0.3 } }}
            >
              <HStack spacing={2} align="center">
                <Box
                  w="24px"
                  h="24px"
                  borderRadius={tokens.radius.sm}
                  bg={tokens.colors.brand.primary}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  _before={{
                    content: '""',
                    position: "absolute",
                    inset: "2px",
                    borderRadius: "4px",
                    bg: tokens.colors.canvas.base,
                  }}
                >
                  <Box
                    position="relative"
                    zIndex={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <circle cx="3" cy="3" r="2" fill={tokens.colors.brand.primary} />
                      <circle cx="13" cy="3" r="2" fill={tokens.colors.brand.primary} />
                      <circle cx="3" cy="13" r="2" fill={tokens.colors.brand.primary} />
                      <circle cx="13" cy="13" r="2" fill={tokens.colors.brand.primary} />
                      <path d="M3 3L13 13M13 3L3 13" stroke={tokens.colors.brand.primary} strokeWidth="1.5" opacity="0.5" />
                    </svg>
                  </Box>
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color={tokens.colors.text.secondary}
                  userSelect="none"
                  letterSpacing="-0.01em"
                >
                  Nexus
                </Text>
              </HStack>
            </MotionBox>
            
            <Box
              opacity={renderedContent.length > 0 ? 1 : 0}
              transition="opacity 0.3s"
            >
              <Text fontSize="xs" color={tokens.colors.text.muted} fontWeight="400">
                v2.5
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
                  transition={{ duration: 0.3 }}
                  spacing={0}
                  align="center"
                  w="full"
                  maxW="600px"
                  mx="auto"
                  justify="center"
                  minH="60vh"
                  position="relative"
                  top="-5vh"
                >
                  {/* Minimal logo - smaller, centered */}
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    mb={8}
                  >
                    <Box
                      w="48px"
                      h="48px"
                      borderRadius={tokens.radius.md}
                      bg={tokens.colors.brand.primary}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                      _before={{
                        content: '""',
                        position: "absolute",
                        inset: "3px",
                        borderRadius: "9px",
                        bg: tokens.colors.canvas.base,
                      }}
                    >
                      <Box
                        position="relative"
                        zIndex={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                          <circle cx="3" cy="3" r="2" fill={tokens.colors.brand.primary} />
                          <circle cx="13" cy="3" r="2" fill={tokens.colors.brand.primary} />
                          <circle cx="3" cy="13" r="2" fill={tokens.colors.brand.primary} />
                          <circle cx="13" cy="13" r="2" fill={tokens.colors.brand.primary} />
                          <path d="M3 3L13 13M13 3L3 13" stroke={tokens.colors.brand.primary} strokeWidth="1.5" opacity="0.5" />
                        </svg>
                      </Box>
                    </Box>
                  </MotionBox>

                  {/* Clean, simple tagline */}
                  <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    mb={10}
                  >
                    <Text
                      fontSize="md"
                      color={tokens.colors.text.tertiary}
                      fontWeight="400"
                      letterSpacing="0.02em"
                    >
                      Your AI workspace builder
                    </Text>
                  </MotionBox>
                  
                  {/* Clean search bar */}
                  <MotionBox
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    w="full"
                    maxW="560px"
                  >
                    <OmniPrompt
                      onSubmit={handleIntentSubmit}
                      isLoading={isLoading}
                      placeholder="What do you want to work on?"
                    />
                  </MotionBox>

                  {/* Subtle suggestions */}
                  <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    mt={6}
                  >
                    <HStack spacing={3} flexWrap="wrap" justify="center">
                      <Text fontSize="xs" color={tokens.colors.text.muted}>
                        Try:
                      </Text>
                      {['Track crypto prices', 'Plan a trip', 'Build a calculator'].map((suggestion, index) => (
                        <Button
                          key={suggestion}
                          size="xs"
                          variant="ghost"
                          color={tokens.colors.text.tertiary}
                          fontSize="xs"
                          fontWeight="400"
                          px={2}
                          py={1}
                          h="auto"
                          borderRadius={tokens.radius.sm}
                          _hover={{
                            bg: tokens.colors.brand.primarySubtle,
                            color: tokens.colors.brand.primary,
                          }}
                          onClick={() => handleIntentSubmit(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </HStack>
                  </MotionBox>

                  {/* Historical Workspaces */}
                  <HistoricalWorkspaces onWorkspaceSelect={handleCachedWorkspaceSelect} />
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
                            bgGradient: `linear(to-r, transparent, ${tokens.colors.border.default}, transparent)`
                          }}
                        >
                          <VStack spacing={6}>
                            <Text fontSize="2xl" fontWeight="700" color={tokens.colors.text.primary}>
                              "{content.content.intent}"
                            </Text>
                            <Text fontSize="lg" color={tokens.colors.text.secondary} fontWeight="400" lineHeight="1.6">
                              {content.content.message}
                            </Text>
                            {content.content.intentMatch && (
                              <Box
                                px={3}
                                py={1}
                                bg={tokens.colors.brand.primarySubtle}
                                borderRadius="full"
                                border={`1px solid ${tokens.colors.brand.primaryFocus}`}
                              >
                                <Text fontSize="sm" color={tokens.colors.brand.primary} fontWeight="500">
                                  {content.content.intentMatch.confidence}% match found
                                </Text>
                              </Box>
                            )}
                            <Text fontSize="sm" color={tokens.colors.text.muted} fontWeight="400">
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

          {/* Minimal Footer - only show when content is visible */}
          {renderedContent.length > 0 && (
            <HStack justify="center" py={4} mt={8}>
              <Text fontSize="xs" color={tokens.colors.text.muted} fontWeight="400">
                ⌥+D for dev • ESC to clear
              </Text>
            </HStack>
          )}
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
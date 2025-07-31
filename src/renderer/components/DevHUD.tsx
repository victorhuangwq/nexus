import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Text,
  Code,
  Badge,
  Divider,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { tokens } from '../design-tokens';

const MotionBox = motion(Box);

interface DevHUDProps {
  isOpen: boolean;
  onClose: () => void;
  debugData?: {
    schema?: any;
    renderTiming?: {
      T_schema?: number;
      T_components?: number;
      T_firstRender?: number;
    };
    bridgeStatus?: {
      connected: boolean;
      lastTest?: number;
    };
  };
}

export const DevHUD: React.FC<DevHUDProps> = ({
  isOpen,
  onClose,
  debugData = {},
}) => {
  const [bridgeHealth, setBridgeHealth] = useState<'healthy' | 'error' | 'testing'>('testing');
  const [bridgeData, setBridgeData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      testBridge();
    }
  }, [isOpen]);

  const testBridge = async () => {
    try {
      setBridgeHealth('testing');
      const result = await window.bridge?.test();
      setBridgeData(result);
      setBridgeHealth('healthy');
    } catch (error) {
      console.error('Bridge test failed:', error);
      setBridgeHealth('error');
    }
  };

  const getBridgeStatusColor = () => {
    switch (bridgeHealth) {
      case 'healthy': return 'green';
      case 'error': return 'red';
      case 'testing': return 'yellow';
      default: return 'gray';
    }
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(4px)" />
      <DrawerContent
        bg={tokens.glass.dark.background}
        backdropFilter={tokens.glass.dark.blur}
        border={tokens.glass.dark.border}
        color={tokens.colors.text.primary}
      >
        <DrawerCloseButton color="brand.500" />
        <DrawerHeader borderBottomWidth="1px" borderColor={tokens.colors.border.default}>
          <HStack>
            <Text fontSize={tokens.typography.fontSize.xl} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
              Debug Info
            </Text>
            <Badge colorScheme={getBridgeStatusColor()} variant="subtle">
              {bridgeHealth}
            </Badge>
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={6} align="stretch">
            {/* Bridge Status */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Text fontSize="lg" fontWeight="600" color="brand.600" mb={2}>
                Connection
              </Text>
              <Box
                p={tokens.space[2]}
                bg={tokens.glass.light.background}
                borderRadius={tokens.radius.md}
                border={tokens.glass.light.border}
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm">Connection</Text>
                  <Badge colorScheme={getBridgeStatusColor()}>
                    {bridgeHealth}
                  </Badge>
                </HStack>
                {bridgeData && (
                  <Code fontSize="xs" bg={tokens.colors.canvas.section} p={tokens.space[1]} borderRadius={tokens.radius.sm} w="full" color={tokens.colors.text.secondary}>
                    {formatJSON(bridgeData)}
                  </Code>
                )}
              </Box>
            </MotionBox>

            <Divider borderColor="rgba(255, 255, 255, 0.1)" />

            {/* Performance Metrics */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Text fontSize="lg" fontWeight="semibold" color="brand.500" mb={2}>
                Performance
              </Text>
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm">Schema Generation</Text>
                  <Text fontSize="sm" color="brand.500">
                    {debugData.renderTiming?.T_schema ? `${debugData.renderTiming.T_schema}ms` : 'N/A'}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Component Render</Text>
                  <Text fontSize="sm" color="brand.500">
                    {debugData.renderTiming?.T_components ? `${debugData.renderTiming.T_components}ms` : 'N/A'}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">First Paint</Text>
                  <Text fontSize="sm" color="brand.500">
                    {debugData.renderTiming?.T_firstRender ? `${debugData.renderTiming.T_firstRender}ms` : 'N/A'}
                  </Text>
                </HStack>
              </VStack>
            </MotionBox>

            <Divider borderColor="rgba(255, 255, 255, 0.1)" />

            {/* Schema Debug */}
            {debugData.schema && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Text fontSize="lg" fontWeight="semibold" color="brand.500" mb={2}>
                  Schema Debug
                </Text>
                <Code 
                  fontSize="xs" 
                  bg={tokens.colors.canvas.section} 
                  p={tokens.space[2]} 
                  borderRadius={tokens.radius.sm} 
                  w="full"
                  maxH="300px"
                  overflowY="auto"
                  whiteSpace="pre-wrap"
                  color={tokens.colors.text.secondary}
                >
                  {formatJSON(debugData.schema)}
                </Code>
              </MotionBox>
            )}

            {/* Environment Info */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Text fontSize="lg" fontWeight="semibold" color="brand.500" mb={2}>
                Environment
              </Text>
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm">Renderer</Text>
                  <Text fontSize="sm" color="brand.500">React {React.version}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Platform</Text>
                  <Text fontSize="sm" color="brand.500">{navigator.platform}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">User Agent</Text>
                  <Text fontSize="xs" color="brand.500" maxW="200px" isTruncated>
                    {navigator.userAgent}
                  </Text>
                </HStack>
              </VStack>
            </MotionBox>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" borderColor={tokens.colors.border.default}>
          <Text fontSize={tokens.typography.fontSize.xs} color={tokens.colors.text.muted}>
            Press ⌥ + D to close
          </Text>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
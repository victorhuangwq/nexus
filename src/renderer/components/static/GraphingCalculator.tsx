import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Card,
  CardBody,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { tokens } from '../../design-tokens';

const MotionCard = motion(Card);

export const GraphingCalculator: React.FC = () => {
  return (
    <VStack spacing={6} align="stretch" w="full" maxW="900px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize={tokens.typography.fontSize['2xl']} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
            Calculator
          </Text>
          <Text fontSize={tokens.typography.fontSize.md} color={tokens.colors.text.secondary} fontWeight={tokens.typography.fontWeight.normal}>
            Graph functions and solve equations
          </Text>
        </VStack>
        <Badge colorScheme="green" variant="solid" px={3} py={1}>
          Ready
        </Badge>
      </HStack>

      {/* Main Calculator */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg={tokens.glass.light.background}
        backdropFilter={tokens.glass.light.blur}
        borderRadius={tokens.radius['2xl']}
        border={tokens.glass.light.border}
        boxShadow={tokens.shadow.lg}
      >
        <CardBody p={0}>
          <Box w="full" h="500px">
            <iframe
              src="https://www.desmos.com/calculator"
              style={{
                border: 'none',
                borderRadius: tokens.radius['2xl'],
                width: '100%',
                height: '100%',
              }}
              title="Desmos Graphing Calculator"
              allow="fullscreen"
            />
          </Box>
        </CardBody>
      </MotionCard>

      {/* Tips */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        bg={tokens.glass.light.background}
        backdropFilter={tokens.glass.light.blur}
        borderRadius={tokens.radius.xl}
        border={tokens.glass.light.border}
      >
        <CardBody p={tokens.space[3]}>
          <VStack spacing={4} align="start">
            <Text fontSize={tokens.typography.fontSize.lg} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
              How to use
            </Text>
            <VStack spacing={tokens.space[1]} align="start">
              <HStack>
                <Box w="6px" h="6px" bg={tokens.colors.brand.primary} borderRadius={tokens.radius.full} />
                <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.text.secondary}>
                  Type <code>y = x^2 + 2x + 1</code> to graph functions
                </Text>
              </HStack>
              <HStack>
                <Box w="6px" h="6px" bg={tokens.colors.accent.emerald} borderRadius={tokens.radius.full} />
                <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.text.secondary}>
                  Click + to add multiple expressions
                </Text>
              </HStack>
              <HStack>
                <Box w="6px" h="6px" bg={tokens.colors.accent.coral} borderRadius={tokens.radius.full} />
                <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.text.secondary}>
                  Drag to move, scroll to zoom
                </Text>
              </HStack>
              <HStack>
                <Box w="6px" h="6px" bg={tokens.colors.accent.amber} borderRadius={tokens.radius.full} />
                <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.text.secondary}>
                  Use the gear icon for settings
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </MotionCard>
    </VStack>
  );
};
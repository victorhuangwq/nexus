import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  AspectRatio,
  Card,
  CardBody,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export const GraphingCalculator: React.FC = () => {
  return (
    <VStack spacing={6} align="stretch" w="full" maxW="900px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="600" color="gray.800">
            Calculator
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="400">
            Graph functions and solve equations
          </Text>
        </VStack>
        <Badge colorScheme="green" variant="subtle" px={3} py={1}>
          Ready
        </Badge>
      </HStack>

      {/* Main Calculator */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        variant="elevated"
        bg="rgba(255, 255, 255, 0.9)"
        backdropFilter="blur(20px)"
        borderRadius="24px"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.06)"
      >
        <CardBody p={0}>
          <AspectRatio ratio={16/10} w="full">
            <iframe
              src="https://www.desmos.com/calculator"
              style={{
                border: 'none',
                borderRadius: '24px',
                width: '100%',
                height: '100%',
              }}
              title="Desmos Graphing Calculator"
              allow="fullscreen"
            />
          </AspectRatio>
        </CardBody>
      </MotionCard>

      {/* Tips */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(16px)"
        borderRadius="20px"
        border="1px solid rgba(0, 0, 0, 0.05)"
      >
        <CardBody p={6}>
          <VStack spacing={4} align="start">
            <Text fontSize="lg" fontWeight="600" color="gray.800">
              How to use
            </Text>
            <VStack spacing={2} align="start">
              <HStack>
                <Box w="6px" h="6px" bg="brand.500" borderRadius="50%" />
                <Text fontSize="sm" color="gray.700">
                  Type <code>y = x^2 + 2x + 1</code> to graph functions
                </Text>
              </HStack>
              <HStack>
                <Box w="6px" h="6px" bg="accent.emerald" borderRadius="50%" />
                <Text fontSize="sm" color="gray.700">
                  Click + to add multiple expressions
                </Text>
              </HStack>
              <HStack>
                <Box w="6px" h="6px" bg="accent.purple" borderRadius="50%" />
                <Text fontSize="sm" color="gray.700">
                  Drag to move, scroll to zoom
                </Text>
              </HStack>
              <HStack>
                <Box w="6px" h="6px" bg="accent.amber" borderRadius="50%" />
                <Text fontSize="sm" color="gray.700">
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
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Card,
  CardBody,
  Badge,
  Grid,
  GridItem,
  AspectRatio,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { tokens } from '../../design-tokens';

const MotionCard = motion(Card);

export const PhysicsHomework: React.FC = () => {

  const quickFormulas = [
    { category: 'Kinematics', formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as'] },
    { category: 'Forces', formulas: ['F = ma', 'W = mg', 'F = μN'] },
    { category: 'Energy', formulas: ['KE = ½mv²', 'PE = mgh', 'W = Fd'] },
    { category: 'Waves', formulas: ['v = fλ', 'T = 1/f', 'f = v/λ'] },
    { category: 'Electricity', formulas: ['V = IR', 'P = VI', 'Q = It'] }
  ];

  return (
    <VStack spacing={6} align="stretch" w="full" maxW="1200px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize={tokens.typography.fontSize['2xl']} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
            Physics Homework Toolkit
          </Text>
          <Text fontSize={tokens.typography.fontSize.md} color={tokens.colors.text.secondary} fontWeight={tokens.typography.fontWeight.normal}>
            Everything you need for high school physics
          </Text>
        </VStack>
        <Badge colorScheme="purple" variant="solid" px={3} py={1}>
          Calculator + Formulas
        </Badge>
      </HStack>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Calculator */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            bg={tokens.glass.light.background}
            backdropFilter="blur(10px)"
            borderRadius="20px"
            border={tokens.glass.light.border}
          >
            <CardBody p={0}>
              <VStack spacing={0}>
                <Box p={6} w="full">
                  <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Text fontSize="2xl">🧮</Text>
                      <VStack align="start" spacing={0}>
                        <Text fontSize={tokens.typography.fontSize.xl} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
                          Graphing Calculator
                        </Text>
                        <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.text.secondary}>
                          Desmos for equations and functions
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme="green" variant="solid">
                      Live
                    </Badge>
                  </HStack>
                </Box>
                <AspectRatio ratio={16/12} w="full">
                  <iframe
                    src="https://www.desmos.com/calculator"
                    style={{
                      border: 'none',
                      borderRadius: '0 0 20px 20px',
                      width: '100%',
                      height: '100%',
                      background: 'white',
                    }}
                    title="Desmos Graphing Calculator"
                    loading="lazy"
                  />
                </AspectRatio>
              </VStack>
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* Enhanced Formula Reference */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            bg={tokens.glass.light.background}
            backdropFilter="blur(10px)"
            borderRadius="20px"
            border={tokens.glass.light.border}
          >
            <CardBody>
              <Text fontSize={tokens.typography.fontSize.lg} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary} mb={4}>
                Physics Formula Reference
              </Text>
              <VStack spacing={4} align="stretch">
                {quickFormulas.map((category, index) => (
                  <Box key={category.category}>
                    <Text fontSize={tokens.typography.fontSize.sm} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.brand.primary} mb={2}>
                      {category.category}
                    </Text>
                    <VStack spacing={2} align="start">
                      {category.formulas.map((formula, idx) => (
                        <Text key={idx} fontSize={tokens.typography.fontSize.sm} fontFamily={tokens.typography.fontFamily.mono} color={tokens.colors.text.primary} bg={tokens.glass.light.background} px={3} py={2} borderRadius={tokens.radius.md} w="full">
                          {formula}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>
        </GridItem>

      </Grid>

      {/* Study Tips */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        bg={tokens.glass.light.background}
        backdropFilter="blur(16px)"
        borderRadius="16px"
        border={tokens.glass.light.border}
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="600" color={tokens.colors.text.primary} mb={4}>
            Physics Study Tips
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            <VStack spacing={2} align="start">
              <Text fontSize={tokens.typography.fontSize.sm} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.brand.primary}>
                📝 Problem Solving
              </Text>
              <Text fontSize={tokens.typography.fontSize.xs} color={tokens.colors.text.secondary}>
                Always draw diagrams, identify given values, and list what you need to find
              </Text>
            </VStack>
            <VStack spacing={2} align="start">
              <Text fontSize={tokens.typography.fontSize.sm} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.accent.cool}>
                🧮 Use the Calculator
              </Text>
              <Text fontSize={tokens.typography.fontSize.xs} color={tokens.colors.text.secondary}>
                Graph functions to visualize relationships, plot data points, and verify solutions
              </Text>
            </VStack>
            <VStack spacing={2} align="start">
              <Text fontSize={tokens.typography.fontSize.sm} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.accent.success}>
                🔍 Check Your Work
              </Text>
              <Text fontSize={tokens.typography.fontSize.xs} color={tokens.colors.text.secondary}>
                Verify units, check order of magnitude, and ask "Does this answer make sense?"
              </Text>
            </VStack>
          </Grid>
        </CardBody>
      </MotionCard>
    </VStack>
  );
};
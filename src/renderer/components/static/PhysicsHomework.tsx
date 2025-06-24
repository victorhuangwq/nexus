import React, { useState } from 'react';
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
  Select,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

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
          <Text fontSize="2xl" fontWeight="600" color="gray.800">
            Physics Homework Toolkit
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="400">
            Everything you need for high school physics
          </Text>
        </VStack>
        <Badge colorScheme="purple" variant="subtle" px={3} py={1}>
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
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(16px)"
            borderRadius="20px"
            border="1px solid rgba(0, 0, 0, 0.05)"
          >
            <CardBody p={0}>
              <VStack spacing={0}>
                <Box p={6} w="full">
                  <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Text fontSize="2xl">🧮</Text>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xl" fontWeight="600" color="gray.800">
                          Graphing Calculator
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Desmos for equations and functions
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme="green" variant="subtle">
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
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(16px)"
            borderRadius="20px"
            border="1px solid rgba(0, 0, 0, 0.05)"
          >
            <CardBody>
              <Text fontSize="lg" fontWeight="600" color="gray.800" mb={4}>
                Physics Formula Reference
              </Text>
              <VStack spacing={4} align="stretch">
                {quickFormulas.map((category, index) => (
                  <Box key={category.category}>
                    <Text fontSize="sm" fontWeight="600" color="brand.600" mb={2}>
                      {category.category}
                    </Text>
                    <VStack spacing={2} align="start">
                      {category.formulas.map((formula, idx) => (
                        <Text key={idx} fontSize="sm" fontFamily="mono" color="gray.700" bg="gray.100" px={3} py={2} borderRadius="8px" w="full">
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
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(16px)"
        borderRadius="16px"
        border="1px solid rgba(0, 0, 0, 0.05)"
      >
        <CardBody>
          <Text fontSize="lg" fontWeight="600" color="gray.800" mb={4}>
            Physics Study Tips
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            <VStack spacing={2} align="start">
              <Text fontSize="sm" fontWeight="600" color="brand.600">
                📝 Problem Solving
              </Text>
              <Text fontSize="xs" color="gray.700">
                Always draw diagrams, identify given values, and list what you need to find
              </Text>
            </VStack>
            <VStack spacing={2} align="start">
              <Text fontSize="sm" fontWeight="600" color="accent.purple">
                🧮 Use the Calculator
              </Text>
              <Text fontSize="xs" color="gray.700">
                Graph functions to visualize relationships, plot data points, and verify solutions
              </Text>
            </VStack>
            <VStack spacing={2} align="start">
              <Text fontSize="sm" fontWeight="600" color="accent.emerald">
                🔍 Check Your Work
              </Text>
              <Text fontSize="xs" color="gray.700">
                Verify units, check order of magnitude, and ask "Does this answer make sense?"
              </Text>
            </VStack>
          </Grid>
        </CardBody>
      </MotionCard>
    </VStack>
  );
};
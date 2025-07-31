import React from 'react';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface MinimalistCardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: string | number;
  onClick?: () => void;
}

/**
 * Minimalist Card component following the design philosophy
 * - Subtle glass morphism effect
 * - Consistent border radius (20px)
 * - Smooth hover transitions
 * - Minimal visual noise
 */
export const MinimalistCard: React.FC<MinimalistCardProps> = ({
  children,
  hover = false,
  padding = '24px',
  onClick,
}) => {
  return (
    <MotionBox
      bg="rgba(255, 255, 255, 0.02)"
      backdropFilter="blur(40px)"
      border="1px solid rgba(255, 255, 255, 0.06)"
      borderRadius="20px"
      p={padding}
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? {
        y: -2,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
      } : {}}
      style={{
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </MotionBox>
  );
};

interface MinimalistCardSectionProps {
  children: React.ReactNode;
}

/**
 * Nested section within a card for visual hierarchy
 */
export const MinimalistCardSection: React.FC<MinimalistCardSectionProps> = ({
  children,
}) => {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius="12px"
      p="16px"
      border="1px solid rgba(255, 255, 255, 0.04)"
    >
      {children}
    </Box>
  );
};

// Example usage component
export const MinimalistCardExample: React.FC = () => {
  return (
    <VStack spacing={4} w="full" maxW="400px">
      {/* Basic card */}
      <MinimalistCard>
        <VStack align="start" spacing={2}>
          <Text fontSize="lg" fontWeight="600" color="rgba(255, 255, 255, 0.95)">
            Simple Card
          </Text>
          <Text fontSize="15px" color="rgba(255, 255, 255, 0.7)" lineHeight="1.6">
            This demonstrates the basic glass morphism effect with minimal visual noise.
          </Text>
        </VStack>
      </MinimalistCard>

      {/* Interactive card with hover */}
      <MinimalistCard hover onClick={() => console.log('Card clicked')}>
        <VStack align="start" spacing={2}>
          <Text fontSize="lg" fontWeight="600" color="rgba(255, 255, 255, 0.95)">
            Interactive Card
          </Text>
          <Text fontSize="15px" color="rgba(255, 255, 255, 0.7)" lineHeight="1.6">
            Hover over this card to see the subtle elevation effect.
          </Text>
        </VStack>
      </MinimalistCard>

      {/* Card with nested section */}
      <MinimalistCard>
        <VStack align="start" spacing={4}>
          <Text fontSize="lg" fontWeight="600" color="rgba(255, 255, 255, 0.95)">
            Card with Section
          </Text>
          <MinimalistCardSection>
            <HStack justify="space-between">
              <Text fontSize="14px" color="rgba(255, 255, 255, 0.6)">
                Status
              </Text>
              <Text fontSize="14px" color="rgba(78, 205, 196, 0.9)" fontWeight="500">
                Active
              </Text>
            </HStack>
          </MinimalistCardSection>
          <Text fontSize="15px" color="rgba(255, 255, 255, 0.7)" lineHeight="1.6">
            Nested sections create visual hierarchy without heavy borders.
          </Text>
        </VStack>
      </MinimalistCard>
    </VStack>
  );
};
import React from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = "lg" 
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
      minH="200px"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="3px"
          speed="0.8s"
          emptyColor="gray.200"
          color="brand.500"
          size={size}
        />
        <Text fontSize="sm" color="gray.600" fontWeight="400">
          {message}
        </Text>
      </VStack>
    </MotionBox>
  );
};
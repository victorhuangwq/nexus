import React, { useState } from 'react';
import {
  Box,
  Input,
  IconButton,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface FloatingInputBarProps {
  onSubmit: (intent: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const FloatingInputBar: React.FC<FloatingInputBarProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "Ask for something else...",
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      position="fixed"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      w="90%"
      maxW="600px"
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="rgba(15, 15, 35, 0.95)"
        backdropFilter="blur(20px)"
        borderRadius="full"
        border="1px solid rgba(255, 255, 255, 0.1)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
        p={2}
      >
        <HStack spacing={2}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            variant="unstyled"
            color="white"
            fontSize="md"
            px={4}
            py={2}
            _placeholder={{
              color: 'rgba(255, 255, 255, 0.5)',
            }}
            disabled={isLoading}
          />
          <IconButton
            type="submit"
            aria-label="Submit intent"
            icon={<SearchIcon />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            borderRadius="full"
            isLoading={isLoading}
            disabled={!value.trim() || isLoading}
            color="rgba(255, 255, 255, 0.8)"
            _hover={{
              bg: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
            }}
          />
        </HStack>
      </Box>
    </MotionBox>
  );
};
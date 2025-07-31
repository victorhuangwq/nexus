import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);
const MotionInput = motion(Input);

interface MinimalistOmniPromptProps {
  onSubmit: (intent: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * Minimalist OmniPrompt following the design philosophy
 * - Subtle glass morphism that blends with dark background
 * - Consistent border radius and spacing
 * - Refined focus states with smooth transitions
 */
export const MinimalistOmniPrompt: React.FC<MinimalistOmniPromptProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "What do you want to work on?",
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <VStack spacing={4} align="center" w="full">
      <MotionBox
        w="full"
        maxW="600px"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <InputGroup size="lg">
          <MotionInput
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            fontSize="15px"
            h="56px"
            pl={6}
            pr={16}
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(40px)"
            border="1px solid"
            borderColor={isFocused ? "rgba(78, 205, 196, 0.3)" : "rgba(255, 255, 255, 0.06)"}
            borderRadius="16px"
            color="rgba(255, 255, 255, 0.95)"
            fontWeight="400"
            transition="all 0.2s ease"
            boxShadow={isFocused ? "0 0 0 3px rgba(78, 205, 196, 0.1)" : "none"}
            _placeholder={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '15px',
              fontWeight: '400',
            }}
            _hover={{
              borderColor: isFocused ? "rgba(78, 205, 196, 0.3)" : "rgba(255, 255, 255, 0.08)",
              bg: "rgba(255, 255, 255, 0.04)",
            }}
            disabled={isLoading}
            animate={{
              scale: isFocused ? 1.01 : 1,
              y: isFocused ? -1 : 0,
            }}
          />
          <InputRightElement h="56px" pr={2}>
            <IconButton
              aria-label="Submit"
              icon={<ArrowForwardIcon />}
              size="md"
              h="40px"
              w="40px"
              borderRadius="12px"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!value.trim() || isLoading}
              bg={value.trim() ? "rgba(78, 205, 196, 0.9)" : "transparent"}
              color={value.trim() ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.3)"}
              border="1px solid"
              borderColor={value.trim() ? "transparent" : "rgba(255, 255, 255, 0.1)"}
              _hover={{
                bg: value.trim() ? "rgba(78, 205, 196, 1)" : "rgba(255, 255, 255, 0.05)",
                transform: 'scale(1.05)',
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
              transition="all 0.2s ease"
            />
          </InputRightElement>
        </InputGroup>
      </MotionBox>
    </VStack>
  );
};
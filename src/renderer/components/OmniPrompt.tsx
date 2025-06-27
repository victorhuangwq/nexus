import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);
const MotionInput = motion(Input);

interface OmniPromptProps {
  onSubmit: (intent: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const OmniPrompt: React.FC<OmniPromptProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "What can I help you with?",
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

  const focusEffect = {
    boxShadow: isFocused 
      ? '0 0 0 4px rgba(14, 165, 233, 0.1), 0 4px 16px rgba(14, 165, 233, 0.1)'
      : '0 2px 8px rgba(0, 0, 0, 0.04)',
    transform: isFocused ? 'translateY(-1px)' : 'translateY(0px)',
  };

  return (
    <VStack spacing={4} align="center" w="full">
      <MotionBox
        w="full"
        maxW="480px"
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
            variant="glass"
            fontSize="md"
            h="52px"
            pl={5}
            pr={14}
            animate={focusEffect}
            transition={{ duration: 0.2 }}
            bg="rgba(255, 255, 255, 0.85)"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.9)"
            borderRadius="14px"
            color="gray.800"
            fontWeight="400"
            _placeholder={{
              color: 'gray.500',
              fontSize: 'sm',
              fontWeight: '400',
            }}
            disabled={isLoading}
          />
          <InputRightElement h="52px" pr={2}>
            <IconButton
              aria-label="Submit"
              icon={<ArrowForwardIcon />}
              variant="clean"
              size="sm"
              borderRadius="10px"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!value.trim() || isLoading}
              _hover={{
                transform: 'scale(1.05)',
              }}
              transition="all 0.2s ease"
            />
          </InputRightElement>
        </InputGroup>
      </MotionBox>

    </VStack>
  );
};
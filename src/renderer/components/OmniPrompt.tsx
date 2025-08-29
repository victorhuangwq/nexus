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
import { tokens } from '../design-tokens';

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
  placeholder = "What task do you need to do?",
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
      ? `0 0 0 3px ${tokens.colors.brand.primarySubtle}`
      : 'none',
    transform: isFocused ? 'translateY(-1px)' : 'translateY(0px)',
    background: isFocused 
      ? tokens.glass.medium.background
      : tokens.glass.light.background,
    borderColor: isFocused
      ? tokens.colors.border.focus
      : tokens.colors.border.default,
  };

  return (
    <VStack spacing={4} align="center" w="full">
      <MotionBox
        w="full"
        maxW="100%"
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
            variant="unstyled"
            fontSize="15px"
            h="44px"
            pl={tokens.space[3]}
            pr="50px"
            animate={focusEffect}
            transition={{ duration: 0.15 }}
            bg="white"
            backdropFilter="none"
            border="1px solid"
            borderColor={tokens.colors.border.default}
            borderRadius="22px"
            color={tokens.colors.text.primary}
            fontWeight={tokens.typography.fontWeight.normal}
            boxShadow={isFocused ? tokens.shadow.md : tokens.shadow.sm}
            _placeholder={{
              color: tokens.colors.text.muted,
              fontSize: "15px",
              fontWeight: tokens.typography.fontWeight.normal,
            }}
            _hover={{
              boxShadow: tokens.shadow.md,
            }}
            disabled={isLoading}
          />
          <InputRightElement h="44px" pr="6px">
            <IconButton
              aria-label="Submit"
              icon={<ArrowForwardIcon boxSize={3} />}
              variant="ghost"
              size="sm"
              h="32px"
              w="32px"
              borderRadius="16px"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!value.trim() || isLoading}
              color={value.trim() ? tokens.colors.brand.primary : tokens.colors.text.muted}
              bg={value.trim() ? tokens.colors.brand.primarySubtle : 'transparent'}
              _hover={{
                bg: value.trim() ? tokens.colors.brand.primaryFocus : tokens.colors.brand.primarySubtle,
                color: tokens.colors.brand.primary,
              }}
              _active={{
                transform: 'scale(0.95)',
              }}
              transition={`all ${tokens.transition.duration.instant}`}
            />
          </InputRightElement>
        </InputGroup>
      </MotionBox>

    </VStack>
  );
};
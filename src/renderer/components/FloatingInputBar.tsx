import React, { useState } from 'react';
import {
  Box,
  Input,
  IconButton,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { tokens } from '../design-tokens';

const MotionBox = motion(Box);

interface FloatingInputBarProps {
  onSubmit: (intent: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const FloatingInputBar: React.FC<FloatingInputBarProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = "Type another task...",
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
        bg={tokens.glass.medium.background}
        backdropFilter={tokens.glass.medium.blur}
        borderRadius={tokens.radius.lg}
        border={tokens.glass.medium.border}
        boxShadow={tokens.shadow.lg}
        h={tokens.space[6]}
        position="relative"
        transition={`all ${tokens.transition.duration.fast}`}
        _hover={{
          borderColor: tokens.colors.border.hover,
          boxShadow: tokens.shadow.xl,
        }}
      >
        <HStack spacing={0} h="full">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            variant="unstyled"
            color={tokens.colors.text.primary}
            fontSize={tokens.typography.fontSize.base}
            px={tokens.space[2]}
            h="full"
            _placeholder={{
              color: tokens.colors.text.placeholder,
              fontSize: tokens.typography.fontSize.base,
            }}
            _focus={{
              outline: 'none',
            }}
            disabled={isLoading}
          />
          <IconButton
            type="submit"
            aria-label="Submit intent"
            icon={<ArrowForwardIcon />}
            size="sm"
            variant="ghost"
            borderRadius={tokens.radius.md}
            isLoading={isLoading}
            disabled={!value.trim() || isLoading}
            color={tokens.colors.text.secondary}
            mr={tokens.space[1]}
            _hover={{
              bg: tokens.colors.brand.primarySubtle,
              color: tokens.colors.brand.primary,
              transform: 'scale(1.05)',
            }}
            _active={{
              transform: 'scale(0.98)',
            }}
            transition={`all ${tokens.transition.duration.fast}`}
          />
        </HStack>
      </Box>
    </MotionBox>
  );
};
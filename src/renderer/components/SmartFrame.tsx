import React, { useState } from 'react';
import { Box, Text, VStack, Button, AspectRatio } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { WebViewFrame } from './WebViewFrame';

const MotionBox = motion(Box);

interface SmartFrameProps {
  src: string;
  title: string;
  ratio?: number;
  style?: React.CSSProperties;
  fallbackMessage?: string;
  forceWebView?: boolean;
  onRetry?: () => void;
}

export const SmartFrame: React.FC<SmartFrameProps> = ({
  src,
  title,
  ratio = 16/10,
  style = {},
  fallbackMessage = "Unable to load content. Trying alternative method...",
  forceWebView = false,
  onRetry
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useWebView, setUseWebView] = useState(forceWebView);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    
    // If iframe fails, try WebView as fallback
    if (!useWebView) {
      console.log(`Iframe failed for ${src}, switching to WebView`);
      setUseWebView(true);
      setIsLoading(true);
    } else {
      setHasError(true);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setUseWebView(false); // Try iframe first on retry
    if (onRetry) {
      onRetry();
    }
  };

  const defaultStyle: React.CSSProperties = {
    border: 'none',
    width: '100%',
    height: '100%',
    background: 'white',
    ...style
  };

  // Use WebView for problematic sites
  if (useWebView) {
    return (
      <AspectRatio ratio={ratio} w="full">
        <Box position="relative" w="full" h="full">
          <WebViewFrame
            url={src}
            title={title}
            width="100%"
            height="100%"
            allowPopups={false}
          />
          {isLoading && (
            <MotionBox
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="rgba(0, 0, 0, 0.8)"
              backdropFilter="blur(4px)"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              pointerEvents="none"
            >
              <VStack spacing={2}>
                <Box
                  w="4"
                  h="4"
                  border="2px solid"
                  borderColor="blue.300"
                  borderTopColor="blue.500"
                  borderRadius="50%"
                  animation="spin 1s linear infinite"
                />
                <Text fontSize="xs" color="gray.300">Loading in WebView mode...</Text>
              </VStack>
            </MotionBox>
          )}
        </Box>
      </AspectRatio>
    );
  }

  // Standard iframe for regular sites
  return (
    <AspectRatio ratio={ratio} w="full">
      <Box position="relative" w="full" h="full">
        {!hasError && (
          <iframe
            src={src}
            title={title}
            style={defaultStyle}
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
        
        {isLoading && !hasError && (
          <MotionBox
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(4px)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VStack spacing={2}>
              <Box
                w="4"
                h="4"
                border="2px solid"
                borderColor="brand.200"
                borderTopColor="brand.500"
                borderRadius="50%"
                animation="spin 1s linear infinite"
              />
              <Text fontSize="xs" color="gray.600">Loading {title}...</Text>
            </VStack>
          </MotionBox>
        )}

        {hasError && (
          <MotionBox
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(8px)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <VStack spacing={4} textAlign="center" p={6}>
              <Text fontSize="2xl">⚠️</Text>
              <VStack spacing={2}>
                <Text fontSize="sm" fontWeight="600" color="gray.800">
                  Content Unavailable
                </Text>
                <Text fontSize="xs" color="gray.600" maxW="250px" lineHeight="1.4">
                  {fallbackMessage}
                </Text>
              </VStack>
              <Button
                size="sm"
                variant="glass"
                onClick={handleRetry}
                borderRadius="8px"
              >
                Try Again
              </Button>
            </VStack>
          </MotionBox>
        )}
      </Box>
    </AspectRatio>
  );
};
import React from 'react';
import { Box } from '@chakra-ui/react';

/**
 * Minimalist Background component following the design philosophy
 * - Single, subtle gradient without animated elements
 * - Creates depth through layering, not movement
 * - Reduces visual noise to amplify content
 */
export const MinimalistBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg="linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)"
    >
      {/* Subtle gradient overlays for depth */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="1"
        background={`
          radial-gradient(
            ellipse 800px 600px at 20% 0%, 
            rgba(78, 205, 196, 0.03) 0%, 
            transparent 40%
          )
        `}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="1"
        background={`
          radial-gradient(
            ellipse 600px 800px at 90% 100%, 
            rgba(255, 107, 107, 0.02) 0%, 
            transparent 40%
          )
        `}
        pointerEvents="none"
      />
      
      {/* Subtle noise texture for premium feel */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.02"
        mixBlendMode="overlay"
        backgroundImage={`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}
        pointerEvents="none"
      />
      
      {/* Content layer */}
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

/**
 * Alternative minimal background with mesh gradient
 */
export const MinimalistMeshBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg="#0F0F23"
    >
      {/* Mesh gradient using CSS */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.8"
        background={`
          conic-gradient(
            from 180deg at 50% 50%,
            #1A1A2E 0deg,
            #16213E 120deg,
            #0F0F23 240deg,
            #1A1A2E 360deg
          )
        `}
        filter="blur(100px)"
        pointerEvents="none"
      />
      
      {/* Single accent gradient */}
      <Box
        position="absolute"
        top="-50%"
        left="-10%"
        width="120%"
        height="150%"
        opacity="0.03"
        background="radial-gradient(circle, rgba(78, 205, 196, 0.4) 0%, transparent 70%)"
        pointerEvents="none"
      />
      
      {/* Content layer */}
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};
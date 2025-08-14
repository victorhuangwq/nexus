import React, { useMemo } from 'react';
import * as ChakraUI from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface DynamicComponentRendererProps {
  componentCode: string;
  fallbackProps?: any;
}

export const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({
  componentCode,
  fallbackProps = {}
}) => {
  const RenderedComponent = useMemo(() => {
    try {
      // Remove import statements
      const codeWithoutImports = componentCode
        .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
        .trim();
      
      // Extract the component function
      const functionMatch = codeWithoutImports.match(
        /(?:export\s+default\s+)?function\s+\w+\s*\([^)]*\)\s*{([\s\S]*)}/
      );
      
      if (!functionMatch) {
        throw new Error('No valid component function found');
      }
      
      const functionBody = functionMatch[1];
      
      // Create a function that returns the component
      // We provide all Chakra UI components and React in the scope
      const createComponent = new Function(
        'React',
        'ChakraUI',
        'motion',
        'props',
        `
        const {
          Box, Text, VStack, HStack, Button, Input, Image, Grid, 
          Card, Badge, Progress, Spinner, Alert, AlertIcon,
          Stack, Flex, Spacer, Divider, Container, Heading,
          IconButton, Select, Textarea, Checkbox, Radio,
          Tabs, TabList, TabPanels, Tab, TabPanel,
          Modal, ModalOverlay, ModalContent, ModalHeader,
          ModalFooter, ModalBody, ModalCloseButton,
          useDisclosure, useToast, useColorMode
        } = ChakraUI;
        
        ${functionBody}
        `
      );
      
      // Create the actual component
      const DynamicComponent = (props: any) => {
        try {
          return createComponent(React, ChakraUI, motion, props);
        } catch (error) {
          console.error('Runtime error in dynamic component:', error);
          return (
            <ChakraUI.Alert status="error" borderRadius="md">
              <ChakraUI.AlertIcon />
              <ChakraUI.Text fontSize="sm">
                Runtime error in generated component
              </ChakraUI.Text>
            </ChakraUI.Alert>
          );
        }
      };
      
      return DynamicComponent;
      
    } catch (error) {
      console.error('Failed to compile component:', error);
      
      // Return error component
      return () => (
        <ChakraUI.Box
          p={4}
          bg="rgba(255, 0, 0, 0.1)"
          borderRadius="lg"
          border="1px solid rgba(255, 0, 0, 0.3)"
        >
          <ChakraUI.VStack spacing={3} align="start">
            <ChakraUI.Text color="red.400" fontSize="sm" fontWeight="600">
              ⚠️ Component Compilation Error
            </ChakraUI.Text>
            <ChakraUI.Text color="white" fontSize="xs">
              {error instanceof Error ? error.message : 'Unknown error'}
            </ChakraUI.Text>
            <ChakraUI.Box
              p={2}
              bg="rgba(0, 0, 0, 0.3)"
              borderRadius="md"
              maxH="150px"
              overflow="auto"
              w="full"
            >
              <ChakraUI.Text
                color="rgba(255, 255, 255, 0.6)"
                fontSize="xs"
                fontFamily="mono"
                whiteSpace="pre-wrap"
              >
                {componentCode.substring(0, 500)}
                {componentCode.length > 500 ? '...' : ''}
              </ChakraUI.Text>
            </ChakraUI.Box>
          </ChakraUI.VStack>
        </ChakraUI.Box>
      );
    }
  }, [componentCode]);
  
  return <RenderedComponent {...fallbackProps} />;
};
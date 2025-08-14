import React, { useEffect, useRef } from 'react';
import { Box, Alert, AlertIcon, Text } from '@chakra-ui/react';

interface HtmlWidgetRendererProps {
  htmlContent: string;
  fallbackProps?: any;
  onInteract?: (data: any) => void;
}

export const HtmlWidgetRenderer: React.FC<HtmlWidgetRendererProps> = ({
  htmlContent,
  fallbackProps = {},
  onInteract
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Handle clicks on interactive elements
    const handleClick = (event: MouseEvent) => {
      let targetElement = event.target as HTMLElement;
      const container = containerRef.current;
      
      if (!container) return;

      // Traverse up to find element with interaction data
      while (
        targetElement &&
        targetElement !== container &&
        !targetElement.dataset.interactionId
      ) {
        targetElement = targetElement.parentElement as HTMLElement;
      }

      if (targetElement && targetElement.dataset.interactionId && onInteract) {
        event.preventDefault();
        
        const interactionData = {
          id: targetElement.dataset.interactionId,
          type: targetElement.dataset.interactionType || 'click',
          value: targetElement.dataset.interactionValue,
          elementType: targetElement.tagName.toLowerCase(),
          elementText: targetElement.innerText?.trim().substring(0, 100)
        };
        
        onInteract(interactionData);
      }
    };

    containerRef.current.addEventListener('click', handleClick);

    // Process and execute embedded scripts
    const scripts = Array.from(containerRef.current.getElementsByTagName('script'));
    scripts.forEach((oldScript) => {
      try {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        
        // Copy content
        newScript.text = oldScript.innerHTML;

        // Replace old script with new one to execute it
        if (oldScript.parentNode) {
          oldScript.parentNode.replaceChild(newScript, oldScript);
        }
      } catch (error) {
        console.error('Error executing widget script:', error);
      }
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick);
      }
    };
  }, [htmlContent, onInteract]);

  // Check if it's an error message or JSX code (which we can't render)
  if (htmlContent.includes('export default function') || 
      htmlContent.includes('import {') ||
      htmlContent.includes('import React')) {
    return (
      <Box p={4}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">
            Widget generated JSX instead of HTML. Updating rendering method...
          </Text>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      w="full"
      h="full"
      overflow="auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      sx={{
        '& > *': {
          maxWidth: '100%',
          boxSizing: 'border-box'
        }
      }}
    />
  );
};
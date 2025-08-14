/**
 * Generated Workspace Component
 * Renders dynamically generated HTML workspaces with interaction tracking
 * Inspired by gemini-os's GeneratedContent component
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { InteractionData } from '../services/DynamicWorkspaceGenerator';
import { WORKSPACE_CSS } from '../services/workspacePrompts';

interface GeneratedWorkspaceProps {
  htmlContent: string;
  onInteract: (data: InteractionData) => void;
  workspaceContext: string | null;
  isLoading: boolean;
}

export const GeneratedWorkspace: React.FC<GeneratedWorkspaceProps> = ({
  htmlContent,
  onInteract,
  workspaceContext,
  isLoading,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const processedContentRef = useRef<string | null>(null);

  // Handle clicks on interactive elements (following gemini-os pattern)
  const handleInteraction = useCallback((event: MouseEvent) => {
    let targetElement = event.target as HTMLElement;
    const container = contentRef.current;
    
    if (!container) return;

    // Traverse up to find element with interaction data
    while (
      targetElement &&
      targetElement !== container &&
      !targetElement.dataset.interactionId
    ) {
      targetElement = targetElement.parentElement as HTMLElement;
    }

    if (targetElement && targetElement.dataset.interactionId) {
      event.preventDefault();

      // Get value from linked input if specified
      let interactionValue: string | undefined = targetElement.dataset.interactionValue;
      
      if (targetElement.dataset.valueFrom) {
        const inputElement = document.getElementById(
          targetElement.dataset.valueFrom
        ) as HTMLInputElement | HTMLTextAreaElement;
        
        if (inputElement) {
          interactionValue = inputElement.value;
        }
      }

      // Create interaction data object
      const interactionData: InteractionData = {
        id: targetElement.dataset.interactionId,
        type: targetElement.dataset.interactionType || 'click',
        value: interactionValue,
        elementType: targetElement.tagName.toLowerCase(),
        elementText: (
          targetElement.innerText ||
          (targetElement as HTMLInputElement).value ||
          ''
        )
          .trim()
          .substring(0, 100),
        workspaceContext: workspaceContext,
        timestamp: Date.now(),
      };

      // Trigger interaction callback
      onInteract(interactionData);
    }
  }, [workspaceContext, onInteract]);

  // Process and execute embedded scripts (following gemini-os pattern)
  const processScripts = useCallback(() => {
    const container = contentRef.current;
    if (!container) return;

    const scripts = Array.from(container.getElementsByTagName('script'));
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
        console.error('Error executing embedded script:', error);
      }
    });
  }, []);

  // Setup interaction handlers and process scripts
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Add click handler for interactions
    container.addEventListener('click', handleInteraction);

    // Process scripts when content changes and loading is complete
    if (!isLoading && htmlContent !== processedContentRef.current) {
      // Add default styles if not present
      if (!htmlContent.includes('<style>')) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = WORKSPACE_CSS.replace('<style>', '').replace('</style>', '');
        container.prepend(styleElement);
      }

      // Process embedded scripts
      processScripts();
      
      // Mark content as processed
      processedContentRef.current = htmlContent;
    } else if (isLoading) {
      // Reset processed content when loading
      processedContentRef.current = null;
    }

    // Cleanup
    return () => {
      container.removeEventListener('click', handleInteraction);
    };
  }, [htmlContent, isLoading, handleInteraction, processScripts]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K for quick search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape to clear/reset
      if (event.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box
      ref={contentRef}
      w="full"
      h="full"
      position="relative"
      bg="transparent"
      borderRadius="lg"
      overflow="auto"
      sx={{
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
        // Ensure iframes respect container boundaries
        '& iframe': {
          maxWidth: '100%',
          minHeight: '400px',
        },
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
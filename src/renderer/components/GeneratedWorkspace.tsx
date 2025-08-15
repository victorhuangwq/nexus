/**
 * Generated Workspace Component
 * Renders dynamically generated HTML workspaces with interaction tracking
 * Based directly on gemini-os's GeneratedContent component
 */

import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { InteractionData } from '../services/DynamicWorkspaceGenerator';

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
  const processedHtmlContentRef = useRef<string | null>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleClick = (event: MouseEvent) => {
      let targetElement = event.target as HTMLElement;

      while (
        targetElement &&
        targetElement !== container &&
        !targetElement.dataset.interactionId
      ) {
        targetElement = targetElement.parentElement as HTMLElement;
      }

      if (targetElement && targetElement.dataset.interactionId) {
        event.preventDefault();

        let interactionValue: string | undefined =
          targetElement.dataset.interactionValue;

        if (targetElement.dataset.valueFrom) {
          const inputElement = document.getElementById(
            targetElement.dataset.valueFrom,
          ) as HTMLInputElement | HTMLTextAreaElement;
          if (inputElement) {
            interactionValue = inputElement.value;
          }
        }

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
        onInteract(interactionData);
      }
    };

    container.addEventListener('click', handleClick);

    // Process scripts only when loading is complete and content has changed
    if (!isLoading) {
      if (htmlContent !== processedHtmlContentRef.current) {
        console.log('=== PROCESSING HTML IN COMPONENT ===');
        console.log('HTML content length:', htmlContent?.length);
        console.log('First 500 chars:', htmlContent?.substring(0, 500));
        
        const scripts = Array.from(container.getElementsByTagName('script'));
        console.log('Found scripts:', scripts.length);
        
        scripts.forEach((oldScript, index) => {
          const scriptContent = oldScript.innerHTML.trim();
          console.log(`Processing script ${index + 1}:`, scriptContent.substring(0, 200));
          
          // Skip empty scripts
          if (!scriptContent) {
            console.warn(`Script ${index + 1} is empty, skipping`);
            return;
          }

          // Basic validation to check if script looks complete
          const openBraces = (scriptContent.match(/\{/g) || []).length;
          const closeBraces = (scriptContent.match(/\}/g) || []).length;
          const openParens = (scriptContent.match(/\(/g) || []).length;
          const closeParens = (scriptContent.match(/\)/g) || []).length;
          
          if (openBraces !== closeBraces || openParens !== closeParens) {
            console.error(
              `Script ${index + 1} appears to be incomplete or malformed:`,
              {
                openBraces,
                closeBraces,
                openParens,
                closeParens,
                scriptPreview: scriptContent.substring(0, 200) + '...',
                scriptLength: scriptContent.length
              }
            );
            // Don't execute malformed scripts
            return;
          }

          try {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr) =>
              newScript.setAttribute(attr.name, attr.value),
            );
            newScript.text = scriptContent;

            if (oldScript.parentNode) {
              oldScript.parentNode.replaceChild(newScript, oldScript);
            } else {
              console.warn(
                'Script tag found without a parent node:',
                oldScript,
              );
            }
          } catch (e) {
            console.error(
              'Error processing/executing script tag. This usually indicates a syntax error in the LLM-generated script.',
              {
                scriptContent:
                  scriptContent.substring(0, 500) +
                  (scriptContent.length > 500 ? '...' : ''),
                error: e,
              },
            );
          }
        });
        processedHtmlContentRef.current = htmlContent;
      }
    } else {
      processedHtmlContentRef.current = null;
    }

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [htmlContent, onInteract, workspaceContext, isLoading]);

  return (
    <Box
      ref={contentRef}
      w="full"
      h="full"
      overflow="auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
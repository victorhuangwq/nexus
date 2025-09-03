/**
 * GeneratedWorkspace Component
 * Renders dynamically generated HTML workspaces with interaction tracking
 * Based directly on gemini-os's GeneratedContent component
 */

import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { InteractionData } from '../services/DynamicWorkspaceGenerator';
import { tokens } from '../design-tokens';

// Styled components that match homepage aesthetic
const WorkspaceContainer = styled(Box)`
  * {
    font-family: ${tokens.typography.fontFamily.sans} !important;
  }

  /* Override ANY loud backgrounds with clean glass effect */
  div[style*="background"],
  div[style*="background-color"],
  .header,
  .hero,
  [class*="header"],
  [class*="hero"] {
    background: ${tokens.glass.light.background} !important;
    backdrop-filter: ${tokens.glass.light.blur} !important;
    border: ${tokens.glass.light.border} !important;
    border-radius: ${tokens.radius.xl} !important;
    padding: ${tokens.space[5]} !important;
    margin-bottom: ${tokens.space[4]} !important;
    box-shadow: ${tokens.glass.light.shadow} !important;
    color: ${tokens.colors.text.primary} !important;
  }

  /* Typography - clean and elegant */
  h1, h2, h3, h4, h5, h6 {
    color: ${tokens.colors.text.primary} !important;
    font-weight: ${tokens.typography.fontWeight.semibold} !important;
    margin-bottom: ${tokens.space[3]} !important;
    text-shadow: none !important;
  }

  h1 {
    font-size: ${tokens.typography.fontSize['2xl']} !important;
    font-weight: ${tokens.typography.fontWeight.bold} !important;
  }

  p {
    color: ${tokens.colors.text.secondary} !important;
    line-height: ${tokens.typography.lineHeight.relaxed} !important;
    margin-bottom: ${tokens.space[3]} !important;
  }

  /* Clean card styling like homepage */
  .card,
  [class*="card"],
  .container,
  [class*="container"],
  .form-section,
  [class*="form"] {
    background: ${tokens.surface.card.background} !important;
    border: ${tokens.surface.card.border} !important;
    border-radius: ${tokens.radius.lg} !important;
    padding: ${tokens.space[4]} !important;
    margin-bottom: ${tokens.space[4]} !important;
    box-shadow: ${tokens.surface.card.shadow} !important;
    transition: all ${tokens.transition.duration.fast} !important;
  }

  .card:hover,
  [class*="card"]:hover {
    box-shadow: ${tokens.surface.card.hoverShadow} !important;
  }

  /* Modern button styling */
  button {
    background: ${tokens.surface.card.background} !important;
    border: ${tokens.surface.card.border} !important;
    border-radius: ${tokens.radius.md} !important;
    padding: ${tokens.space[3]} ${tokens.space[4]} !important;
    color: ${tokens.colors.text.primary} !important;
    font-weight: ${tokens.typography.fontWeight.medium} !important;
    box-shadow: ${tokens.surface.card.shadow} !important;
    cursor: pointer !important;
    transition: all ${tokens.transition.duration.fast} !important;
  }

  button:hover {
    box-shadow: ${tokens.surface.card.hoverShadow} !important;
    border-color: ${tokens.colors.brand.primary} !important;
    transform: translateY(-1px) !important;
  }

  /* Clean input styling */
  input, textarea, select {
    background: ${tokens.surface.input.background} !important;
    border: ${tokens.surface.input.border} !important;
    border-radius: ${tokens.radius.md} !important;
    padding: ${tokens.space[3]} !important;
    color: ${tokens.colors.text.primary} !important;
    box-shadow: ${tokens.surface.input.shadow} !important;
    transition: all ${tokens.transition.duration.fast} !important;
  }

  input:focus, textarea:focus, select:focus {
    border: ${tokens.surface.input.focusBorder} !important;
    box-shadow: ${tokens.surface.input.focusShadow} !important;
    outline: none !important;
  }

  /* Navigation/tab styling */
  .nav, .tabs, [class*="nav"], [class*="tab"] {
    background: transparent !important;
    border-bottom: 1px solid ${tokens.colors.surface.divider} !important;
    margin-bottom: ${tokens.space[4]} !important;
  }

  .nav button, .tabs button, [class*="nav"] button, [class*="tab"] button {
    background: transparent !important;
    border: none !important;
    border-bottom: 2px solid transparent !important;
    border-radius: 0 !important;
    padding: ${tokens.space[3]} ${tokens.space[4]} !important;
    margin-bottom: -1px !important;
    box-shadow: none !important;
  }

  .nav button.active, 
  .tabs button.active,
  [class*="nav"] button.active,
  [class*="tab"] button.active,
  .nav button[aria-selected="true"],
  .tabs button[aria-selected="true"] {
    border-bottom-color: ${tokens.colors.brand.primary} !important;
    color: ${tokens.colors.brand.primary} !important;
  }
`;

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

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Set up click handlers for interaction tracking
    const handleClick = (event: MouseEvent) => {
      let targetElement = event.target as HTMLElement;

      // Walk up the DOM tree to find a clickable element with interaction data
      while (targetElement && targetElement !== container) {
        const interactionId = targetElement.dataset.interactionId;

        if (interactionId) {
          event.preventDefault();
          event.stopPropagation();

          // Only trigger workspace regeneration for explicit workspace_change type
          if (targetElement.dataset.interactionType === 'workspace_change') {
            console.log('🔄 Triggering workspace change:', interactionId);
          }

          onInteract({
            id: interactionId,
            element: targetElement.tagName.toLowerCase(),
            text: targetElement.textContent?.slice(0, 100) || '',
            context: workspaceContext || 'unknown',
            timestamp: Date.now(),
            elementHtml: targetElement.outerHTML.slice(0, 200),
            type: targetElement.dataset.interactionType || 'workspace_change',
          });
          return;
        }

        targetElement = targetElement.parentElement as HTMLElement;
      }
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [htmlContent, onInteract, workspaceContext, isLoading]);

  return (
    <WorkspaceContainer
      ref={contentRef}
      w="full"
      h="full"
      p={tokens.space[4]}
      overflow="auto"
      bg={tokens.colors.canvas.base}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
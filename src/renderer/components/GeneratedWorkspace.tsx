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

// Styled component for workspace content
const WorkspaceContainer = styled(Box)<{ isPregenerated: boolean }>`
  width: 100%;
  height: 100%;
  padding: ${tokens.space[4]};
  overflow: auto;
  background: ${tokens.colors.canvas.base};
  
  /* Only apply styles to AI-generated content */
  ${props => !props.isPregenerated ? `
    font-family: ${tokens.typography.fontFamily.sans};
    /* Target ANY element with inline background styles */
    & *[style*="background-color"],
    & *[style*="background:"],
    & *[style*="background "] {
      background: ${tokens.glass.light.background} !important;
      backdrop-filter: ${tokens.glass.light.blur} !important;
      border: ${tokens.glass.light.border} !important;
      border-radius: ${tokens.radius.xl} !important;
      padding: ${tokens.space[5]} !important;
      margin-bottom: ${tokens.space[4]} !important;
      box-shadow: ${tokens.glass.light.shadow} !important;
      color: ${tokens.colors.text.primary} !important;
      text-shadow: none !important;
    }

    /* Target specific color patterns (orange, bright colors) */
    & *[style*="orange"],
    & *[style*="#FF8C42"],
    & *[style*="#ff8c42"],
    & *[style*="rgb(255"],
    & *[style*="rgb(240"] {
      background: ${tokens.glass.light.background} !important;
      backdrop-filter: ${tokens.glass.light.blur} !important;
      color: ${tokens.colors.text.primary} !important;
      border-radius: ${tokens.radius.xl} !important;
      padding: ${tokens.space[5]} !important;
    }

    /* Typography overrides */
    & h1, & h2, & h3, & h4, & h5, & h6 {
      color: ${tokens.colors.text.primary} !important;
      font-weight: ${tokens.typography.fontWeight.semibold} !important;
      margin-bottom: ${tokens.space[3]} !important;
      text-shadow: none !important;
      background: transparent !important;
    }

    & h1 {
      font-size: ${tokens.typography.fontSize['2xl']} !important;
      font-weight: ${tokens.typography.fontWeight.bold} !important;
      margin-bottom: ${tokens.space[4]} !important;
    }

    & h2 {
      font-size: ${tokens.typography.fontSize.xl} !important;
      margin-bottom: ${tokens.space[4]} !important;
    }

    & p {
      color: ${tokens.colors.text.secondary} !important;
      line-height: ${tokens.typography.lineHeight.relaxed} !important;
      margin-bottom: ${tokens.space[3]} !important;
      background: transparent !important;
    }

    /* Form elements styling */
    & input, & textarea, & select {
      background: ${tokens.surface.input.background} !important;
      border: ${tokens.surface.input.border} !important;
      border-radius: ${tokens.radius.md} !important;
      padding: ${tokens.space[3]} !important;
      color: ${tokens.colors.text.primary} !important;
      box-shadow: ${tokens.surface.input.shadow} !important;
      transition: all ${tokens.transition.duration.fast} !important;
      font-family: ${tokens.typography.fontFamily.sans} !important;
    }

    & input:focus, & textarea:focus, & select:focus {
      border: ${tokens.surface.input.focusBorder} !important;
      box-shadow: ${tokens.surface.input.focusShadow} !important;
      outline: none !important;
    }

    /* Button styling */
    & button {
      background: ${tokens.surface.card.background} !important;
      border: ${tokens.surface.card.border} !important;
      border-radius: ${tokens.radius.md} !important;
      padding: ${tokens.space[3]} ${tokens.space[4]} !important;
      color: ${tokens.colors.text.primary} !important;
      font-weight: ${tokens.typography.fontWeight.medium} !important;
      box-shadow: ${tokens.surface.card.shadow} !important;
      cursor: pointer !important;
      transition: all ${tokens.transition.duration.fast} !important;
      font-family: ${tokens.typography.fontFamily.sans} !important;
    }

    & button:hover {
      box-shadow: ${tokens.surface.card.hoverShadow} !important;
      border-color: ${tokens.colors.brand.primary} !important;
      transform: translateY(-1px) !important;
    }

    /* Card-like containers */
    & .card, & [class*="card"],
    & .container, & [class*="container"],
    & .form-section, & [class*="form"],
    & section, & .section {
      background: ${tokens.surface.card.background} !important;
      border: ${tokens.surface.card.border} !important;
      border-radius: ${tokens.radius.lg} !important;
      padding: ${tokens.space[4]} !important;
      margin-bottom: ${tokens.space[4]} !important;
      box-shadow: ${tokens.surface.card.shadow} !important;
      transition: all ${tokens.transition.duration.fast} !important;
    }

    & .card:hover, & [class*="card"]:hover {
      box-shadow: ${tokens.surface.card.hoverShadow} !important;
    }

    /* Navigation/tabs styling */
    & .nav, & .tabs, & [class*="nav"], & [class*="tab"]:not(button) {
      background: transparent !important;
      border-bottom: 1px solid ${tokens.colors.surface.divider} !important;
      margin-bottom: ${tokens.space[4]} !important;
      padding: 0 !important;
    }

    & .nav button, & .tabs button, 
    & [class*="nav"] button, & [class*="tab"] button {
      background: transparent !important;
      border: none !important;
      border-bottom: 2px solid transparent !important;
      border-radius: 0 !important;
      padding: ${tokens.space[3]} ${tokens.space[4]} !important;
      margin-bottom: -1px !important;
      box-shadow: none !important;
      transform: none !important;
    }

    & .nav button.active, & .tabs button.active,
    & [class*="nav"] button.active, & [class*="tab"] button.active,
    & .nav button[aria-selected="true"], & .tabs button[aria-selected="true"] {
      border-bottom-color: ${tokens.colors.brand.primary} !important;
      color: ${tokens.colors.brand.primary} !important;
      transform: none !important;
    }

    /* Lists */
    & ul, & ol {
      padding-left: ${tokens.space[4]} !important;
      margin-bottom: ${tokens.space[4]} !important;
    }

    & li {
      color: ${tokens.colors.text.secondary} !important;
      margin-bottom: ${tokens.space[1]} !important;
      line-height: ${tokens.typography.lineHeight.relaxed} !important;
    }

    /* Tables */
    & table {
      width: 100% !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      background: ${tokens.surface.card.background} !important;
      border: ${tokens.surface.card.border} !important;
      border-radius: ${tokens.radius.lg} !important;
      overflow: hidden !important;
      box-shadow: ${tokens.surface.card.shadow} !important;
    }

    & th, & td {
      padding: ${tokens.space[3]} ${tokens.space[4]} !important;
      border-bottom: 1px solid ${tokens.colors.surface.divider} !important;
      background: transparent !important;
    }

    & th {
      background: ${tokens.colors.surface.secondary} !important;
      color: ${tokens.colors.text.primary} !important;
      font-weight: ${tokens.typography.fontWeight.semibold} !important;
      font-size: ${tokens.typography.fontSize.sm} !important;
    }

    & td {
      color: ${tokens.colors.text.secondary} !important;
    }
  ` : ''}
`;

interface GeneratedWorkspaceProps {
  htmlContent: string;
  onInteract: (data: InteractionData) => void;
  workspaceContext: string | null;
  isLoading: boolean;
  isPregenerated?: boolean; // true for static templates, false/undefined for AI-generated
}

export const GeneratedWorkspace: React.FC<GeneratedWorkspaceProps> = ({
  htmlContent,
  onInteract,
  workspaceContext,
  isLoading,
  isPregenerated = false,
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
      isPregenerated={isPregenerated}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
import React from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  AspectRatio,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';
import type { LayoutSlot, LayoutTemplate } from './types';
import { ComponentExecutor } from '../utils/ComponentExecutor';

// Utility component to render different slot types
const SlotRenderer: React.FC<{ slot: LayoutSlot }> = ({ slot }) => {
  switch (slot.type) {
    case 'iframe':
      return (
        <AspectRatio 
          ratio={slot.props.aspectRatio || 16/9} 
          w="full" 
          h="full"
          data-testid="aspect-ratio-container"
        >
          <Box
            as="iframe"
            src={slot.props.url}
            title={slot.props.title || 'Content'}
            borderRadius="md"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            sandbox="allow-scripts allow-same-origin allow-forms"
            allowFullScreen
          />
        </AspectRatio>
      );
    
    case 'widget':
      // If we have a dynamically generated component, render it
      if (slot.component) {
        return <ComponentExecutor componentCode={slot.component} fallbackProps={slot.props} />;
      }
      
      // Otherwise render basic widget with props
      return (
        <Box
          p={4}
          bg="rgba(255, 255, 255, 0.05)"
          borderRadius="lg"
          border="1px solid rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          h="full"
          w="full"
        >
          <Text color="white">{slot.props.content}</Text>
          {slot.props.data && (
            <Box mt={2} fontSize="sm" color="rgba(255, 255, 255, 0.7)">
              {JSON.stringify(slot.props.data)}
            </Box>
          )}
        </Box>
      );
    
    case 'text':
      return (
        <Box p={4}>
          <Text color="white" fontSize="md" lineHeight="1.6">
            {slot.props.content}
          </Text>
        </Box>
      );
    
    case 'media':
      return (
        <AspectRatio 
          ratio={slot.props.aspectRatio || 16/9} 
          w="full"
          data-testid="aspect-ratio-container"
        >
          <Box
            as="iframe"
            src={slot.props.url}
            title={slot.props.title || 'Media Content'}
            borderRadius="lg"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            allowFullScreen
          />
        </AspectRatio>
      );
    
    default:
      return (
        <Box p={4} color="rgba(255, 255, 255, 0.5)">
          <Text>Unsupported slot type: {slot.type}</Text>
        </Box>
      );
  }
};

// Individual Layout Components
export const SingleWebsiteLayout: React.FC<{ slots: LayoutSlot[] }> = ({ slots }) => {
  const mainSlot = slots.find(slot => slot.id === 'main');
  
  if (!mainSlot) {
    return (
      <Box p={8} textAlign="center" color="rgba(255, 255, 255, 0.6)">
        <Text>No content available</Text>
      </Box>
    );
  }

  return (
    <Box h="full" w="full">
      <SlotRenderer slot={mainSlot} />
    </Box>
  );
};

export const SplitViewLayout: React.FC<{ slots: LayoutSlot[] }> = ({ slots }) => {
  const leftSlot = slots.find(slot => slot.id === 'left');
  const rightSlot = slots.find(slot => slot.id === 'right');

  return (
    <Grid templateColumns="1fr 1fr" gap={6} h="full">
      <GridItem>
        {leftSlot ? (
          <SlotRenderer slot={leftSlot} />
        ) : (
          <Box p={4} color="rgba(255, 255, 255, 0.5)">
            <Text>No left content</Text>
          </Box>
        )}
      </GridItem>
      <GridItem>
        {rightSlot ? (
          <SlotRenderer slot={rightSlot} />
        ) : (
          <Box p={4} color="rgba(255, 255, 255, 0.5)">
            <Text>No right content</Text>
          </Box>
        )}
      </GridItem>
    </Grid>
  );
};

export const DashboardLayout: React.FC<{ slots: LayoutSlot[] }> = ({ slots }) => {
  const widgetSlots = slots.filter(slot => slot.id.startsWith('widget-')).slice(0, 6);
  
  if (widgetSlots.length === 0) {
    return (
      <Box p={8} textAlign="center" color="rgba(255, 255, 255, 0.6)">
        <Text>No widgets to display</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid 
      columns={{ base: 1, md: 2, lg: 3 }} 
      spacing={6} 
      w="full"
      minH="200px"
    >
      {widgetSlots.map((slot) => (
        <Box key={slot.id} minH="200px">
          <SlotRenderer slot={slot} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export const ListDetailLayout: React.FC<{ slots: LayoutSlot[] }> = ({ slots }) => {
  const listSlot = slots.find(slot => slot.id === 'list');
  const detailSlot = slots.find(slot => slot.id === 'detail');

  return (
    <Grid templateColumns="300px 1fr" gap={6} h="full">
      <GridItem>
        {listSlot ? (
          <SlotRenderer slot={listSlot} />
        ) : (
          <Box p={4} color="rgba(255, 255, 255, 0.5)">
            <Text>No list content</Text>
          </Box>
        )}
      </GridItem>
      <GridItem>
        {detailSlot ? (
          <SlotRenderer slot={detailSlot} />
        ) : (
          <Box p={4} color="rgba(255, 255, 255, 0.5)">
            <Text>No detail content</Text>
          </Box>
        )}
      </GridItem>
    </Grid>
  );
};

export const MediaFocusLayout: React.FC<{ slots: LayoutSlot[] }> = ({ slots }) => {
  const mediaSlot = slots.find(slot => slot.id === 'media');
  const controlsSlot = slots.find(slot => slot.id === 'controls');
  const infoSlot = slots.find(slot => slot.id === 'info');

  return (
    <VStack spacing={6} w="full" h="full">
      <Box flex="1" w="full" minH="400px">
        {mediaSlot ? (
          <SlotRenderer slot={mediaSlot} />
        ) : (
          <Box p={8} textAlign="center" color="rgba(255, 255, 255, 0.5)">
            <Text>No media content</Text>
          </Box>
        )}
      </Box>
      
      <HStack spacing={6} w="full">
        <Box flex="1">
          {controlsSlot && <SlotRenderer slot={controlsSlot} />}
        </Box>
        <Box flex="1">
          {infoSlot && <SlotRenderer slot={infoSlot} />}
        </Box>
      </HStack>
    </VStack>
  );
};

export const ComparisonViewLayout: React.FC<{ slots: LayoutSlot[] }> = ({ slots }) => {
  const itemSlots = slots.filter(slot => slot.id.startsWith('item-')).slice(0, 4);
  
  if (itemSlots.length === 0) {
    return (
      <Box p={8} textAlign="center" color="rgba(255, 255, 255, 0.6)">
        <Text>No items to compare</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid 
      columns={{ base: 1, md: 2 }} 
      spacing={6} 
      w="full"
      minH="300px"
    >
      {itemSlots.map((slot) => (
        <Box key={slot.id} minH="300px">
          <SlotRenderer slot={slot} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export const FeedLayout: React.FC<{ slots: LayoutSlot[] }> = ({ slots }) => {
  const feedSlots = slots.filter(slot => slot.id.startsWith('feed-')).slice(0, 10);
  
  if (feedSlots.length === 0) {
    return (
      <Box p={8} textAlign="center" color="rgba(255, 255, 255, 0.6)">
        <Text>No feed items</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} w="full" align="stretch">
      {feedSlots.map((slot) => (
        <Box key={slot.id} minH="150px">
          <SlotRenderer slot={slot} />
        </Box>
      ))}
    </VStack>
  );
};

// Layout Registry
export const LAYOUT_REGISTRY: Record<string, LayoutTemplate> = {
  SingleWebsite: {
    name: 'SingleWebsite',
    description: 'Full-screen iframe for single website',
    component: SingleWebsiteLayout,
    slotDefinitions: [
      { id: 'main', type: 'iframe', purpose: 'primary website' }
    ]
  },
  SplitView: {
    name: 'SplitView',
    description: 'Two side-by-side panels',
    component: SplitViewLayout,
    slotDefinitions: [
      { id: 'left', type: 'iframe|widget', purpose: 'primary content' },
      { id: 'right', type: 'iframe|widget', purpose: 'secondary content' }
    ]
  },
  Dashboard: {
    name: 'Dashboard',
    description: 'Grid of 2-6 widgets/cards',
    component: DashboardLayout,
    slotDefinitions: Array.from({ length: 6 }, (_, i) => ({
      id: `widget-${i}`, 
      type: 'widget', 
      purpose: 'dashboard item'
    }))
  },
  ListDetail: {
    name: 'ListDetail',
    description: 'Left sidebar list, right detail view',
    component: ListDetailLayout,
    slotDefinitions: [
      { id: 'list', type: 'widget', purpose: 'navigation/list' },
      { id: 'detail', type: 'iframe|widget', purpose: 'detail view' }
    ]
  },
  MediaFocus: {
    name: 'MediaFocus',
    description: 'Large media area with controls',
    component: MediaFocusLayout,
    slotDefinitions: [
      { id: 'media', type: 'media', purpose: 'primary media' },
      { id: 'controls', type: 'widget', purpose: 'media controls' },
      { id: 'info', type: 'text', purpose: 'media information' }
    ]
  },
  ComparisonView: {
    name: 'ComparisonView',
    description: 'Side-by-side comparison table/cards',
    component: ComparisonViewLayout,
    slotDefinitions: Array.from({ length: 4 }, (_, i) => ({
      id: `item-${i}`, 
      type: 'widget', 
      purpose: 'comparison item'
    }))
  },
  FeedLayout: {
    name: 'FeedLayout',
    description: 'Vertical scrolling feed of content',
    component: FeedLayout,
    slotDefinitions: Array.from({ length: 10 }, (_, i) => ({
      id: `feed-${i}`, 
      type: 'widget', 
      purpose: 'feed item'
    }))
  }
};

// Utility function to get layout by name
export const getLayoutByName = (name: string): LayoutTemplate | null => {
  return LAYOUT_REGISTRY[name] || null;
};
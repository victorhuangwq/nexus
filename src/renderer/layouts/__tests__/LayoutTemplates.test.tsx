import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import {
  SingleWebsiteLayout,
  SplitViewLayout,
  DashboardLayout,
  ListDetailLayout,
  MediaFocusLayout,
  ComparisonViewLayout,
  FeedLayout,
  getLayoutByName,
  LAYOUT_REGISTRY
} from '../LayoutTemplates';
import type { LayoutSlot } from '../types';

const MockWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('Layout Template System', () => {
  describe('SingleWebsiteLayout', () => {
    it('renders iframe in main slot', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'main',
          type: 'iframe',
          props: {
            url: 'https://youtube.com/embed/test',
            title: 'Test Video'
          }
        }
      ];

      render(
        <MockWrapper>
          <SingleWebsiteLayout slots={slots} />
        </MockWrapper>
      );

      const iframe = screen.getByTitle('Test Video');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'https://youtube.com/embed/test');
    });

    it('handles missing main slot gracefully', () => {
      render(
        <MockWrapper>
          <SingleWebsiteLayout slots={[]} />
        </MockWrapper>
      );

      expect(screen.getByText('No content available')).toBeInTheDocument();
    });
  });

  describe('SplitViewLayout', () => {
    it('renders left and right slots side by side', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'left',
          type: 'iframe',
          props: { url: 'https://example.com', title: 'Left Content' }
        },
        {
          id: 'right',
          type: 'widget',
          props: { content: 'Right Widget' }
        }
      ];

      render(
        <MockWrapper>
          <SplitViewLayout slots={slots} />
        </MockWrapper>
      );

      expect(screen.getByTitle('Left Content')).toBeInTheDocument();
      expect(screen.getByText('Right Widget')).toBeInTheDocument();
    });
  });

  describe('DashboardLayout', () => {
    it('renders widgets in responsive grid', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'widget-0',
          type: 'widget',
          props: { content: 'Widget 1' }
        },
        {
          id: 'widget-1',
          type: 'widget',
          props: { content: 'Widget 2' }
        },
        {
          id: 'widget-2',
          type: 'widget',
          props: { content: 'Widget 3' }
        }
      ];

      render(
        <MockWrapper>
          <DashboardLayout slots={slots} />
        </MockWrapper>
      );

      expect(screen.getByText('Widget 1')).toBeInTheDocument();
      expect(screen.getByText('Widget 2')).toBeInTheDocument();
      expect(screen.getByText('Widget 3')).toBeInTheDocument();
    });

    it('limits to maximum 6 widgets', () => {
      const slots: LayoutSlot[] = Array.from({ length: 10 }, (_, i) => ({
        id: `widget-${i}`,
        type: 'widget' as const,
        props: { content: `Widget ${i + 1}` }
      }));

      render(
        <MockWrapper>
          <DashboardLayout slots={slots} />
        </MockWrapper>
      );

      // Should only render first 6
      expect(screen.getByText('Widget 1')).toBeInTheDocument();
      expect(screen.getByText('Widget 6')).toBeInTheDocument();
      expect(screen.queryByText('Widget 7')).not.toBeInTheDocument();
    });
  });

  describe('ListDetailLayout', () => {
    it('renders list on left and detail on right', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'list',
          type: 'widget',
          props: { content: 'Navigation List' }
        },
        {
          id: 'detail',
          type: 'iframe',
          props: { url: 'https://detail.com', title: 'Detail View' }
        }
      ];

      render(
        <MockWrapper>
          <ListDetailLayout slots={slots} />
        </MockWrapper>
      );

      expect(screen.getByText('Navigation List')).toBeInTheDocument();
      expect(screen.getByTitle('Detail View')).toBeInTheDocument();
    });
  });

  describe('MediaFocusLayout', () => {
    it('renders media, controls, and info sections', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'media',
          type: 'media',
          props: { url: 'https://youtube.com/embed/test', title: 'Video' }
        },
        {
          id: 'controls',
          type: 'widget',
          props: { content: 'Media Controls' }
        },
        {
          id: 'info',
          type: 'text',
          props: { content: 'Media Information' }
        }
      ];

      render(
        <MockWrapper>
          <MediaFocusLayout slots={slots} />
        </MockWrapper>
      );

      expect(screen.getByTitle('Video')).toBeInTheDocument();
      expect(screen.getByText('Media Controls')).toBeInTheDocument();
      expect(screen.getByText('Media Information')).toBeInTheDocument();
    });
  });

  describe('Layout Registry', () => {
    it('contains all expected layouts', () => {
      const expectedLayouts = [
        'SingleWebsite',
        'SplitView',
        'Dashboard',
        'ListDetail',
        'MediaFocus',
        'ComparisonView',
        'FeedLayout'
      ];

      expectedLayouts.forEach(layoutName => {
        expect(LAYOUT_REGISTRY[layoutName]).toBeDefined();
        expect(LAYOUT_REGISTRY[layoutName].name).toBe(layoutName);
        expect(LAYOUT_REGISTRY[layoutName].component).toBeDefined();
        expect(LAYOUT_REGISTRY[layoutName].slotDefinitions).toBeDefined();
      });
    });

    it('getLayoutByName returns correct layout', () => {
      const layout = getLayoutByName('SingleWebsite');
      expect(layout).toBe(LAYOUT_REGISTRY.SingleWebsite);
    });

    it('getLayoutByName returns null for invalid name', () => {
      const layout = getLayoutByName('InvalidLayout');
      expect(layout).toBeNull();
    });
  });

  describe('Slot Type Handling', () => {
    it('renders iframe slots with proper security attributes', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'main',
          type: 'iframe',
          props: {
            url: 'https://trusted-site.com',
            title: 'Trusted Content'
          }
        }
      ];

      render(
        <MockWrapper>
          <SingleWebsiteLayout slots={slots} />
        </MockWrapper>
      );

      const iframe = screen.getByTitle('Trusted Content');
      expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    });

    it('renders text slots with proper styling', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'info',
          type: 'text',
          props: {
            content: 'This is important information'
          }
        }
      ];

      render(
        <MockWrapper>
          <MediaFocusLayout slots={slots} />
        </MockWrapper>
      );

      expect(screen.getByText('This is important information')).toBeInTheDocument();
    });

    it('renders widget slots with dynamic content', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'widget-0',
          type: 'widget',
          props: {
            content: 'Dynamic Widget Content',
            data: { count: 5, status: 'active' }
          }
        }
      ];

      render(
        <MockWrapper>
          <DashboardLayout slots={slots} />
        </MockWrapper>
      );

      expect(screen.getByText('Dynamic Widget Content')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('handles empty slots gracefully', () => {
      render(
        <MockWrapper>
          <DashboardLayout slots={[]} />
        </MockWrapper>
      );

      expect(screen.getByText('No widgets to display')).toBeInTheDocument();
    });

    it('maintains aspect ratios for media content', () => {
      const slots: LayoutSlot[] = [
        {
          id: 'media',
          type: 'media',
          props: {
            url: 'https://youtube.com/embed/test',
            title: 'Video Content',
            aspectRatio: 16 / 9
          }
        }
      ];

      render(
        <MockWrapper>
          <MediaFocusLayout slots={slots} />
        </MockWrapper>
      );

      const mediaContainer = screen.getByTitle('Video Content').closest('[data-testid="aspect-ratio-container"]');
      expect(mediaContainer).toBeInTheDocument();
    });
  });
});
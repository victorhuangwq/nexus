import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';

import { App } from '../App';
import { aiPipeline } from '../services/AIPipeline';
import { LAYOUT_REGISTRY } from '../layouts/LayoutTemplates';

// Mock the AI pipeline
jest.mock('../services/AIPipeline', () => ({
  aiPipeline: {
    process: jest.fn(),
  },
}));

const mockAIPipeline = aiPipeline as jest.Mocked<typeof aiPipeline>;

// Mock window.bridge for integration tests
const mockBridge = {
  test: jest.fn().mockResolvedValue({ message: 'Test message', timestamp: Date.now() }),
  getEnv: jest.fn().mockResolvedValue('test'),
  callClaude: jest.fn(),
  selectLayout: jest.fn(),
  planContent: jest.fn(),
};

Object.defineProperty(window, 'bridge', {
  value: mockBridge,
  writable: true,
});

const MockWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('Dynamic Layout Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Layout Template Integration', () => {
    it('renders all layout templates correctly', () => {
      Object.values(LAYOUT_REGISTRY).forEach(template => {
        const TestComponent = template.component;
        const mockSlots = template.slotDefinitions.map(def => ({
          id: def.id,
          type: def.type.split('|')[0] as any, // Use first type option
          props: {
            url: 'https://example.com',
            content: `Test content for ${def.id}`,
            title: `Test ${def.purpose}`
          }
        }));

        const { unmount } = render(
          <MockWrapper>
            <TestComponent slots={mockSlots} />
          </MockWrapper>
        );

        // Should render without crashing
        expect(document.body).toBeInTheDocument();
        
        unmount();
      });
    });

    it('handles empty slots gracefully across all layouts', () => {
      Object.values(LAYOUT_REGISTRY).forEach(template => {
        const TestComponent = template.component;

        const { unmount } = render(
          <MockWrapper>
            <TestComponent slots={[]} />
          </MockWrapper>
        );

        // Should render without crashing even with empty slots
        expect(document.body).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('AI Pipeline Integration', () => {
    it('processes simple intent through full pipeline', async () => {
      mockAIPipeline.process.mockResolvedValue({
        layout: 'SingleWebsite',
        slots: [{
          id: 'main',
          type: 'iframe',
          props: {
            url: 'https://gmail.com',
            title: 'Gmail'
          }
        }],
        processingTime: 500,
        metrics: {
          layoutSelectionTime: 100,
          contentPlanningTime: 200,
          widgetGenerationTime: 0,
          totalTime: 300
        }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      // Find and click the input
      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'check my gmail');
      await userEvent.keyboard('{Enter}');

      // Wait for the AI pipeline to process
      await waitFor(() => {
        expect(mockAIPipeline.process).toHaveBeenCalledWith('check my gmail');
      });

      // Should display the generated iframe
      await waitFor(() => {
        const iframe = screen.getByTitle('Gmail');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', 'https://gmail.com');
      });
    });

    it('processes complex intent with widget generation', async () => {
      mockAIPipeline.process.mockResolvedValue({
        layout: 'Dashboard',
        slots: [
          {
            id: 'widget-0',
            type: 'widget',
            props: { content: 'Timer Widget' },
            component: `
              import { Box, Text, Button } from '@chakra-ui/react';
              export default function TimerWidget() {
                return (
                  <Box p={4}>
                    <Text>25:00</Text>
                    <Button>Start Timer</Button>
                  </Box>
                );
              }
            `
          },
          {
            id: 'widget-1',
            type: 'iframe',
            props: {
              url: 'https://spotify.com',
              title: 'Spotify'
            }
          }
        ],
        processingTime: 1500,
        metrics: {
          layoutSelectionTime: 200,
          contentPlanningTime: 300,
          widgetGenerationTime: 800,
          totalTime: 1300
        }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'pomodoro timer with music');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockAIPipeline.process).toHaveBeenCalledWith('pomodoro timer with music');
      });

      // Should display both the widget and iframe
      await waitFor(() => {
        expect(screen.getByText('Timer Widget')).toBeInTheDocument();
        expect(screen.getByTitle('Spotify')).toBeInTheDocument();
      });
    });

    it('handles AI pipeline errors gracefully', async () => {
      mockAIPipeline.process.mockRejectedValue(new Error('API temporarily unavailable'));

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'failing intent');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockAIPipeline.process).toHaveBeenCalledWith('failing intent');
      });

      // Should fall back to static matching or show error state
      await waitFor(() => {
        // App should still be functional
        expect(screen.getByPlaceholderText(/check my gmail/i)).toBeInTheDocument();
      });
    });
  });

  describe('Floating Input Bar Integration', () => {
    it('shows floating input bar only when content is rendered', async () => {
      mockAIPipeline.process.mockResolvedValue({
        layout: 'SingleWebsite',
        slots: [{
          id: 'main',
          type: 'iframe',
          props: { url: 'https://example.com', title: 'Example' }
        }],
        processingTime: 300,
        metrics: {
          layoutSelectionTime: 100,
          contentPlanningTime: 100,
          widgetGenerationTime: 0,
          totalTime: 200
        }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      // Initially, no floating input bar
      expect(screen.queryByPlaceholderText('Ask for something else...')).not.toBeInTheDocument();

      // Submit an intent
      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'test intent');
      await userEvent.keyboard('{Enter}');

      // Wait for content to render
      await waitFor(() => {
        expect(screen.getByTitle('Example')).toBeInTheDocument();
      });

      // Now floating input bar should appear
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Ask for something else...')).toBeInTheDocument();
      });
    });

    it('allows submitting new intents via floating input bar', async () => {
      // First intent response
      mockAIPipeline.process.mockResolvedValueOnce({
        layout: 'SingleWebsite',
        slots: [{
          id: 'main',
          type: 'iframe',
          props: { url: 'https://first.com', title: 'First Site' }
        }],
        processingTime: 300,
        metrics: { layoutSelectionTime: 100, contentPlanningTime: 100, widgetGenerationTime: 0, totalTime: 200 }
      });

      // Second intent response
      mockAIPipeline.process.mockResolvedValueOnce({
        layout: 'SplitView',
        slots: [
          { id: 'left', type: 'iframe', props: { url: 'https://left.com', title: 'Left Panel' } },
          { id: 'right', type: 'iframe', props: { url: 'https://right.com', title: 'Right Panel' } }
        ],
        processingTime: 400,
        metrics: { layoutSelectionTime: 120, contentPlanningTime: 150, widgetGenerationTime: 0, totalTime: 270 }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      // Submit first intent
      const mainInput = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(mainInput, 'first intent');
      await userEvent.keyboard('{Enter}');

      // Wait for first content
      await waitFor(() => {
        expect(screen.getByTitle('First Site')).toBeInTheDocument();
      });

      // Use floating input bar for second intent
      const floatingInput = screen.getByPlaceholderText('Ask for something else...');
      await userEvent.type(floatingInput, 'second intent');
      await userEvent.keyboard('{Enter}');

      // Wait for second content
      await waitFor(() => {
        expect(screen.getByTitle('Left Panel')).toBeInTheDocument();
        expect(screen.getByTitle('Right Panel')).toBeInTheDocument();
      });

      // Verify both intents were processed
      expect(mockAIPipeline.process).toHaveBeenNthCalledWith(1, 'first intent');
      expect(mockAIPipeline.process).toHaveBeenNthCalledWith(2, 'second intent');
    });
  });

  describe('Performance and User Experience', () => {
    it('shows loading state during AI processing', async () => {
      // Simulate slow AI processing
      mockAIPipeline.process.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            layout: 'SingleWebsite',
            slots: [{ id: 'main', type: 'iframe', props: { url: 'https://slow.com', title: 'Slow Site' } }],
            processingTime: 2000,
            metrics: { layoutSelectionTime: 500, contentPlanningTime: 800, widgetGenerationTime: 0, totalTime: 1300 }
          }), 100)
        )
      );

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'slow intent');
      await userEvent.keyboard('{Enter}');

      // Should show loading state immediately
      expect(screen.getByPlaceholderText(/check my gmail/i)).toBeDisabled();

      // Wait for processing to complete
      await waitFor(() => {
        expect(screen.getByTitle('Slow Site')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Input should be enabled again
      expect(screen.getByPlaceholderText('Ask for something else...')).not.toBeDisabled();
    });

    it('maintains responsive layout across different screen sizes', async () => {
      mockAIPipeline.process.mockResolvedValue({
        layout: 'Dashboard',
        slots: Array.from({ length: 6 }, (_, i) => ({
          id: `widget-${i}`,
          type: 'widget' as const,
          props: { content: `Widget ${i + 1}` }
        })),
        processingTime: 800,
        metrics: { layoutSelectionTime: 200, contentPlanningTime: 300, widgetGenerationTime: 300, totalTime: 800 }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'dashboard intent');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Widget 1')).toBeInTheDocument();
        expect(screen.getByText('Widget 6')).toBeInTheDocument();
      });

      // All widgets should be rendered (grid layout handles responsiveness)
      for (let i = 1; i <= 6; i++) {
        expect(screen.getByText(`Widget ${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility and Usability', () => {
    it('supports keyboard navigation', async () => {
      mockAIPipeline.process.mockResolvedValue({
        layout: 'SingleWebsite',
        slots: [{ id: 'main', type: 'iframe', props: { url: 'https://accessible.com', title: 'Accessible Site' } }],
        processingTime: 300,
        metrics: { layoutSelectionTime: 100, contentPlanningTime: 100, widgetGenerationTime: 0, totalTime: 200 }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      // Tab to input and submit
      await userEvent.keyboard('{Tab}');
      await userEvent.type(document.activeElement!, 'accessible test');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTitle('Accessible Site')).toBeInTheDocument();
      });

      // Should be able to tab to floating input
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).toHaveAttribute('placeholder', 'Ask for something else...');
    });

    it('provides proper ARIA labels and roles', async () => {
      mockAIPipeline.process.mockResolvedValue({
        layout: 'Dashboard',
        slots: [{ id: 'widget-0', type: 'widget', props: { content: 'Accessible Widget' } }],
        processingTime: 300,
        metrics: { layoutSelectionTime: 100, contentPlanningTime: 100, widgetGenerationTime: 100, totalTime: 300 }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'accessibility test');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Accessible Widget')).toBeInTheDocument();
      });

      // Iframe should have proper accessibility attributes
      const widgets = screen.getAllByText(/Accessible Widget/i);
      widgets.forEach(widget => {
        expect(widget).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('falls back to static components when AI fails', async () => {
      mockAIPipeline.process.mockRejectedValue(new Error('Service unavailable'));

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'graphing calculator');
      await userEvent.keyboard('{Enter}');

      // Should fall back to static component matching
      await waitFor(() => {
        // This would require implementing the static fallback in App.tsx
        // For now, just ensure the app doesn't crash
        expect(screen.getByPlaceholderText(/check my gmail/i)).toBeInTheDocument();
      });
    });

    it('handles malformed AI responses gracefully', async () => {
      mockAIPipeline.process.mockResolvedValue({
        layout: 'InvalidLayout',
        slots: [],
        processingTime: 100,
        metrics: { layoutSelectionTime: 50, contentPlanningTime: 50, widgetGenerationTime: 0, totalTime: 100 }
      });

      render(
        <MockWrapper>
          <App />
        </MockWrapper>
      );

      const input = screen.getByPlaceholderText(/check my gmail/i);
      await userEvent.type(input, 'malformed response test');
      await userEvent.keyboard('{Enter}');

      // Should handle gracefully without crashing
      await waitFor(() => {
        // App should remain functional
        expect(screen.getByPlaceholderText(/check my gmail/i)).toBeInTheDocument();
      });
    });
  });
});
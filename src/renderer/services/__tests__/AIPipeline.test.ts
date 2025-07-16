import { AIPipeline } from '../AIPipeline';
import type { LayoutSlot } from '../../layouts/types';

// Mock the bridge
const mockBridge = {
  selectLayout: jest.fn(),
  planContent: jest.fn(),
  callClaude: jest.fn(),
};

// Mock window.bridge
Object.defineProperty(window, 'bridge', {
  value: mockBridge,
  writable: true,
});

describe('AIPipeline', () => {
  let pipeline: AIPipeline;

  beforeEach(() => {
    pipeline = new AIPipeline();
    jest.clearAllMocks();
  });

  describe('Layout Selection Step', () => {
    it('selects appropriate layout for single website intent', async () => {
      const mockResponse = {
        layout: 'SingleWebsite',
        confidence: 0.95,
        reasoning: 'User wants to access a single website'
      };
      
      mockBridge.selectLayout.mockResolvedValue(mockResponse);

      const result = await pipeline.selectLayout('check my gmail');

      expect(mockBridge.selectLayout).toHaveBeenCalledWith('check my gmail');
      expect(result).toEqual(mockResponse);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('selects Dashboard layout for multi-tool intents', async () => {
      const mockResponse = {
        layout: 'Dashboard',
        confidence: 0.88,
        reasoning: 'Multiple tools/data requested'
      };
      
      mockBridge.selectLayout.mockResolvedValue(mockResponse);

      const result = await pipeline.selectLayout('weather dashboard with stocks and news');

      expect(result.layout).toBe('Dashboard');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('handles low confidence layout selection', async () => {
      const mockResponse = {
        layout: 'Dashboard',
        confidence: 0.45,
        reasoning: 'Unclear intent'
      };
      
      mockBridge.selectLayout.mockResolvedValue(mockResponse);

      const result = await pipeline.selectLayout('something vague');

      expect(result.confidence).toBeLessThan(0.7);
    });

    it('falls back gracefully on API failure', async () => {
      mockBridge.selectLayout.mockRejectedValue(new Error('API Error'));

      const result = await pipeline.selectLayout('test intent');

      expect(result.layout).toBe('Dashboard'); // Default fallback
      expect(result.confidence).toBe(0.5);
      expect(result.error).toBeDefined();
    });
  });

  describe('Content Planning Step', () => {
    it('prioritizes real websites over custom widgets', async () => {
      const mockLayoutTemplate = {
        name: 'SplitView',
        description: 'Two side-by-side panels',
        component: null as any,
        slotDefinitions: [
          { id: 'left', type: 'iframe|widget', purpose: 'primary content' },
          { id: 'right', type: 'iframe|widget', purpose: 'secondary content' }
        ]
      };

      const mockContentPlan = {
        slots: [
          {
            id: 'left',
            type: 'iframe',
            props: {
              url: 'https://youtube.com/results?search_query=cats',
              title: 'Cat Videos'
            }
          },
          {
            id: 'right',
            type: 'iframe',
            props: {
              url: 'https://reddit.com/r/cats',
              title: 'Cat Reddit'
            }
          }
        ]
      };

      mockBridge.planContent.mockResolvedValue(mockContentPlan);

      const result = await pipeline.planContent('funny cat videos', mockLayoutTemplate);

      expect(mockBridge.planContent).toHaveBeenCalledWith('funny cat videos', mockLayoutTemplate);
      expect(result.slots).toHaveLength(2);
      expect(result.slots.every(slot => slot.type === 'iframe')).toBe(true);
    });

    it('generates custom widgets when no suitable websites exist', async () => {
      const mockLayoutTemplate = {
        name: 'Dashboard',
        description: 'Grid of widgets',
        component: null as any,
        slotDefinitions: [
          { id: 'widget-0', type: 'widget', purpose: 'timer' },
          { id: 'widget-1', type: 'widget', purpose: 'controls' }
        ]
      };

      const mockContentPlan = {
        slots: [
          {
            id: 'widget-0',
            type: 'widget',
            props: {
              purpose: 'pomodoro timer',
              duration: 25,
              breakDuration: 5
            }
          },
          {
            id: 'widget-1',
            type: 'widget',
            props: {
              purpose: 'timer controls',
              buttons: ['start', 'pause', 'reset']
            }
          }
        ]
      };

      mockBridge.planContent.mockResolvedValue(mockContentPlan);

      const result = await pipeline.planContent('pomodoro timer 25/5', mockLayoutTemplate);

      expect(result.slots).toHaveLength(2);
      expect(result.slots.every(slot => slot.type === 'widget')).toBe(true);
      expect(result.slots[0].props.duration).toBe(25);
    });

    it('validates slot definitions match layout requirements', async () => {
      const invalidLayoutTemplate = {
        name: 'SingleWebsite',
        description: 'Single website layout',
        component: null as any,
        slotDefinitions: [
          { id: 'main', type: 'iframe', purpose: 'primary website' }
        ]
      };

      const invalidContentPlan = {
        slots: [
          {
            id: 'wrong-slot-id',
            type: 'iframe',
            props: { url: 'https://example.com' }
          }
        ]
      };

      mockBridge.planContent.mockResolvedValue(invalidContentPlan);

      await expect(
        pipeline.planContent('test', invalidLayoutTemplate)
      ).rejects.toThrow('Content plan does not match layout requirements');
    });
  });

  describe('Widget Generation Step', () => {
    it('generates functional widgets with proper Chakra UI components', async () => {
      const widgetSpec = {
        id: 'timer-widget',
        type: 'widget' as const,
        props: {
          purpose: 'countdown timer',
          duration: 300
        }
      };

      const mockWidgetCode = `
        import { Box, Text, Button, VStack } from '@chakra-ui/react';
        export default function TimerWidget() {
          return (
            <VStack spacing={4}>
              <Text fontSize="2xl">05:00</Text>
              <Button colorScheme="blue">Start</Button>
            </VStack>
          );
        }
      `;

      mockBridge.callClaude.mockResolvedValue({
        success: true,
        data: mockWidgetCode,
        type: 'component'
      });

      const result = await pipeline.generateWidget(widgetSpec, 'pomodoro timer');

      expect(mockBridge.callClaude).toHaveBeenCalledWith('component', {
        slot: widgetSpec,
        intent: 'pomodoro timer'
      });
      expect(result.component).toContain('TimerWidget');
      expect(result.component).toContain('@chakra-ui/react');
    });

    it('handles widget generation failures gracefully', async () => {
      const widgetSpec = {
        id: 'failing-widget',
        type: 'widget' as const,
        props: { purpose: 'test' }
      };

      mockBridge.callClaude.mockRejectedValue(new Error('Generation failed'));

      const result = await pipeline.generateWidget(widgetSpec, 'test intent');

      expect(result.error).toBeDefined();
      expect(result.component).toContain('Error generating widget');
    });

    it('validates generated widget contains only allowed Chakra components', async () => {
      const widgetSpec = {
        id: 'invalid-widget',
        type: 'widget' as const,
        props: { purpose: 'test' }
      };

      const invalidWidgetCode = `
        import { SomeExternalLib } from 'external-lib';
        export default function BadWidget() {
          return <SomeExternalLib />;
        }
      `;

      mockBridge.callClaude.mockResolvedValue({
        success: true,
        data: invalidWidgetCode,
        type: 'component'
      });

      const result = await pipeline.generateWidget(widgetSpec, 'test');
      
      expect(result.error).toContain('Widget contains unauthorized imports');
      expect(result.component).toContain('Error generating widget');
    });
  });

  describe('Full Pipeline Integration', () => {
    it('executes complete pipeline for simple intent', async () => {
      // Mock layout selection
      mockBridge.selectLayout.mockResolvedValue({
        layout: 'SingleWebsite',
        confidence: 0.92
      });

      // Mock content planning
      mockBridge.planContent.mockResolvedValue({
        slots: [{
          id: 'main',
          type: 'iframe',
          props: {
            url: 'https://gmail.com',
            title: 'Gmail'
          }
        }]
      });

      const result = await pipeline.process('check my gmail');

      expect(result.layout).toBe('SingleWebsite');
      expect(result.slots).toHaveLength(1);
      expect(result.slots[0].type).toBe('iframe');
      expect(result.slots[0].props.url).toBe('https://gmail.com');
      expect(result.processingTime).toBeDefined();
    });

    it('executes complete pipeline with widget generation', async () => {
      // Mock layout selection
      mockBridge.selectLayout.mockResolvedValue({
        layout: 'Dashboard',
        confidence: 0.85
      });

      // Mock content planning
      mockBridge.planContent.mockResolvedValue({
        slots: [
          {
            id: 'widget-0',
            type: 'widget',
            props: { purpose: 'timer display' }
          },
          {
            id: 'widget-1',
            type: 'iframe',
            props: { url: 'https://spotify.com', title: 'Music' }
          }
        ]
      });

      // Mock widget generation
      mockBridge.callClaude.mockResolvedValue({
        success: true,
        data: 'function TimerWidget() { return <Text>Timer</Text>; }',
        type: 'component'
      });

      const result = await pipeline.process('pomodoro timer with music');

      expect(result.layout).toBe('Dashboard');
      expect(result.slots).toHaveLength(2);
      expect(result.slots[0].type).toBe('widget');
      expect((result.slots[0] as any).component).toBeDefined();
      expect(result.slots[1].type).toBe('iframe');
    });

    it('measures and reports performance metrics', async () => {
      mockBridge.selectLayout.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          layout: 'SingleWebsite', 
          confidence: 0.9
        }), 100))
      );

      mockBridge.planContent.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          slots: [{ id: 'main', type: 'iframe', props: { url: 'https://test.com' } }]
        }), 200))
      );

      const result = await pipeline.process('test intent');

      expect(result.metrics).toBeDefined();
      expect(result.metrics.layoutSelectionTime).toBeGreaterThan(50);
      expect(result.metrics.contentPlanningTime).toBeGreaterThan(150);
      expect(result.metrics.totalTime).toBeGreaterThan(200);
    });

    it('handles pipeline failures with graceful fallbacks', async () => {
      mockBridge.selectLayout.mockRejectedValue(new Error('Service unavailable'));

      const result = await pipeline.process('failing intent');

      expect(result.layout).toBe('Dashboard'); // Fallback
      expect(result.error).toBeDefined();
      expect(result.fallbackUsed).toBe(true);
    });
  });

  describe('Security and Validation', () => {
    it('validates iframe URLs are from allowed domains', async () => {
      const suspiciousContentPlan = {
        slots: [{
          id: 'main',
          type: 'iframe',
          props: {
            url: 'javascript:alert("xss")',
            title: 'Malicious'
          }
        }]
      };

      mockBridge.planContent.mockResolvedValue(suspiciousContentPlan);

      await expect(
        pipeline.planContent('test', { 
          name: 'SingleWebsite',
          description: 'Single website',
          component: null as any,
          slotDefinitions: [{ id: 'main', type: 'iframe', purpose: 'test' }] 
        })
      ).rejects.toThrow('Unsafe URL detected');
    });

    it('sanitizes widget props to prevent injection', async () => {
      const maliciousWidgetSpec = {
        id: 'widget-0',
        type: 'widget' as const,
        props: {
          content: '<script>alert("xss")</script>',
          purpose: 'display'
        }
      };

      const result = await pipeline.generateWidget(maliciousWidgetSpec, 'test');
      
      expect(result.component).not.toContain('<script>');
      expect(result.component).not.toContain('alert(');
    });
  });
});
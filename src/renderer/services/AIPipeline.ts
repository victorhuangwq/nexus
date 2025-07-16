import { LAYOUT_REGISTRY, getLayoutByName } from '../layouts/LayoutTemplates';
import type { LayoutSlot, LayoutTemplate } from '../layouts/types';

interface LayoutSelectionResult {
  layout: string;
  confidence: number;
  reasoning?: string;
  error?: string;
}

interface ContentPlanResult {
  slots: LayoutSlot[];
}

interface WidgetGenerationResult {
  component?: string;
  error?: string;
}

interface PipelineResult {
  layout: string;
  slots: LayoutSlot[];
  processingTime: number;
  metrics: {
    layoutSelectionTime: number;
    contentPlanningTime: number;
    widgetGenerationTime: number;
    totalTime: number;
  };
  error?: string;
  fallbackUsed?: boolean;
}

export class AIPipeline {
  private allowedDomains = [
    'youtube.com',
    'youtu.be',
    'github.com',
    'wikipedia.org',
    'reddit.com',
    'gmail.com',
    'google.com',
    'spotify.com',
    'desmos.com',
    'openstreetmap.org',
    'weather.com',
    'coingecko.com',
    'coinmarketcap.com'
  ];

  private allowedChakraComponents = [
    'Box', 'Text', 'VStack', 'HStack', 'Button', 'Input', 
    'Image', 'Grid', 'Card', 'Flex', 'Spacer', 'Divider',
    'Badge', 'Progress', 'Spinner', 'Alert', 'Stack'
  ];

  async selectLayout(intent: string): Promise<LayoutSelectionResult> {
    const startTime = Date.now();
    
    try {
      const result = await window.bridge.selectLayout(intent);
      return result;
    } catch (error) {
      console.error('Layout selection failed:', error);
      return {
        layout: 'Dashboard',
        confidence: 0.5,
        reasoning: 'Fallback to Dashboard due to API failure',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async planContent(intent: string, layoutTemplate: LayoutTemplate): Promise<ContentPlanResult> {
    try {
      // Create a serializable version of the layout template
      const serializableTemplate = {
        name: layoutTemplate.name,
        description: layoutTemplate.description,
        slotDefinitions: layoutTemplate.slotDefinitions
      };
      
      const result = await window.bridge.planContent(intent, serializableTemplate);
      
      // Cast the result to ensure type compatibility
      const typedResult: ContentPlanResult = {
        slots: result.slots.map(slot => ({
          ...slot,
          type: slot.type as LayoutSlot['type']
        }))
      };
      
      // Validate content plan matches layout requirements
      this.validateContentPlan(typedResult, layoutTemplate);
      
      // Validate URLs for security
      typedResult.slots.forEach(slot => {
        if (slot.type === 'iframe' && slot.props.url) {
          this.validateURL(slot.props.url);
        }
      });

      return typedResult;
    } catch (error) {
      console.error('Content planning failed:', error);
      throw error;
    }
  }

  async generateWidget(widgetSpec: LayoutSlot, intent: string): Promise<WidgetGenerationResult> {
    try {
      const result = await window.bridge.callClaude('component', {
        slot: widgetSpec,
        intent: intent
      });

      if (!result.success) {
        throw new Error('Widget generation failed');
      }

      const sanitizedComponent = this.sanitizeWidgetCode(result.data);
      this.validateWidgetSecurity(sanitizedComponent);

      return {
        component: sanitizedComponent
      };
    } catch (error) {
      console.error('Widget generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        error: errorMessage,
        component: this.generateErrorWidget(widgetSpec.id, errorMessage)
      };
    }
  }

  async process(intent: string): Promise<PipelineResult> {
    const startTime = Date.now();
    let layoutSelectionTime = 0;
    let contentPlanningTime = 0;
    let widgetGenerationTime = 0;
    let fallbackUsed = false;

    try {
      // Step 1: Layout Selection
      const layoutStart = Date.now();
      const layoutResult = await this.selectLayout(intent);
      layoutSelectionTime = Date.now() - layoutStart;

      if (layoutResult.confidence < 0.7) {
        layoutResult.layout = 'Dashboard';
        fallbackUsed = true;
      }

      const layoutTemplate = getLayoutByName(layoutResult.layout);
      if (!layoutTemplate) {
        throw new Error(`Invalid layout: ${layoutResult.layout}`);
      }

      // Step 2: Content Planning
      const contentStart = Date.now();
      const contentPlan = await this.planContent(intent, layoutTemplate);
      contentPlanningTime = Date.now() - contentStart;

      // Step 3: Widget Generation (parallel for widgets)
      const widgetStart = Date.now();
      const slots = await Promise.all(
        contentPlan.slots.map(async (slot) => {
          if (slot.type === 'widget') {
            const widgetResult = await this.generateWidget(slot, intent);
            return {
              ...slot,
              component: widgetResult.component,
              error: widgetResult.error
            };
          }
          return slot;
        })
      );
      widgetGenerationTime = Date.now() - widgetStart;

      const totalTime = Date.now() - startTime;

      return {
        layout: layoutResult.layout,
        slots,
        processingTime: totalTime,
        metrics: {
          layoutSelectionTime,
          contentPlanningTime,
          widgetGenerationTime,
          totalTime
        },
        fallbackUsed
      };

    } catch (error) {
      console.error('Pipeline processing failed:', error);
      
      // Emergency fallback
      const totalTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        layout: 'Dashboard',
        slots: [{
          id: 'error-widget',
          type: 'widget',
          props: {
            content: `Unable to process intent: ${intent}`,
            error: errorMessage
          }
        }],
        processingTime: totalTime,
        metrics: {
          layoutSelectionTime,
          contentPlanningTime,
          widgetGenerationTime,
          totalTime
        },
        error: errorMessage,
        fallbackUsed: true
      };
    }
  }

  private validateContentPlan(contentPlan: ContentPlanResult, layoutTemplate: LayoutTemplate): void {
    const requiredSlotIds = layoutTemplate.slotDefinitions.map(def => def.id);
    const providedSlotIds = contentPlan.slots.map(slot => slot.id);

    // Check if all provided slots are valid for this layout
    const invalidSlots = providedSlotIds.filter(id => !requiredSlotIds.includes(id));
    if (invalidSlots.length > 0) {
      throw new Error(`Content plan does not match layout requirements. Invalid slots: ${invalidSlots.join(', ')}`);
    }
  }

  private validateURL(url: string): void {
    // Block javascript: and data: URLs first
    if (url.startsWith('javascript:') || url.startsWith('data:')) {
      throw new Error('Unsafe URL detected');
    }
    
    try {
      const parsedUrl = new URL(url);

      // Check if domain is in allowed list
      const domain = parsedUrl.hostname.replace('www.', '');
      const isAllowed = this.allowedDomains.some(allowedDomain => 
        domain === allowedDomain || domain.endsWith('.' + allowedDomain)
      );

      if (!isAllowed) {
        console.warn(`Domain ${domain} not in allowed list, but proceeding with caution`);
      }

    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  private sanitizeWidgetCode(code: string): string {
    // Remove potentially dangerous patterns
    let sanitized = code
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/eval\s*\(/gi, 'eval_disabled(')
      .replace(/Function\s*\(/gi, 'Function_disabled(');

    return sanitized;
  }

  private validateWidgetSecurity(code: string): void {
    // Check for unauthorized imports
    const importRegex = /import\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g;
    const imports = [];
    let match;

    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1]);
    }

    const unauthorizedImports = imports.filter(imp => 
      !imp.startsWith('@chakra-ui/') && 
      !imp.startsWith('react') &&
      !imp.startsWith('framer-motion')
    );

    if (unauthorizedImports.length > 0) {
      // Don't throw error, just generate a fallback widget with error message
      const errorMessage = `Widget contains unauthorized imports: ${unauthorizedImports.join(', ')}`;
      throw new Error(errorMessage);
    }

    // Check for unauthorized components
    const componentRegex = /<(\w+)/g;
    const components = [];
    
    while ((match = componentRegex.exec(code)) !== null) {
      components.push(match[1]);
    }

    const unauthorizedComponents = components.filter(comp => 
      !this.allowedChakraComponents.includes(comp) &&
      !['div', 'span', 'p', 'img', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(comp.toLowerCase())
    );

    if (unauthorizedComponents.length > 0) {
      console.warn(`Widget contains potentially unauthorized components: ${unauthorizedComponents.join(', ')}`);
    }
  }

  private generateErrorWidget(widgetId: string, errorMessage: string): string {
    return `
import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react';

export default function ErrorWidget() {
  return (
    <Box p={4}>
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Text fontSize="sm">Error generating widget: ${errorMessage}</Text>
      </Alert>
    </Box>
  );
}`;
  }
}

// Export singleton instance
export const aiPipeline = new AIPipeline();
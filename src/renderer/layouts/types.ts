export interface LayoutSlot {
  id: string;
  type: 'iframe' | 'widget' | 'text' | 'media' | 'custom';
  props: Record<string, any>;
  component?: string; // Generated widget code
  error?: string; // Error message if generation failed
}

export interface LayoutTemplate {
  name: string;
  description: string;
  component: React.FC<{ slots: LayoutSlot[] }>;
  slotDefinitions: Array<{
    id: string;
    type: string;
    purpose: string;
  }>;
}

export interface DynamicContent {
  id: string;
  type: 'dynamic';
  layout: string;
  slots: LayoutSlot[];
  timestamp: number;
}
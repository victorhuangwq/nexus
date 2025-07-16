import { contextBridge, ipcRenderer } from 'electron';

// Define the bridge interface for type safety
export interface ElectronBridge {
  // Test the IPC connection
  test: () => Promise<{ message: string; timestamp: number }>;
  
  // Environment variable access
  getEnv: (key: string) => Promise<string | null>;
  
  // Claude API integration (Phase 4)
  callClaude: (type: 'schema' | 'component', payload: any) => Promise<{
    success: boolean;
    data: any;
    type: string;
    payload: any;
  }>;
  
  // AI Pipeline methods
  selectLayout: (intent: string) => Promise<{
    layout: string;
    confidence: number;
    reasoning?: string;
  }>;
  
  planContent: (intent: string, layoutTemplate: any) => Promise<{
    slots: Array<{
      id: string;
      type: string;
      props: Record<string, any>;
    }>;
  }>;
  
  // Future methods for Phase 2+
  saveSchema?: (intent: string, schema: any) => Promise<void>;
  logMetric?: (name: string, data: any) => Promise<void>;
}

// Expose the bridge to the renderer process
const bridge: ElectronBridge = {
  test: () => ipcRenderer.invoke('bridge-test'),
  getEnv: (key: string) => ipcRenderer.invoke('get-env', key),
  callClaude: (type: 'schema' | 'component', payload: any) => 
    ipcRenderer.invoke('call-claude', type, payload),
  selectLayout: (intent: string) => 
    ipcRenderer.invoke('select-layout', intent),
  planContent: (intent: string, layoutTemplate: any) => 
    ipcRenderer.invoke('plan-content', intent, layoutTemplate),
};

// Expose the bridge via contextBridge
contextBridge.exposeInMainWorld('bridge', bridge);

// Type declaration for the global window object
declare global {
  interface Window {
    bridge: ElectronBridge;
  }
}
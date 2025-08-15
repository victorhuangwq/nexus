import { contextBridge, ipcRenderer } from 'electron';

// Define the bridge interface for type safety
export interface ElectronBridge {
  // Test the IPC connection
  test: () => Promise<{ message: string; timestamp: number }>;
  
  // Environment variable access
  getEnv: (key: string) => Promise<string | null>;
  
  // Claude API integration
  callClaude: (type: 'schema' | 'component' | 'workspace_generation', payload: any) => Promise<{
    success: boolean;
    data: any;
    type: string;
    payload: any;
  }>;
  
  // Future methods for Phase 2+
  saveSchema?: (intent: string, schema: any) => Promise<void>;
  logMetric?: (name: string, data: any) => Promise<void>;
}

// Expose the bridge to the renderer process
const bridge: ElectronBridge = {
  test: () => ipcRenderer.invoke('bridge-test'),
  getEnv: (key: string) => ipcRenderer.invoke('get-env', key),
  callClaude: (type: 'schema' | 'component' | 'workspace_generation', payload: any) => 
    ipcRenderer.invoke('call-claude', type, payload),
};

// Expose the bridge via contextBridge
contextBridge.exposeInMainWorld('bridge', bridge);

// Type declaration for the global window object
declare global {
  interface Window {
    bridge: ElectronBridge;
  }
}
import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Polyfill TextEncoder and TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require('text-encoding');

// Polyfill crypto.subtle for hashing
const crypto = {
  subtle: {
    async digest(algorithm: string, data: Uint8Array): Promise<ArrayBuffer> {
      // Simple hash implementation for testing
      const str = Array.from(data).map(x => x.toString(16).padStart(2, '0')).join('');
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      // Convert hash to hex string and pad to 64 characters (SHA-256 length)
      const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
      const fullHash = hashHex.repeat(8); // 64 characters
      
      // Convert hex string to ArrayBuffer
      const buffer = new ArrayBuffer(32);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < 32; i++) {
        view[i] = parseInt(fullHash.substr(i * 2, 2), 16);
      }
      return buffer;
    }
  }
};

// Setup global polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.crypto = crypto as any;

// Mock performance.now for timing tests
global.performance = {
  ...global.performance,
  now: () => Date.now()
};

// Mock window.bridge for tests
Object.defineProperty(window, 'bridge', {
  value: {
    test: jest.fn().mockResolvedValue({ message: 'Test message', timestamp: Date.now() }),
    getEnv: jest.fn().mockResolvedValue('test'),
    callClaude: jest.fn().mockResolvedValue({ success: true, data: null, type: 'test', payload: {} }),
  },
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
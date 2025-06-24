import '@testing-library/jest-dom';

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
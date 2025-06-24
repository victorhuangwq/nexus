/**
 * Tests for the Electron IPC bridge functionality
 * These tests verify the main process IPC handlers work correctly
 */

// Mock electron module
const mockIpcMain = {
  handle: jest.fn(),
};

const mockApp = {
  whenReady: jest.fn(() => Promise.resolve()),
  on: jest.fn(),
  quit: jest.fn(),
};

const mockBrowserWindow = jest.fn().mockImplementation(() => ({
  loadFile: jest.fn(),
  on: jest.fn(),
  webContents: {
    openDevTools: jest.fn(),
  },
}));

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock electron-reload
jest.mock('electron-reload', () => jest.fn());

jest.mock('electron', () => ({
  app: mockApp,
  BrowserWindow: mockBrowserWindow,
  ipcMain: mockIpcMain,
}));

describe('Electron Main Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock process.argv for development mode
    process.argv = ['node', 'main.js'];
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('should register IPC handlers', async () => {
    // Import main after mocking
    require('../src/main');

    // Verify that IPC handlers are registered
    expect(mockIpcMain.handle).toHaveBeenCalledWith('bridge-test', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('get-env', expect.any(Function));
    expect(mockIpcMain.handle).toHaveBeenCalledWith('call-claude', expect.any(Function));
  });

  test('bridge-test handler should return expected response', async () => {
    require('../src/main');

    // Get the handler function
    const bridgeTestHandler = mockIpcMain.handle.mock.calls
      .find(call => call[0] === 'bridge-test')[1];

    const result = await bridgeTestHandler();
    
    expect(result).toHaveProperty('message', 'Hello from main process!');
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.timestamp).toBe('number');
  });

  test('get-env handler should return environment variables', async () => {
    process.env.TEST_VAR = 'test-value';
    require('../src/main');

    const getEnvHandler = mockIpcMain.handle.mock.calls
      .find(call => call[0] === 'get-env')[1];

    const result = await getEnvHandler(null, 'TEST_VAR');
    expect(result).toBe('test-value');

    const nullResult = await getEnvHandler(null, 'NON_EXISTENT_VAR');
    expect(nullResult).toBeNull();
  });

  test('call-claude handler should return placeholder response', async () => {
    require('../src/main');

    const callClaudeHandler = mockIpcMain.handle.mock.calls
      .find(call => call[0] === 'call-claude')[1];

    const testPayload = { intent: 'test intent' };
    const result = await callClaudeHandler(null, 'schema', testPayload);

    expect(result).toEqual({
      success: true,
      data: null,
      type: 'schema', 
      payload: testPayload
    });
  });
});
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Enable live reload for development
if (process.argv.includes('--dev')) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit',
    forceHardReset: true
  });
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true, // Enable webview tag
    },
  });

  // Load the renderer (development vs production)
  if (process.argv.includes('--dev')) {
    // Development: load from Vite dev server
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // Production: load from built files
    const rendererPath = path.join(__dirname, 'renderer', 'index.html');
    mainWindow.loadFile(rendererPath);
  }

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window events
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle close attempt (before window actually closes)
  mainWindow.on('close', (event) => {
    // Optional: Add confirmation dialog for unsaved work
    // For now, allow normal close behavior
    // event.preventDefault(); // Uncomment to prevent closing
  });
};

// App event handlers
app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  // Always quit the app when all windows are closed in development
  // to prevent orphaned processes
  if (process.argv.includes('--dev') || process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app activation (macOS)
app.on('activate', () => {
  // Re-create window if none exist (common on macOS)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Ensure app quits completely
app.on('before-quit', () => {
  // Clean up any resources before quitting
  if (mainWindow) {
    mainWindow.removeAllListeners('close');
  }
});

// IPC handlers for the bridge
ipcMain.handle('bridge-test', async () => {
  return { message: 'Hello from main process!', timestamp: Date.now() };
});

ipcMain.handle('get-env', async (_, key: string) => {
  return process.env[key] || null;
});

// Claude API integration using built-in fetch
async function callClaudeAPI(prompt: string): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY or CLAUDE_API_KEY not found in environment variables');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
}

// Enhanced Claude component generation
ipcMain.handle('call-claude', async (_, type: string, payload: any) => {
  console.log(`Claude call: ${type}`, payload);
  
  // Handle workspace generation (new gemini-os inspired approach)
  if (type === 'workspace_generation') {
    try {
      const response = await callClaudeAPI(payload.prompt);
      return { success: true, data: response, type, payload };
    } catch (error) {
      console.error('Workspace generation failed:', error);
      // Return a basic fallback workspace HTML
      return {
        success: false,
        data: `
          <div class="workspace-container">
            <div class="workspace-header">
              <h2 class="workspace-title">Workspace</h2>
            </div>
            <div class="workspace-content">
              <div class="glass-panel">
                <p>Unable to generate workspace. Please try again.</p>
                <button class="action-button" data-interaction-id="retry">Retry</button>
              </div>
            </div>
          </div>
        `,
        type,
        payload
      };
    }
  }
  
  if (type === 'component') {
    const purpose = payload.slot?.props?.purpose || 'general widget';
    const slotType = payload.slot?.type || 'widget';
    const widgetPrompt = `
Generate an HTML widget for: ${purpose}
Intent context: "${payload.intent}"
Widget type: ${slotType}

Return ONLY valid HTML/CSS/JavaScript code. Do NOT include React/JSX.
Use inline styles or <style> tags for CSS.
Make it interactive and visually appealing with glassmorphism design.
Include data-interaction-id attributes for clickable elements.

Example structure:
<div style="padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px;">
  <h3>Widget Title</h3>
  <button data-interaction-id="action1" style="...">Click Me</button>
</div>
`;

    try {
      const response = await callClaudeAPI(widgetPrompt);
      return { success: true, data: response, type, payload };
    } catch (error) {
      console.error('Widget generation failed:', error);
      return { 
        success: false, 
        data: `
import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react';

export default function ErrorWidget() {
  return (
    <Box p={4}>
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Text fontSize="sm">Widget generation failed</Text>
      </Alert>
    </Box>
  );
}`, 
        type, 
        payload 
      };
    }
  }

  // Legacy schema generation for fallback
  return { success: true, data: null, type, payload };
});
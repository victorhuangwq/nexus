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

// Layout selection IPC handler
ipcMain.handle('select-layout', async (_, intent: string) => {
  const layoutPrompt = `
Intent: "${intent}"
Available layouts: SingleWebsite: Full-screen iframe for single website, SplitView: Two side-by-side panels, Dashboard: Grid of 2-6 widgets/cards, ListDetail: Left sidebar list, right detail view, MediaFocus: Large media area with controls, ComparisonView: Side-by-side comparison table/cards, FeedLayout: Vertical scrolling feed of content

Analyze the intent and select the best layout. Consider:
- Single website access → SingleWebsite
- Comparison/research → SplitView or ComparisonView  
- Multiple tools/data → Dashboard
- Media consumption → MediaFocus
- Sequential content → FeedLayout

Return only valid JSON: {"layout": "LayoutName", "confidence": 0.95}
`;

  try {
    const response = await callClaudeAPI(layoutPrompt);
    // Extract JSON from response (Claude sometimes adds explanation text)
    const jsonMatch = response.match(/\{[^}]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the response
    if (!parsed.layout || typeof parsed.confidence !== 'number') {
      throw new Error('Invalid response format');
    }
    
    return {
      layout: parsed.layout,
      confidence: parsed.confidence,
      reasoning: 'AI-selected layout'
    };
  } catch (error) {
    console.error('Layout selection failed:', error);
    
    // Simple intent-based fallback
    const lowerIntent = intent.toLowerCase();
    let fallbackLayout = 'Dashboard';
    
    if (lowerIntent.includes('email') || lowerIntent.includes('gmail') || lowerIntent.includes('website')) {
      fallbackLayout = 'SingleWebsite';
    } else if (lowerIntent.includes('compare') || lowerIntent.includes('vs')) {
      fallbackLayout = 'SplitView';
    } else if (lowerIntent.includes('video') || lowerIntent.includes('music') || lowerIntent.includes('media')) {
      fallbackLayout = 'MediaFocus';
    }
    
    return {
      layout: fallbackLayout,
      confidence: 0.6,
      reasoning: 'Fallback layout selection based on keywords'
    };
  }
});

// Content planning IPC handler
ipcMain.handle('plan-content', async (_, intent: string, layoutTemplate: any) => {
  // Create a serializable copy of the layout template
  const serializableTemplate = {
    name: layoutTemplate.name,
    description: layoutTemplate.description,
    slotDefinitions: layoutTemplate.slotDefinitions
  };
  const contentPrompt = `
Intent: "${intent}"
Layout: ${serializableTemplate.name}
Available slots: ${JSON.stringify(serializableTemplate.slotDefinitions)}

Plan content for each slot. Prioritize real websites when possible:
- Prefer iframe embeds over custom HTML
- Use established sites (YouTube, GitHub, Wikipedia, Gmail, etc.)
- Only generate custom widgets when necessary

Return only valid JSON:
{
  "slots": [
    {
      "id": "main",
      "type": "iframe", 
      "props": {
        "url": "https://www.example.com",
        "title": "Description"
      }
    }
  ]
}
`;

  try {
    const response = await callClaudeAPI(contentPrompt);
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error('Content planning failed:', error);
    
    // Generate fallback content based on intent and layout
    const lowerIntent = intent.toLowerCase();
    const fallbackSlots = [];
    
    // Simple content generation based on layout and intent
    for (const slotDef of layoutTemplate.slotDefinitions) {
      if (slotDef.type.includes('iframe')) {
        let url = 'https://example.com';
        let title = 'Content';
        
        if (lowerIntent.includes('gmail') || lowerIntent.includes('email')) {
          url = 'https://gmail.com';
          title = 'Gmail';
        } else if (lowerIntent.includes('youtube') || lowerIntent.includes('video')) {
          url = 'https://youtube.com';
          title = 'YouTube';
        } else if (lowerIntent.includes('github') || lowerIntent.includes('code')) {
          url = 'https://github.com';
          title = 'GitHub';
        } else if (lowerIntent.includes('weather')) {
          url = 'https://weather.com';
          title = 'Weather';
        }
        
        fallbackSlots.push({
          id: slotDef.id,
          type: 'iframe',
          props: { url, title }
        });
      } else {
        fallbackSlots.push({
          id: slotDef.id,
          type: 'widget',
          props: { 
            content: `Content for ${slotDef.purpose}`,
            purpose: slotDef.purpose 
          }
        });
      }
    }
    
    return { slots: fallbackSlots };
  }
});

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
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Enable live reload for development
if (process.argv.includes('--dev')) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for the bridge
ipcMain.handle('bridge-test', async () => {
  return { message: 'Hello from main process!', timestamp: Date.now() };
});

ipcMain.handle('get-env', async (_, key: string) => {
  return process.env[key] || null;
});

// Placeholder for Claude API calls
ipcMain.handle('call-claude', async (_, type: string, payload: any) => {
  console.log(`Claude call: ${type}`, payload);
  // TODO: Implement actual Claude API integration in Phase 4
  return { success: true, data: null, type, payload };
});
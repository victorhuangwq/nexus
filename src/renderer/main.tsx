import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Ensure the bridge is available before rendering
const waitForBridge = async () => {
  return new Promise<void>((resolve) => {
    if (window.bridge) {
      resolve();
      return;
    }
    
    const checkBridge = () => {
      if (window.bridge) {
        resolve();
      } else {
        setTimeout(checkBridge, 50);
      }
    };
    
    checkBridge();
  });
};

const renderApp = async () => {
  await waitForBridge();
  
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

renderApp().catch(console.error);
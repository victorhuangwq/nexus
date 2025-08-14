import React, { useEffect, useRef } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface WebViewFrameProps {
  url: string;
  title?: string;
  width?: string;
  height?: string;
  allowPopups?: boolean;
  userAgent?: string;
}

export const WebViewFrame: React.FC<WebViewFrameProps> = ({
  url,
  title,
  width = '100%',
  height = '100%',
  allowPopups = false,
  userAgent,
}) => {
  const webviewRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create webview element
    const webview = document.createElement('webview') as any;
    webview.src = url;
    webview.style.width = width;
    webview.style.height = height;
    
    // Set attributes
    if (title) webview.title = title;
    if (userAgent) webview.useragent = userAgent;
    
    // Security settings
    webview.setAttribute('partition', 'persist:webview'); // Isolated storage
    webview.setAttribute('webpreferences', 'contextIsolation=yes');
    
    if (allowPopups) {
      webview.setAttribute('allowpopups', 'true');
    }

    // Event handlers
    webview.addEventListener('dom-ready', () => {
      console.log(`WebView loaded: ${url}`);
      
      // Optional: Inject CSS to hide ads or modify appearance
      // webview.insertCSS(`
      //   .ads { display: none !important; }
      // `);
      
      // Optional: Override user agent to bypass mobile detection
      if (!userAgent) {
        webview.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      }
    });

    webview.addEventListener('did-fail-load', (event: any) => {
      console.error('WebView failed to load:', event);
    });

    webview.addEventListener('new-window', (event: any) => {
      // Handle new window requests (popups)
      if (!allowPopups) {
        event.preventDefault();
        // Optionally load in same webview
        webview.src = event.url;
      }
    });

    // Add to container
    containerRef.current.appendChild(webview);
    webviewRef.current = webview;

    // Cleanup
    return () => {
      if (webviewRef.current && containerRef.current) {
        containerRef.current.removeChild(webviewRef.current);
      }
    };
  }, [url, title, width, height, allowPopups, userAgent]);

  return (
    <Box
      ref={containerRef}
      width={width}
      height={height}
      position="relative"
      bg="gray.900"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Loading indicator (will be covered by webview) */}
      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        spacing={4}
      >
        <Spinner size="xl" color="blue.400" />
        <Text color="gray.400" fontSize="sm">Loading {title || url}...</Text>
      </VStack>
    </Box>
  );
};
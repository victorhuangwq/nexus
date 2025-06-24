import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';

import { GraphingCalculator } from '../src/renderer/components/static/GraphingCalculator';
import { TokyoTrip } from '../src/renderer/components/static/TokyoTrip';
import { BTCChart } from '../src/renderer/components/static/BTCChart';
import { WeatherWidget } from '../src/renderer/components/static/WeatherWidget';
import { PhysicsHomework } from '../src/renderer/components/static/PhysicsHomework';
import { matchIntent } from '../src/renderer/utils/intentMatcher';
import theme from '../src/renderer/theme';

// Mock window.bridge for tests
const mockBridge = {
  test: jest.fn().mockResolvedValue({ message: 'test', timestamp: Date.now() }),
  getEnv: jest.fn().mockResolvedValue('test-env'),
  callClaude: jest.fn().mockResolvedValue({ success: true, data: {}, type: 'test', payload: {} })
};

// @ts-ignore
global.window.bridge = mockBridge;

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

describe('Intent Matching System', () => {
  test('should match physics homework intent correctly', () => {
    const result = matchIntent('tools for my physics homework');
    expect(result?.component).toBe('PhysicsHomework');
    expect(result?.confidence).toBeGreaterThanOrEqual(50);
  });

  test('should match Tokyo trip intent correctly', () => {
    const result = matchIntent('plan a trip to tokyo');
    expect(result?.component).toBe('TokyoTrip');
    expect(result?.confidence).toBeGreaterThanOrEqual(50);
  });

  test('should match weather intent correctly', () => {
    const result = matchIntent('what is the weather like');
    expect(result?.component).toBe('WeatherWidget');
    expect(result?.confidence).toBeGreaterThanOrEqual(50);
  });

  test('should match bitcoin intent correctly', () => {
    const result = matchIntent('bitcoin chart');
    expect(result?.component).toBe('BTCChart');
    expect(result?.confidence).toBeGreaterThanOrEqual(50);
  });

  test('should match calculator intent correctly', () => {
    const result = matchIntent('graphing calculator');
    expect(result?.component).toBe('GraphingCalculator');
    expect(result?.confidence).toBeGreaterThanOrEqual(50);
  });

  test('should return null for unrecognized intent', () => {
    const result = matchIntent('random unrecognized text');
    expect(result).toBeNull();
  });
});

describe('GraphingCalculator Component', () => {
  test('renders calculator component with proper structure', () => {
    render(<GraphingCalculator />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Graph functions and solve equations')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    
    // Check for tips section
    expect(screen.getByText('Tips')).toBeInTheDocument();
    expect(screen.getByText('📊 Use parentheses for complex expressions')).toBeInTheDocument();
  });

  test('displays Desmos iframe', () => {
    render(<GraphingCalculator />, { wrapper: TestWrapper });
    
    const iframe = screen.getByTitle('Desmos Graphing Calculator');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.desmos.com/calculator');
  });
});

describe('TokyoTrip Component', () => {
  test('renders trip planner with all sections', () => {
    render(<TokyoTrip />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Tokyo Trip')).toBeInTheDocument();
    expect(screen.getByText('3-day itinerary with must-see spots')).toBeInTheDocument();
    expect(screen.getByText('3 days')).toBeInTheDocument();
    
    // Check for day sections
    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
  });

  test('displays embedded widgets', () => {
    render(<TokyoTrip />, { wrapper: TestWrapper });
    
    // Check for map
    expect(screen.getByTitle('Tokyo Google Map')).toBeInTheDocument();
    
    // Check for weather
    expect(screen.getByTitle('Tokyo Live Weather')).toBeInTheDocument();
    
    // Check for JR Pass calculator
    expect(screen.getByTitle('JR Pass Cost Calculator')).toBeInTheDocument();
    
    // Check for currency converter
    expect(screen.getByTitle('USD to JPY Currency Converter')).toBeInTheDocument();
  });

  test('shows itinerary activities with proper structure', () => {
    render(<TokyoTrip />, { wrapper: TestWrapper });
    
    // Check for specific activities
    expect(screen.getByText('Arrival at Haneda Airport')).toBeInTheDocument();
    expect(screen.getByText('Visit Senso-ji Temple')).toBeInTheDocument();
    expect(screen.getByText('Meiji Shrine')).toBeInTheDocument();
    
    // Check for activity types
    expect(screen.getByText('9:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Shibuya')).toBeInTheDocument();
  });
});

describe('BTCChart Component', () => {
  test('renders Bitcoin chart with price data', async () => {
    render(<BTCChart />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Bitcoin Price Chart')).toBeInTheDocument();
    expect(screen.getByText('Live cryptocurrency market data')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/\$/)).toBeInTheDocument(); // Price should be displayed
    });
  });

  test('displays timeframe selector', () => {
    render(<BTCChart />, { wrapper: TestWrapper });
    
    const select = screen.getByDisplayValue('7D');
    expect(select).toBeInTheDocument();
    
    // Check all timeframe options
    expect(screen.getByText('1D')).toBeInTheDocument();
    expect(screen.getByText('7D')).toBeInTheDocument();
    expect(screen.getByText('30D')).toBeInTheDocument();
    expect(screen.getByText('90D')).toBeInTheDocument();
  });

  test('updates timeframe when selected', async () => {
    render(<BTCChart />, { wrapper: TestWrapper });
    
    const select = screen.getByDisplayValue('7D');
    fireEvent.change(select, { target: { value: '30D' } });
    
    await waitFor(() => {
      expect(select).toHaveValue('30D');
    });
  });

  test('shows price change indicator', async () => {
    render(<BTCChart />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      // Price change percentage should be visible
      expect(screen.getByText(/%/)).toBeInTheDocument();
    });
  });
});

describe('WeatherWidget Component', () => {
  test('renders weather widget with default city', () => {
    render(<WeatherWidget />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.getByText('Live weather data for any city')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tokyo')).toBeInTheDocument();
  });

  test('displays city input and unit selector', () => {
    render(<WeatherWidget />, { wrapper: TestWrapper });
    
    const cityInput = screen.getByPlaceholderText('Enter city name');
    expect(cityInput).toBeInTheDocument();
    
    const unitSelect = screen.getByDisplayValue('Celsius');
    expect(unitSelect).toBeInTheDocument();
  });

  test('shows popular city buttons', () => {
    render(<WeatherWidget />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Popular Cities')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tokyo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New York' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'London' })).toBeInTheDocument();
  });

  test('updates city when popular city button is clicked', () => {
    render(<WeatherWidget />, { wrapper: TestWrapper });
    
    const newYorkButton = screen.getByRole('button', { name: 'New York' });
    fireEvent.click(newYorkButton);
    
    const cityInput = screen.getByDisplayValue('New York');
    expect(cityInput).toBeInTheDocument();
  });

  test('displays weather iframe', () => {
    render(<WeatherWidget />, { wrapper: TestWrapper });
    
    const iframe = screen.getByTitle('Tokyo Weather Forecast');
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('src')).toContain('wttr.in/Tokyo');
  });
});

describe('PhysicsHomework Component', () => {
  test('renders physics toolkit with correct tool count', () => {
    render(<PhysicsHomework />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Physics Homework Toolkit')).toBeInTheDocument();
    expect(screen.getByText('Everything you need for high school physics')).toBeInTheDocument();
    expect(screen.getByText('3 Tools')).toBeInTheDocument();
  });

  test('displays all three physics tools', () => {
    render(<PhysicsHomework />, { wrapper: TestWrapper });
    
    expect(screen.getByRole('button', { name: /Graphing Calculator/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unit Converter/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Wolfram Alpha/ })).toBeInTheDocument();
  });

  test('shows formula reference categories', () => {
    render(<PhysicsHomework />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Quick Formulas')).toBeInTheDocument();
    expect(screen.getByText('Kinematics')).toBeInTheDocument();
    expect(screen.getByText('Forces')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Waves')).toBeInTheDocument();
    expect(screen.getByText('Electricity')).toBeInTheDocument();
  });

  test('displays specific formulas', () => {
    render(<PhysicsHomework />, { wrapper: TestWrapper });
    
    expect(screen.getByText('v = u + at')).toBeInTheDocument();
    expect(screen.getByText('F = ma')).toBeInTheDocument();
    expect(screen.getByText('KE = ½mv²')).toBeInTheDocument();
    expect(screen.getByText('v = fλ')).toBeInTheDocument();
    expect(screen.getByText('V = IR')).toBeInTheDocument();
  });

  test('switches between tools when clicked', () => {
    render(<PhysicsHomework />, { wrapper: TestWrapper });
    
    const unitConverterButton = screen.getByRole('button', { name: /Unit Converter/ });
    fireEvent.click(unitConverterButton);
    
    // Should show unit converter iframe
    const iframe = screen.getByTitle('Unit Converter');
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('src')).toContain('rapidtables.com');
  });

  test('shows usage instructions', () => {
    render(<PhysicsHomework />, { wrapper: TestWrapper });
    
    expect(screen.getByText('How to Use These Tools')).toBeInTheDocument();
    expect(screen.getByText('🧮 Calculator')).toBeInTheDocument();
    expect(screen.getByText('📏 Unit Converter')).toBeInTheDocument();
    expect(screen.getByText('🤖 Wolfram Alpha')).toBeInTheDocument();
  });
});

describe('Component Integration', () => {
  test('all components render without errors', () => {
    const components = [
      GraphingCalculator,
      TokyoTrip,
      BTCChart,
      WeatherWidget,
      PhysicsHomework
    ];

    components.forEach((Component) => {
      expect(() => {
        render(<Component />, { wrapper: TestWrapper });
      }).not.toThrow();
    });
  });

  test('all components have proper accessibility attributes', () => {
    render(<GraphingCalculator />, { wrapper: TestWrapper });
    const iframe = screen.getByTitle('Desmos Graphing Calculator');
    expect(iframe).toHaveAttribute('title');
    expect(iframe).toHaveAttribute('src');
  });
});

describe('Responsive Design', () => {
  test('components render without layout errors', () => {
    // Test basic rendering without breaking
    render(<TokyoTrip />, { wrapper: TestWrapper });
    expect(screen.getByText('Friday')).toBeInTheDocument();
    
    render(<WeatherWidget />, { wrapper: TestWrapper });
    expect(screen.getByText('Weather')).toBeInTheDocument();
  });
});

describe('Performance', () => {
  test('components render within acceptable time', async () => {
    const startTime = performance.now();
    
    render(<PhysicsHomework />, { wrapper: TestWrapper });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });
});
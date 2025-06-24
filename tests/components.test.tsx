/**
 * Tests for React components
 * Testing OmniPrompt and basic component rendering
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { OmniPrompt } from '../src/renderer/components/OmniPrompt';
import theme from '../src/renderer/theme';

// Mock framer-motion to avoid issues in test environment
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Chakra UI icons
jest.mock('@chakra-ui/icons', () => ({
  ArrowForwardIcon: () => <div data-testid="arrow-icon">→</div>,
}));

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider theme={theme}>
      {component}
    </ChakraProvider>
  );
};

describe('OmniPrompt Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders with default placeholder', () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('What would you like to create?');
    expect(input).toBeInTheDocument();
  });

  test('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom placeholder text';
    renderWithChakra(
      <OmniPrompt onSubmit={mockOnSubmit} placeholder={customPlaceholder} />
    );
    
    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });

  test('calls onSubmit when Enter key is pressed', async () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('What would you like to create?');
    
    fireEvent.change(input, { target: { value: 'test intent' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test intent');
    });
  });

  test('calls onSubmit when submit button is clicked', async () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('What would you like to create?');
    const submitButton = screen.getByLabelText('Submit intent');
    
    fireEvent.change(input, { target: { value: 'test intent' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test intent');
    });
  });

  test('does not submit empty input', async () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('What would you like to create?');
    
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  test('trims whitespace from input', async () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('What would you like to create?');
    
    fireEvent.change(input, { target: { value: '  test intent  ' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test intent');
    });
  });

  test('clears input after submission', async () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('What would you like to create?') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'test intent' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('disables input and button when loading', () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('What would you like to create?');
    const submitButton = screen.getByLabelText('Submit intent');
    
    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  test('shows help text', () => {
    renderWithChakra(<OmniPrompt onSubmit={mockOnSubmit} />);
    
    const helpText = screen.getByText('Describe what you want to create and I\'ll build it instantly');
    expect(helpText).toBeInTheDocument();
  });
});

describe('Theme Configuration', () => {
  test('theme has required brand colors', () => {
    expect(theme.colors.brand[500]).toBe('#00E5FF');
    expect(theme.colors.neon.blue).toBe('#00E5FF');
  });

  test('theme uses Inter font', () => {
    expect(theme.fonts.heading).toContain('Inter');
    expect(theme.fonts.body).toContain('Inter');
  });

  test('theme has glassmorphism button variant', () => {
    expect(theme.components.Button.variants.glassmorphism).toBeDefined();
    expect(theme.components.Button.variants.neon).toBeDefined();
  });
});
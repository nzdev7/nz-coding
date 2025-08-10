'use client';

import { ThemeProvider } from './useTheme.js';
import useTouchHandler from './useTouch.js';

export function AppProviders({ children }) {
  // Initialize touch effect hook
  useTouchHandler();

  // Wrap children with theme provider
  return <ThemeProvider>{children}</ThemeProvider>;
}

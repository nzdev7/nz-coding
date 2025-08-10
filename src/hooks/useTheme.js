'use client';
// src/app/hooks/useTheme.jsx
import { createContext, useContext, useEffect, useState } from 'react';

// Create context with default values
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
});

// Theme Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isDark, setIsDark] = useState(false);

  // Handle theme change
  const handleTheme = (newTheme) => {
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      // Check system preference
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isSystemDark);
      setTheme('system');
      setIsDark(isSystemDark);
    } else {
      localStorage.theme = newTheme;
      const willBeDark = newTheme === 'dark';
      document.documentElement.classList.toggle('dark', willBeDark);
      setTheme(newTheme);
      setIsDark(willBeDark);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    handleTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Initialize theme on component mount
  useEffect(() => {
    // On page load, check localStorage or system preference
    const savedTheme = localStorage.theme;
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      const willBeDark = savedTheme === 'dark';
      document.documentElement.classList.toggle('dark', willBeDark);
      setIsDark(willBeDark);
    } else {
      setTheme('system');
      document.documentElement.classList.toggle('dark', isSystemDark);
      setIsDark(isSystemDark);
    }

    // Optional: Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!('theme' in localStorage) || localStorage.theme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
        setTheme('system');
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Theme Toggle Component
export function ThemeToggleButton() {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="bg-primary rounded-full w-12 md:w-13 3xl:w-14.5 p-[3px] 3xl:p-1
       ml-auto mr-1.5 lg:mx-0 lg:order-1"
    >
      <span
        className={`block size-[17px] md:size-5 3xl:size-5.5 relative rounded-full transition-500 ${
          isDark
            ? 'shadow-[inset_5px_-4px_#ffffff] left-[1px] md:shadow-[inset_6px_-4.5px_#ffffff] 3xl:left-[2px] 3xl:shadow-[inset_6.5px_-5px_#ffffff]'
            : 'shadow-[inset_20px_-20px_#f9d81a] left-[25px] 3xl:left-[27px]'
        }`}
      ></span>
    </button>
  );
}

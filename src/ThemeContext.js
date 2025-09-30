import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('player-tracker-theme');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default to light mode
    return false;
  });

  useEffect(() => {
    localStorage.setItem('player-tracker-theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      primary: isDarkMode ? '#000000' : '#ffffff',
      secondary: isDarkMode ? '#1a1a1a' : '#f8f9fa',
      tertiary: isDarkMode ? '#2a2a2a' : '#e9ecef',
      
      // Text colors
      textPrimary: isDarkMode ? '#ffffff' : '#000000',
      textSecondary: isDarkMode ? '#b3b3b3' : '#6c757d',
      textMuted: isDarkMode ? '#808080' : '#adb5bd',
      
      // Border colors
      border: isDarkMode ? '#404040' : '#dee2e6',
      borderLight: isDarkMode ? '#333333' : '#f1f3f4',
      borderDark: isDarkMode ? '#555555' : '#ced4da',
      
      // Interactive colors
      hover: isDarkMode ? '#333333' : '#f8f9fa',
      active: isDarkMode ? '#404040' : '#e9ecef',
      focus: isDarkMode ? '#4a4a4a' : '#e3f2fd',
      
      // Accent colors (grayscale)
      accent: isDarkMode ? '#ffffff' : '#000000',
      accentLight: isDarkMode ? '#e6e6e6' : '#333333',
      accentDark: isDarkMode ? '#cccccc' : '#666666',
      
      // Button colors
      buttonPrimary: isDarkMode ? '#ffffff' : '#000000',
      buttonSecondary: isDarkMode ? '#333333' : '#f8f9fa',
      buttonDanger: isDarkMode ? '#ff4444' : '#dc3545',
      buttonSuccess: isDarkMode ? '#00cc66' : '#28a745',
      
      // Shadow colors
      shadow: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
      shadowLight: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
      shadowDark: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.15)',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

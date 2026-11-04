'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type FontFamily = 'inter' | 'roboto' | 'plus-jakarta' | 'outfit' | 'system';
export type ThemeColor = 'indigo' | 'violet' | 'blue' | 'emerald' | 'rose' | 'amber';
export type RadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type BorderWidth = 'thin' | 'normal' | 'thick';

export interface ThemeSettings {
  fontFamily: FontFamily;
  themeColor: ThemeColor;
  radius: RadiusSize;
  borderWidth: BorderWidth;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  fontFamily: 'inter',
  themeColor: 'indigo',
  radius: 'lg',
  borderWidth: 'normal',
};

const THEME_STORAGE_KEY = 'taskmanager_theme_customization';

const ThemeCustomizationContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // ignore JSON parse errors
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage quota errors
    }

    // Apply attributes on document root for CSS variables / classes
    const root = document.documentElement;

    root.setAttribute('data-font', settings.fontFamily);
    root.setAttribute('data-color', settings.themeColor);
    root.setAttribute('data-radius', settings.radius);
    root.setAttribute('data-border', settings.borderWidth);
  }, [settings, mounted]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <ThemeCustomizationContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ThemeCustomizationContext.Provider>
  );
};

export const useThemeCustomization = () => {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error('useThemeCustomization must be used within a ThemeCustomizationProvider');
  }
  return context;
};


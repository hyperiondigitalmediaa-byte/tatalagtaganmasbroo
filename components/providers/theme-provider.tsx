"use client";

import { useEffect } from "react";

interface ThemeProviderProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
}

export function ThemeProvider({ theme }: ThemeProviderProps) {
  useEffect(() => {
    // Apply CSS variables to root
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primaryColor);
    root.style.setProperty("--color-secondary", theme.secondaryColor);
    root.style.setProperty("--color-accent", theme.accentColor);
    root.style.setProperty("--color-background", theme.backgroundColor);
    root.style.setProperty("--color-text", theme.textColor);
    root.style.setProperty("--font-family", theme.fontFamily);
  }, [theme]);

  return null;
}

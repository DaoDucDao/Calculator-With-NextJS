"use client";

import { createContext, useContext, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const THEMES = ["dark", "light", "midnight", "sunset"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_META: Record<Theme, { label: string; icon: string }> = {
  dark: { label: "Dark", icon: "🌑" },
  light: { label: "Light", icon: "☀️" },
  midnight: { label: "Midnight", icon: "🌌" },
  sunset: { label: "Sunset", icon: "🌅" },
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "dark", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useLocalStorage<Theme>("calc-theme", "dark");

  const setTheme = useCallback(
    (t: Theme) => setThemeRaw(t),
    [setThemeRaw]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

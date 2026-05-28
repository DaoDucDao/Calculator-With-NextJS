"use client";

import { createContext, useContext, useEffect, useCallback } from "react";
import { Moon, Sun, Sparkles, Sunset, type LucideIcon } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const THEMES = ["dark", "light", "midnight", "sunset"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_META: Record<Theme, { label: string; Icon: LucideIcon }> = {
  dark: { label: "Dark", Icon: Moon },
  light: { label: "Light", Icon: Sun },
  midnight: { label: "Midnight", Icon: Sparkles },
  sunset: { label: "Sunset", Icon: Sunset },
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

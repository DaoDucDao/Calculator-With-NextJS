"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Binary,
  Ruler,
  Banknote,
  CalendarClock,
  ChartColumn,
  History,
  Calculator as CalcIcon,
  type LucideIcon,
} from "lucide-react";
import { useTheme, THEMES, THEME_META } from "@/components/ThemeProvider";

const NAV_ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/", label: "Scientific", Icon: FlaskConical },
  { href: "/programmer", label: "Programmer", Icon: Binary },
  { href: "/converter", label: "Unit Converter", Icon: Ruler },
  { href: "/currency", label: "Currency", Icon: Banknote },
  { href: "/datetime", label: "Date / Time", Icon: CalendarClock },
  { href: "/statistics", label: "Statistics", Icon: ChartColumn },
  { href: "/history", label: "History", Icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-panel border-r border-line-soft flex flex-col z-40">
      <div className="px-5 py-5 border-b border-line-soft">
        <h1 className="text-lg font-bold text-fg flex items-center gap-2">
          <CalcIcon className="w-5 h-5 text-accent-fg" />
          CalcSuite
        </h1>
        <p className="text-[10px] text-fg-muted mt-0.5">Calculator Toolkit</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "text-accent-fg"
                  : "text-fg-3 hover:bg-raised hover:text-fg-2"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-accent/15 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="relative w-4 h-4 flex-shrink-0" />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme picker */}
      <div className="px-3 py-2 border-t border-line-soft">
        <p className="text-[10px] text-fg-muted font-medium uppercase tracking-wider px-1 mb-1.5">
          Theme
        </p>
        <div className="grid grid-cols-2 gap-1">
          {THEMES.map((t) => {
            const { Icon, label } = THEME_META[t];
            const isActive = theme === t;
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`relative px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                  isActive ? "text-white" : "text-fg-3 hover:bg-muted bg-raised"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="theme-active"
                    className="absolute inset-0 bg-accent rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative w-3 h-3" />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 py-3 border-t border-line-soft">
        <div className="bg-raised rounded-xl px-3 py-2.5">
          <p className="text-[10px] text-fg-muted font-medium uppercase tracking-wider">
            Keyboard Shortcuts
          </p>
          <div className="mt-1.5 space-y-1 text-[11px] text-fg-3">
            <div className="flex justify-between">
              <span>Numbers</span>
              <kbd className="bg-muted px-1.5 rounded text-[10px]">0-9</kbd>
            </div>
            <div className="flex justify-between">
              <span>Operators</span>
              <kbd className="bg-muted px-1.5 rounded text-[10px]">+ - * /</kbd>
            </div>
            <div className="flex justify-between">
              <span>Calculate</span>
              <kbd className="bg-muted px-1.5 rounded text-[10px]">Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span>Clear</span>
              <kbd className="bg-muted px-1.5 rounded text-[10px]">Esc</kbd>
            </div>
            <div className="flex justify-between">
              <span>Undo</span>
              <kbd className="bg-muted px-1.5 rounded text-[10px]">Ctrl+Z</kbd>
            </div>
            <div className="flex justify-between">
              <span>Redo</span>
              <kbd className="bg-muted px-1.5 rounded text-[10px]">Ctrl+Y</kbd>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

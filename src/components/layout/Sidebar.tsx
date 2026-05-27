"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, THEMES, THEME_META } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { href: "/", label: "Scientific", icon: "🔬" },
  { href: "/programmer", label: "Programmer", icon: "💻" },
  { href: "/converter", label: "Unit Converter", icon: "📏" },
  { href: "/currency", label: "Currency", icon: "💱" },
  { href: "/datetime", label: "Date / Time", icon: "📅" },
  { href: "/history", label: "History", icon: "📜" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-panel border-r border-line-soft flex flex-col z-40">
      <div className="px-5 py-5 border-b border-line-soft">
        <h1 className="text-lg font-bold text-fg">🧮 CalcSuite</h1>
        <p className="text-[10px] text-fg-muted mt-0.5">Calculator Toolkit</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent/15 text-accent-fg"
                  : "text-fg-3 hover:bg-raised hover:text-fg-2"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
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
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                theme === t
                  ? "bg-accent text-white"
                  : "bg-raised text-fg-3 hover:bg-muted"
              }`}
            >
              {THEME_META[t].icon} {THEME_META[t].label}
            </button>
          ))}
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

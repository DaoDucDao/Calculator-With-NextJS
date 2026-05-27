"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Scientific", icon: "🔬" },
  { href: "/programmer", label: "Programmer", icon: "💻" },
  { href: "/converter", label: "Unit Converter", icon: "📏" },
  { href: "/currency", label: "Currency", icon: "💱" },
  { href: "/history", label: "History", icon: "📜" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col z-40">
      <div className="px-5 py-5 border-b border-zinc-800">
        <h1 className="text-lg font-bold text-white">🧮 CalcSuite</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">Calculator Toolkit</p>
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
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-zinc-800">
        <div className="bg-zinc-800 rounded-xl px-3 py-2.5">
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
            Keyboard Shortcuts
          </p>
          <div className="mt-1.5 space-y-1 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Numbers</span>
              <kbd className="bg-zinc-700 px-1.5 rounded text-[10px]">0-9</kbd>
            </div>
            <div className="flex justify-between">
              <span>Operators</span>
              <kbd className="bg-zinc-700 px-1.5 rounded text-[10px]">+ - * /</kbd>
            </div>
            <div className="flex justify-between">
              <span>Calculate</span>
              <kbd className="bg-zinc-700 px-1.5 rounded text-[10px]">Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span>Clear</span>
              <kbd className="bg-zinc-700 px-1.5 rounded text-[10px]">Esc</kbd>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

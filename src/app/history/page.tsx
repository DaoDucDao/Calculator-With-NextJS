"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ChevronDown,
  Trash2,
  X,
  ScrollText,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { entriesToCSV, entriesToJSON, downloadFile, timestampedFilename } from "@/utils/export";

const TYPE_LABELS = {
  scientific: { label: "Scientific", color: "text-amber-400 bg-amber-400/10" },
  programmer: { label: "Programmer", color: "text-cyan-400 bg-cyan-400/10" },
  converter: { label: "Converter", color: "text-emerald-400 bg-emerald-400/10" },
  datetime: { label: "Date/Time", color: "text-rose-400 bg-rose-400/10" },
  statistics: { label: "Statistics", color: "text-violet-400 bg-violet-400/10" },
};

const FILTERS = [
  { key: "all", label: "All", color: "text-fg" },
  { key: "scientific", label: "Scientific", color: "text-amber-400" },
  { key: "programmer", label: "Programmer", color: "text-cyan-400" },
  { key: "converter", label: "Converter", color: "text-emerald-400" },
  { key: "datetime", label: "Date/Time", color: "text-rose-400" },
  { key: "statistics", label: "Statistics", color: "text-violet-400" },
];

export default function HistoryPage() {
  const { entries, loaded, clearHistory, deleteEntry } = useHistory();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  const exportCSV = () => {
    downloadFile(entriesToCSV(filtered), timestampedFilename(`calc-history-${filter}`, "csv"), "text/csv");
  };

  const exportJSON = () => {
    downloadFile(entriesToJSON(filtered), timestampedFilename(`calc-history-${filter}`, "json"), "application/json");
  };

  const grouped = filtered.reduce(
    (acc, entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, typeof entries>
  );

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-fg-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg-2">History</h1>
          <p className="text-sm text-fg-muted mt-0.5">
            {entries.length} calculation{entries.length !== 1 ? "s" : ""}
          </p>
        </div>
        {entries.length > 0 && (
          <div className="flex items-center gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  disabled={filtered.length === 0}
                  className="px-4 py-2 rounded-xl bg-raised text-fg-3 text-sm hover:bg-muted border border-line transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={4}
                  className="w-48 bg-panel border border-line rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <DropdownMenu.Label className="px-3 py-2 text-[10px] text-fg-faint uppercase tracking-wider border-b border-line-soft">
                    {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
                  </DropdownMenu.Label>
                  <DropdownMenu.Item
                    onSelect={exportCSV}
                    className="px-4 py-2.5 text-sm text-fg-2 hover:bg-raised data-[highlighted]:bg-raised cursor-pointer outline-none flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>CSV</span>
                    </div>
                    <span className="text-[10px] text-fg-faint">spreadsheet</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={exportJSON}
                    className="px-4 py-2.5 text-sm text-fg-2 hover:bg-raised data-[highlighted]:bg-raised cursor-pointer outline-none flex items-center justify-between gap-3 border-t border-line-soft"
                  >
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-amber-400" />
                      <span>JSON</span>
                    </div>
                    <span className="text-[10px] text-fg-faint">full data</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button className="px-4 py-2 rounded-xl bg-raised text-fg-3 text-sm hover:bg-muted border border-line transition-colors flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
                <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-panel border border-line rounded-2xl p-6 shadow-2xl z-50">
                  <AlertDialog.Title className="text-lg font-semibold text-fg">
                    Clear all history?
                  </AlertDialog.Title>
                  <AlertDialog.Description className="text-sm text-fg-3 mt-2">
                    This will permanently delete all {entries.length} saved calculation{entries.length !== 1 ? "s" : ""}. This action can&apos;t be undone.
                  </AlertDialog.Description>
                  <div className="mt-5 flex gap-2 justify-end">
                    <AlertDialog.Cancel asChild>
                      <button className="px-4 py-2 rounded-xl bg-raised text-fg-2 text-sm hover:bg-muted transition-colors">
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-500 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        )}
      </div>

      {/* Filter + stats combined */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          const count =
            f.key === "all"
              ? entries.length
              : entries.filter((e) => e.type === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative px-3 py-2.5 rounded-xl text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive ? "bg-panel" : "bg-panel/60 hover:bg-panel"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="history-filter-active"
                  className="absolute inset-0 ring-2 ring-accent rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative block text-xl font-bold ${f.color}`}>
                {count}
              </span>
              <span className="relative block text-[10px] text-fg-muted mt-0.5">
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* History entries */}
      {filtered.length === 0 ? (
        <div className="bg-panel rounded-2xl p-12 text-center">
          <ScrollText className="w-12 h-12 text-fg-muted mx-auto mb-3" />
          <p className="text-fg-3">No history yet</p>
          <p className="text-fg-faint text-sm mt-1">
            Your calculations will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs text-fg-faint font-medium uppercase tracking-wider mb-2 px-1">
                {date}
              </h3>
              <div className="bg-panel rounded-2xl overflow-hidden">
                <AnimatePresence initial={false}>
                  {items.map((entry, i) => {
                    const typeInfo =
                      TYPE_LABELS[entry.type as keyof typeof TYPE_LABELS] ??
                      TYPE_LABELS.scientific;
                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center justify-between px-5 py-3.5 hover:bg-raised/30 transition-colors ${
                          i < items.length - 1 ? "border-b border-line-soft/50" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}
                            >
                              {typeInfo.label}
                            </span>
                            <span className="text-[10px] text-fg-faint">
                              {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-fg-3 font-mono truncate">
                            {entry.expression}
                          </p>
                          <p className="text-lg text-fg font-mono">
                            = {entry.result}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="ml-3 text-fg-faint hover:text-red-400 transition-colors p-1"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

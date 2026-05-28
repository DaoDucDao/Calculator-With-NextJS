"use client";

import { useState } from "react";
import { useHistory } from "@/hooks/useHistory";
import { entriesToCSV, entriesToJSON, downloadFile, timestampedFilename } from "@/utils/export";

const TYPE_LABELS = {
  scientific: { label: "Scientific", color: "text-amber-400 bg-amber-400/10" },
  programmer: { label: "Programmer", color: "text-cyan-400 bg-cyan-400/10" },
  converter: { label: "Converter", color: "text-emerald-400 bg-emerald-400/10" },
  datetime: { label: "Date/Time", color: "text-rose-400 bg-rose-400/10" },
  statistics: { label: "Statistics", color: "text-violet-400 bg-violet-400/10" },
};

export default function HistoryPage() {
  const { entries, loaded, clearHistory, deleteEntry } = useHistory();
  const [filter, setFilter] = useState<string>("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  const exportCSV = () => {
    downloadFile(entriesToCSV(filtered), timestampedFilename(`calc-history-${filter}`, "csv"), "text/csv");
    setShowExportMenu(false);
  };

  const exportJSON = () => {
    downloadFile(entriesToJSON(filtered), timestampedFilename(`calc-history-${filter}`, "json"), "application/json");
    setShowExportMenu(false);
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
            {showClearConfirm ? (
              <>
                <span className="text-xs text-fg-3">Clear all?</span>
                <button
                  onClick={() => {
                    clearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs hover:bg-red-500 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-muted text-fg-2 text-xs hover:bg-dim transition-colors"
                >
                  No
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu((v) => !v)}
                    disabled={filtered.length === 0}
                    className="px-4 py-2 rounded-xl bg-raised text-fg-3 text-sm hover:bg-muted border border-line transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Export ▾
                  </button>
                  {showExportMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowExportMenu(false)}
                      />
                      <div className="absolute right-0 mt-1 w-44 bg-panel border border-line rounded-xl shadow-lg overflow-hidden z-20">
                        <div className="px-3 py-2 text-[10px] text-fg-faint uppercase tracking-wider border-b border-line-soft">
                          {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
                        </div>
                        <button
                          onClick={exportCSV}
                          className="w-full text-left px-4 py-2.5 text-sm text-fg-2 hover:bg-raised transition-colors flex items-center justify-between"
                        >
                          <span>CSV</span>
                          <span className="text-[10px] text-fg-faint">spreadsheet</span>
                        </button>
                        <button
                          onClick={exportJSON}
                          className="w-full text-left px-4 py-2.5 text-sm text-fg-2 hover:bg-raised transition-colors flex items-center justify-between border-t border-line-soft"
                        >
                          <span>JSON</span>
                          <span className="text-[10px] text-fg-faint">full data</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-raised text-fg-3 text-sm hover:bg-muted border border-line transition-colors"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "scientific", label: "Scientific" },
          { key: "programmer", label: "Programmer" },
          { key: "converter", label: "Converter" },
          { key: "datetime", label: "Date/Time" },
          { key: "statistics", label: "Statistics" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? "bg-accent text-white"
                : "bg-raised text-fg-3 hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* History entries */}
      {filtered.length === 0 ? (
        <div className="bg-panel rounded-2xl p-12 text-center">
          <p className="text-fg-muted text-4xl mb-3">📜</p>
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
                {items.map((entry, i) => {
                  const typeInfo =
                    TYPE_LABELS[entry.type as keyof typeof TYPE_LABELS] ??
                    TYPE_LABELS.scientific;
                  return (
                    <div
                      key={entry.id}
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
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {entries.length > 0 && (
        <div className="mt-6 grid grid-cols-5 gap-3">
          {[
            {
              label: "Scientific",
              count: entries.filter((e) => e.type === "scientific").length,
              color: "text-amber-400",
            },
            {
              label: "Programmer",
              count: entries.filter((e) => e.type === "programmer").length,
              color: "text-cyan-400",
            },
            {
              label: "Conversions",
              count: entries.filter((e) => e.type === "converter").length,
              color: "text-emerald-400",
            },
            {
              label: "Date/Time",
              count: entries.filter((e) => e.type === "datetime").length,
              color: "text-rose-400",
            },
            {
              label: "Statistics",
              count: entries.filter((e) => e.type === "statistics").length,
              color: "text-violet-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-panel rounded-xl px-4 py-3 text-center"
            >
              <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-fg-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

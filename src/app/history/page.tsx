"use client";

import { useState } from "react";
import { useHistory } from "@/hooks/useHistory";

const TYPE_LABELS = {
  scientific: { label: "Scientific", color: "text-amber-400 bg-amber-400/10" },
  programmer: { label: "Programmer", color: "text-cyan-400 bg-cyan-400/10" },
  converter: { label: "Converter", color: "text-emerald-400 bg-emerald-400/10" },
};

export default function HistoryPage() {
  const { entries, loaded, clearHistory, deleteEntry } = useHistory();
  const [filter, setFilter] = useState<string>("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

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
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-300">History</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {entries.length} calculation{entries.length !== 1 ? "s" : ""}
          </p>
        </div>
        {entries.length > 0 && (
          <div className="relative">
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Clear all?</span>
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
                  className="px-3 py-1.5 rounded-lg bg-zinc-700 text-zinc-300 text-xs hover:bg-zinc-600 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 border border-zinc-700 transition-colors"
              >
                Clear All
              </button>
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
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* History entries */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center">
          <p className="text-zinc-500 text-4xl mb-3">📜</p>
          <p className="text-zinc-400">No history yet</p>
          <p className="text-zinc-600 text-sm mt-1">
            Your calculations will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs text-zinc-600 font-medium uppercase tracking-wider mb-2 px-1">
                {date}
              </h3>
              <div className="bg-zinc-900 rounded-2xl overflow-hidden">
                {items.map((entry, i) => {
                  const typeInfo =
                    TYPE_LABELS[entry.type as keyof typeof TYPE_LABELS] ??
                    TYPE_LABELS.scientific;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/30 transition-colors ${
                        i < items.length - 1 ? "border-b border-zinc-800/50" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}
                          >
                            {typeInfo.label}
                          </span>
                          <span className="text-[10px] text-zinc-600">
                            {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 font-mono truncate">
                          {entry.expression}
                        </p>
                        <p className="text-lg text-white font-mono">
                          = {entry.result}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="ml-3 text-zinc-600 hover:text-red-400 transition-colors p-1"
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
        <div className="mt-6 grid grid-cols-3 gap-3">
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
          ].map((s) => (
            <div
              key={s.label}
              className="bg-zinc-900 rounded-xl px-4 py-3 text-center"
            >
              <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { useLiveRates } from "@/hooks/useLiveRates";
import { CURRENCY_RATES, convertCurrency } from "@/utils/currencies";

export default function CurrencyPage() {
  const { addEntry } = useHistory();
  const { rates: liveRates, fetchedAt, status, error, refresh } = useLiveRates();
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("VND");
  const [amount, setAmount] = useState("1");
  const [search, setSearch] = useState("");

  const result = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num)) return null;
    return convertCurrency(num, fromCode, toCode, liveRates ?? undefined);
  }, [amount, fromCode, toCode, liveRates]);

  const fromCurrency = CURRENCY_RATES.find((c) => c.code === fromCode)!;
  const toCurrency = CURRENCY_RATES.find((c) => c.code === toCode)!;

  const rate = convertCurrency(1, fromCode, toCode, liveRates ?? undefined);
  const inverseRate = convertCurrency(1, toCode, fromCode, liveRates ?? undefined);

  const swap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
    if (result !== null) setAmount(result.toFixed(2));
  };

  const handleSave = () => {
    if (result === null) return;
    const expr = `${amount} ${fromCode} → ${toCode}`;
    const resultStr = `${formatNumber(result)} ${toCode}`;
    addEntry({ expression: expr, result: resultStr, type: "converter" });
  };

  const filteredRates = useMemo(() => {
    const num = parseFloat(amount) || 1;
    return CURRENCY_RATES.filter(
      (c) =>
        c.code !== fromCode &&
        (c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase()))
    ).map((c) => ({
      ...c,
      converted: convertCurrency(num, fromCode, c.code, liveRates ?? undefined),
    }));
  }, [amount, fromCode, search, liveRates]);

  const statusInfo = getStatusInfo(status, fetchedAt, error);

  const selectClass =
    "w-full bg-raised border border-line rounded-xl px-4 py-3 text-sm text-fg-2 focus:outline-none focus:ring-2 focus:ring-ring transition-all";

  return (
    <div className="flex flex-col items-center min-h-screen p-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-2 text-fg-2">
          Currency Converter
        </h1>

        {/* Status banner */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
            <span className="text-fg-muted">{statusInfo.message}</span>
          </div>
          <button
            onClick={refresh}
            disabled={status === "loading"}
            className="text-[11px] text-accent-fg hover:text-accent-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${status === "loading" ? "animate-spin" : ""}`} />
            {status === "loading" ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="bg-panel rounded-2xl p-5 space-y-4">
          {/* From */}
          <div className="space-y-2">
            <label className="text-xs text-fg-muted font-medium uppercase tracking-wider">
              From
            </label>
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className={selectClass}
            >
              {CURRENCY_RATES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted text-lg">
                {fromCurrency.symbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-raised border border-line rounded-xl pl-10 pr-4 py-3 text-lg font-mono text-fg focus:outline-none focus:ring-2 focus:ring-ring transition-all text-right"
              />
            </div>
          </div>

          {/* Swap */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-line-soft" />
            <motion.button
              onClick={swap}
              whileTap={{ rotate: 180, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full bg-raised border border-line flex items-center justify-center text-fg-3 hover:text-accent-fg hover:border-accent/50 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
            </motion.button>
            <div className="flex-1 border-t border-line-soft" />
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="text-xs text-fg-muted font-medium uppercase tracking-wider">
              To
            </label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className={selectClass}
            >
              {CURRENCY_RATES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
            <div className="bg-raised border border-line rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-fg-muted text-lg">{toCurrency.symbol}</span>
              <span className="text-2xl font-mono text-emerald-400">
                {result !== null ? formatNumber(result) : "—"}
              </span>
            </div>
          </div>

          {/* Exchange rate info */}
          <div className="bg-raised/50 rounded-xl px-4 py-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-fg-muted">
                1 {fromCode} =
              </span>
              <span className="text-fg-2 font-mono">
                {formatNumber(rate)} {toCode}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-fg-muted">
                1 {toCode} =
              </span>
              <span className="text-fg-2 font-mono">
                {formatNumber(inverseRate)} {fromCode}
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={result === null}
            className="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save to History
          </button>
        </div>

        {/* All rates table */}
        <div className="mt-6 bg-panel rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line-soft flex items-center justify-between">
            <h2 className="text-sm font-medium text-fg-3">
              All Rates from {fromCode}
            </h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-raised border border-line rounded-lg px-3 py-1.5 text-xs text-fg-2 w-32 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {filteredRates.map((c) => (
              <button
                key={c.code}
                onClick={() => setToCode(c.code)}
                className={`w-full flex items-center justify-between px-5 py-3 border-b border-line-soft/50 hover:bg-raised/30 transition-colors text-left ${
                  c.code === toCode ? "bg-accent/10" : ""
                }`}
              >
                <div>
                  <span className="text-sm text-fg-2 font-medium">{c.code}</span>
                  <span className="text-xs text-fg-muted ml-2">{c.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-fg-2">
                    {c.symbol}{formatNumber(c.converted)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-fg-faint mt-3">
          {statusInfo.disclaimer}
        </p>
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (Math.abs(n) >= 1000) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  return parseFloat(n.toPrecision(6)).toString();
}

function getStatusInfo(
  status: "loading" | "live" | "cached" | "stale" | "fallback",
  fetchedAt: number | null,
  error: string | null
) {
  const timeAgo = fetchedAt ? formatTimeAgo(Date.now() - fetchedAt) : "never";
  switch (status) {
    case "loading":
      return {
        dotColor: "bg-amber-400 animate-pulse",
        message: "Fetching live rates…",
        disclaimer: "Loading exchange rates…",
      };
    case "live":
      return {
        dotColor: "bg-emerald-400",
        message: "Live rates · just now",
        disclaimer: "Live rates from exchangerate-api.com",
      };
    case "cached":
      return {
        dotColor: "bg-emerald-400",
        message: `Cached · ${timeAgo} ago`,
        disclaimer: "Live rates from exchangerate-api.com (cached)",
      };
    case "stale":
      return {
        dotColor: "bg-amber-400",
        message: `Stale cache · ${timeAgo} ago, refreshing…`,
        disclaimer: "Refreshing exchange rates…",
      };
    case "fallback":
      return {
        dotColor: "bg-red-400",
        message: `Offline · using static rates${error ? ` (${error})` : ""}`,
        disclaimer: "Static fallback rates — not current",
      };
  }
}

function formatTimeAgo(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

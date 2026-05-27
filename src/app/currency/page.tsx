"use client";

import { useState, useMemo } from "react";
import { useHistory } from "@/hooks/useHistory";
import { CURRENCY_RATES, convertCurrency } from "@/utils/currencies";

export default function CurrencyPage() {
  const { addEntry } = useHistory();
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("VND");
  const [amount, setAmount] = useState("1");
  const [search, setSearch] = useState("");

  const result = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num)) return null;
    return convertCurrency(num, fromCode, toCode);
  }, [amount, fromCode, toCode]);

  const fromCurrency = CURRENCY_RATES.find((c) => c.code === fromCode)!;
  const toCurrency = CURRENCY_RATES.find((c) => c.code === toCode)!;

  const rate = convertCurrency(1, fromCode, toCode);
  const inverseRate = convertCurrency(1, toCode, fromCode);

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
      converted: convertCurrency(num, fromCode, c.code),
    }));
  }, [amount, fromCode, search]);

  const selectClass =
    "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all";

  return (
    <div className="flex flex-col items-center min-h-screen p-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6 text-zinc-300">
          Currency Converter
        </h1>

        <div className="bg-zinc-900 rounded-2xl p-5 space-y-4">
          {/* From */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">
                {fromCurrency.symbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-lg font-mono text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-right"
              />
            </div>
          </div>

          {/* Swap */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-zinc-800" />
            <button
              onClick={swap}
              className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition-all active:scale-90"
            >
              ⇅
            </button>
            <div className="flex-1 border-t border-zinc-800" />
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
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
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-zinc-500 text-lg">{toCurrency.symbol}</span>
              <span className="text-2xl font-mono text-emerald-400">
                {result !== null ? formatNumber(result) : "—"}
              </span>
            </div>
          </div>

          {/* Exchange rate info */}
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">
                1 {fromCode} =
              </span>
              <span className="text-zinc-300 font-mono">
                {formatNumber(rate)} {toCode}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">
                1 {toCode} =
              </span>
              <span className="text-zinc-300 font-mono">
                {formatNumber(inverseRate)} {fromCode}
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={result === null}
            className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save to History
          </button>
        </div>

        {/* All rates table */}
        <div className="mt-6 bg-zinc-900 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-400">
              All Rates from {fromCode}
            </h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 w-32 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {filteredRates.map((c) => (
              <button
                key={c.code}
                onClick={() => setToCode(c.code)}
                className={`w-full flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-left ${
                  c.code === toCode ? "bg-amber-600/10" : ""
                }`}
              >
                <div>
                  <span className="text-sm text-zinc-200 font-medium">{c.code}</span>
                  <span className="text-xs text-zinc-500 ml-2">{c.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-zinc-300">
                    {c.symbol}{formatNumber(c.converted)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-600 mt-3">
          Rates are approximate and for reference only
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

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { CONVERSION_CATEGORIES } from "@/utils/conversions";

export default function ConverterPage() {
  const { addEntry } = useHistory();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [inputValue, setInputValue] = useState("1");

  const category = CONVERSION_CATEGORIES[categoryIndex];
  const fromUnit = category.units[fromIndex];
  const toUnit = category.units[toIndex];

  const result = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return "";
    const baseValue = fromUnit.toBase(num);
    const converted = toUnit.fromBase(baseValue);
    return parseFloat(converted.toPrecision(10)).toString();
  }, [inputValue, fromUnit, toUnit]);

  const swap = () => {
    setFromIndex(toIndex);
    setToIndex(fromIndex);
    setInputValue(result || "1");
  };

  const handleConvert = () => {
    if (!result) return;
    const expr = `${inputValue} ${fromUnit.symbol} → ${toUnit.symbol}`;
    addEntry({ expression: expr, result: `${result} ${toUnit.symbol}`, type: "converter" });
  };

  const handleCategoryChange = (idx: number) => {
    setCategoryIndex(idx);
    setFromIndex(0);
    setToIndex(1);
    setInputValue("1");
  };

  const selectClass =
    "w-full bg-raised border border-line rounded-xl px-4 py-3 text-sm text-fg-2 focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none";

  const inputClass =
    "w-full bg-raised border border-line rounded-xl px-4 py-3 text-lg font-mono text-fg focus:outline-none focus:ring-2 focus:ring-ring transition-all text-right";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6 text-fg-2">
          Unit Converter
        </h1>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
          {CONVERSION_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = i === categoryIndex;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(i)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isActive ? "text-white" : "bg-raised text-fg-3 hover:bg-muted"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="converter-cat-active"
                    className="absolute inset-0 bg-accent rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative w-3 h-3" />
                <span className="relative">{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-panel rounded-2xl p-5 space-y-4">
          {/* From */}
          <div className="space-y-2">
            <label className="text-xs text-fg-muted font-medium uppercase tracking-wider">
              From
            </label>
            <select
              value={fromIndex}
              onChange={(e) => setFromIndex(Number(e.target.value))}
              className={selectClass}
            >
              {category.units.map((u, i) => (
                <option key={i} value={i}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className={inputClass}
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <motion.button
              onClick={swap}
              whileTap={{ rotate: 180, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full bg-raised border border-line flex items-center justify-center text-fg-3 hover:text-accent-fg hover:border-accent/50 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
            </motion.button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="text-xs text-fg-muted font-medium uppercase tracking-wider">
              To
            </label>
            <select
              value={toIndex}
              onChange={(e) => setToIndex(Number(e.target.value))}
              className={selectClass}
            >
              {category.units.map((u, i) => (
                <option key={i} value={i}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
            <div className="bg-raised border border-line rounded-xl px-4 py-3 text-right">
              <span className="text-lg font-mono text-emerald-400">
                {result || "—"}
              </span>
              <span className="text-sm text-fg-muted ml-2">{toUnit.symbol}</span>
            </div>
          </div>

          {/* Save to history */}
          <button
            onClick={handleConvert}
            disabled={!result}
            className="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save to History
          </button>

          {/* Quick reference */}
          <div className="border-t border-line-soft pt-4">
            <p className="text-xs text-fg-faint mb-2 font-medium uppercase tracking-wider">
              Quick Reference
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {category.units
                .filter((_, i) => i !== fromIndex)
                .slice(0, 6)
                .map((u, i) => {
                  const baseVal = fromUnit.toBase(parseFloat(inputValue) || 1);
                  const converted = u.fromBase(baseVal);
                  return (
                    <div
                      key={i}
                      className="flex justify-between bg-raised/50 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs text-fg-muted">{u.symbol}</span>
                      <span className="text-xs text-fg-2 font-mono">
                        {parseFloat(converted.toPrecision(6))}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

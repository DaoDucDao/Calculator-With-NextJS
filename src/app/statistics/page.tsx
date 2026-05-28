"use client";

import { useState, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ChartBar, Dices, TrendingUp, type LucideIcon } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import HelpField from "@/components/HelpField";
import {
  parseDataset,
  parsePairs,
  describe,
  factorial,
  permutations,
  combinations,
  linearRegression,
  fmt,
} from "@/utils/statistics";

type Tab = "descriptive" | "combinatorics" | "regression";

const TABS: { key: Tab; label: string; Icon: LucideIcon }[] = [
  { key: "descriptive", label: "Descriptive", Icon: ChartBar },
  { key: "combinatorics", label: "Combinatorics", Icon: Dices },
  { key: "regression", label: "Regression", Icon: TrendingUp },
];

export default function StatisticsPage() {
  const { addEntry } = useHistory();
  const [tab, setTab] = useState<Tab>("descriptive");

  const [dataInput, setDataInput] = useState("1, 2, 3, 4, 5, 6, 7, 8, 9, 10");

  const [n, setN] = useState("10");
  const [r, setR] = useState("3");

  const [pairsInput, setPairsInput] = useState(
    "1, 2\n2, 4.1\n3, 6.2\n4, 8.1\n5, 9.9\n6, 12.2"
  );

  const dataset = useMemo(() => parseDataset(dataInput), [dataInput]);
  const stats = useMemo(() => describe(dataset), [dataset]);

  const nNum = parseInt(n);
  const rNum = parseInt(r);
  const factResult = useMemo(() => factorial(nNum), [nNum]);
  const permResult = useMemo(() => permutations(nNum, rNum), [nNum, rNum]);
  const combResult = useMemo(() => combinations(nNum, rNum), [nNum, rNum]);

  const pairs = useMemo(() => parsePairs(pairsInput), [pairsInput]);
  const regression = useMemo(
    () => linearRegression(pairs.x, pairs.y),
    [pairs]
  );

  const saveDescriptive = () => {
    if (!stats) return;
    addEntry({
      expression: `describe([${dataset.slice(0, 5).join(", ")}${dataset.length > 5 ? ", …" : ""}], n=${stats.count})`,
      result: `μ=${fmt(stats.mean)}, σ=${fmt(stats.stdDev)}, med=${fmt(stats.median)}`,
      type: "statistics",
    });
  };

  const saveCombinatorics = (type: "fact" | "perm" | "comb") => {
    if (type === "fact" && isFinite(factResult)) {
      addEntry({
        expression: `${nNum}!`,
        result: fmt(factResult, 10),
        type: "statistics",
      });
    } else if (type === "perm" && isFinite(permResult)) {
      addEntry({
        expression: `P(${nNum}, ${rNum})`,
        result: fmt(permResult, 10),
        type: "statistics",
      });
    } else if (type === "comb" && isFinite(combResult)) {
      addEntry({
        expression: `C(${nNum}, ${rNum})`,
        result: fmt(combResult, 10),
        type: "statistics",
      });
    }
  };

  const saveRegression = () => {
    if (!regression) return;
    addEntry({
      expression: `linreg(${regression.n} pairs)`,
      result: `y = ${fmt(regression.slope)}x + ${fmt(regression.intercept)} (r²=${fmt(regression.r2, 4)})`,
      type: "statistics",
    });
  };

  const labelClass = "text-xs text-fg-muted font-medium uppercase tracking-wider";
  const inputClass =
    "w-full bg-raised border border-line rounded-xl px-4 py-3 text-sm text-fg-2 focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const btnClass =
    "w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6 text-fg-2">
          Statistics Calculator
        </h1>

        <Tabs.Root value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <Tabs.List className="flex gap-1.5 mb-6 justify-center">
            {TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <Tabs.Trigger
                  key={t.key}
                  value={t.key}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive ? "text-white" : "bg-raised text-fg-3 hover:bg-muted"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="stats-tab-active"
                      className="absolute inset-0 bg-accent rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <t.Icon className="relative w-3 h-3" />
                  <span className="relative">{t.label}</span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          <div className="bg-panel rounded-2xl p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
          {tab === "descriptive" && (
            <>
              <HelpField
                label="Dataset (comma or space separated)"
                title="Input format"
                content="Paste numbers separated by commas, spaces, or newlines (e.g. '1, 2, 3' or '1 2 3'). Non-numeric entries are silently ignored."
              >
                <textarea
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  rows={3}
                  className={inputClass + " font-mono resize-none"}
                  placeholder="1, 2, 3, 4, 5"
                />
                <p className="text-[10px] text-fg-faint">
                  {dataset.length} valid number{dataset.length !== 1 ? "s" : ""} parsed
                </p>
              </HelpField>

              {stats && (
                <div className="bg-raised rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Count" value={stats.count} />
                    <Stat label="Sum" value={fmt(stats.sum)} />
                    <Stat label="Mean (μ)" value={fmt(stats.mean)} highlight />
                    <Stat label="Median" value={fmt(stats.median)} highlight />
                    <Stat
                      label="Mode"
                      value={stats.mode.length ? stats.mode.map((m) => fmt(m)).join(", ") : "none"}
                    />
                    <Stat label="Range" value={fmt(stats.range)} />
                    <Stat label="Min" value={fmt(stats.min)} />
                    <Stat label="Max" value={fmt(stats.max)} />
                  </div>

                  <div className="border-t border-line pt-3 grid grid-cols-2 gap-3">
                    <Stat label="Std Dev (σ)" value={fmt(stats.stdDev)} highlight />
                    <Stat label="Variance (σ²)" value={fmt(stats.variance)} />
                    <Stat label="Sample s" value={fmt(stats.sampleStdDev)} />
                    <Stat label="Sample s²" value={fmt(stats.sampleVariance)} />
                  </div>

                  <div className="border-t border-line pt-3 grid grid-cols-3 gap-3">
                    <Stat label="Q1" value={fmt(stats.q1)} />
                    <Stat label="Q3" value={fmt(stats.q3)} />
                    <Stat label="IQR" value={fmt(stats.iqr)} />
                  </div>
                </div>
              )}

              <button onClick={saveDescriptive} disabled={!stats} className={btnClass}>
                Save to History
              </button>
            </>
          )}

          {tab === "combinatorics" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <HelpField
                  label="n"
                  title="Total items (n)"
                  content="The total number of things you're choosing from. Must be a non-negative integer. Used by factorial n!, P(n,r), and C(n,r)."
                >
                  <input
                    type="number"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    min="0"
                    className={inputClass + " font-mono text-right"}
                  />
                </HelpField>
                <HelpField
                  label="r"
                  title="Chosen count (r)"
                  content="How many you're picking. Must be ≤ n. P(n,r) counts ordered arrangements; C(n,r) counts unordered selections."
                >
                  <input
                    type="number"
                    value={r}
                    onChange={(e) => setR(e.target.value)}
                    min="0"
                    className={inputClass + " font-mono text-right"}
                  />
                </HelpField>
              </div>

              <div className="space-y-3">
                <ResultCard
                  label="Factorial"
                  formula={`${nNum}! `}
                  value={fmt(factResult, 10)}
                  onSave={() => saveCombinatorics("fact")}
                  disabled={!isFinite(factResult)}
                />
                <ResultCard
                  label="Permutations"
                  formula={`P(${nNum}, ${rNum}) = ${nNum}! / (${nNum} − ${rNum})!`}
                  value={fmt(permResult, 10)}
                  onSave={() => saveCombinatorics("perm")}
                  disabled={!isFinite(permResult)}
                />
                <ResultCard
                  label="Combinations"
                  formula={`C(${nNum}, ${rNum}) = ${nNum}! / (${rNum}! · (${nNum} − ${rNum})!)`}
                  value={fmt(combResult, 10)}
                  onSave={() => saveCombinatorics("comb")}
                  disabled={!isFinite(combResult)}
                />
              </div>
            </>
          )}

          {tab === "regression" && (
            <>
              <HelpField
                label="Pairs (x, y per line)"
                title="Input format"
                content="One data point per line, with x and y separated by a comma or space (e.g. '1, 2' on each line). Need at least 2 pairs with some variation in x to compute a regression."
              >
                <textarea
                  value={pairsInput}
                  onChange={(e) => setPairsInput(e.target.value)}
                  rows={6}
                  className={inputClass + " font-mono resize-none"}
                  placeholder="1, 2&#10;2, 4&#10;3, 6"
                />
                <p className="text-[10px] text-fg-faint">
                  {pairs.x.length} valid pair{pairs.x.length !== 1 ? "s" : ""} parsed
                </p>
              </HelpField>

              {regression ? (
                <div className="bg-raised rounded-xl p-4 space-y-3">
                  <div>
                    <p className={labelClass}>Linear Fit</p>
                    <p className="text-lg font-mono text-accent-fg mt-1">
                      y = {fmt(regression.slope)}x {regression.intercept >= 0 ? "+" : "−"} {fmt(Math.abs(regression.intercept))}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
                    <Stat label="Slope (m)" value={fmt(regression.slope)} highlight />
                    <Stat label="Intercept (b)" value={fmt(regression.intercept)} highlight />
                    <Stat label="Correlation (r)" value={fmt(regression.r, 4)} />
                    <Stat label="R²" value={fmt(regression.r2, 4)} />
                  </div>
                </div>
              ) : (
                <div className="bg-raised/50 rounded-xl p-4 text-center text-xs text-fg-muted">
                  Need at least 2 valid pairs with variation in x
                </div>
              )}

              <button onClick={saveRegression} disabled={!regression} className={btnClass}>
                Save to History
              </button>
            </>
          )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-fg-muted uppercase tracking-wider">{label}</p>
      <p
        className={`text-sm font-mono ${
          highlight ? "text-accent-fg" : "text-fg-2"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ResultCard({
  label,
  formula,
  value,
  onSave,
  disabled,
}: {
  label: string;
  formula: string;
  value: string;
  onSave: () => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-raised rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-fg-muted uppercase tracking-wider">{label}</p>
          <p className="text-[11px] font-mono text-fg-faint mt-0.5 truncate">{formula}</p>
          <p className="text-lg font-mono text-accent-fg mt-1 truncate">{value}</p>
        </div>
        <button
          onClick={onSave}
          disabled={disabled}
          className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
        >
          Save
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  X as XIcon,
  Divide,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import {
  type Complex,
  add,
  sub,
  mul,
  div,
  magnitude,
  argument,
  conjugate,
  reciprocal,
  square,
  sqrt,
  exp,
  ln,
  fromPolar,
  format,
  formatPolar,
  formatPolarDeg,
  fmt,
} from "@/utils/complex";

type Tab = "rectangular" | "polar";
const TABS: { key: Tab; label: string; Icon: LucideIcon }[] = [
  { key: "rectangular", label: "a + bi", Icon: Plus },
  { key: "polar", label: "r ∠ θ", Icon: ArrowLeftRight },
];

type BinaryOp = "+" | "−" | "×" | "÷";
const BINARY_OPS: { key: BinaryOp; Icon: LucideIcon; fn: (a: Complex, b: Complex) => Complex }[] = [
  { key: "+", Icon: Plus, fn: add },
  { key: "−", Icon: Minus, fn: sub },
  { key: "×", Icon: XIcon, fn: mul },
  { key: "÷", Icon: Divide, fn: div },
];

const UNARY_OPS: { key: string; label: string; fn: (z: Complex) => Complex }[] = [
  { key: "conj", label: "z̄ conj", fn: conjugate },
  { key: "recip", label: "1/z", fn: reciprocal },
  { key: "sq", label: "z²", fn: square },
  { key: "sqrt", label: "√z", fn: sqrt },
  { key: "exp", label: "eᶻ", fn: exp },
  { key: "ln", label: "ln(z)", fn: ln },
];

export default function ComplexPage() {
  const { addEntry } = useHistory();
  const [tab, setTab] = useState<Tab>("rectangular");

  const [aRe, setARe] = useState("3");
  const [aIm, setAIm] = useState("4");
  const [bRe, setBRe] = useState("1");
  const [bIm, setBIm] = useState("2");

  const [aR, setAR] = useState("5");
  const [aTheta, setATheta] = useState("0.927");
  const [bR, setBR] = useState("2.236");
  const [bTheta, setBTheta] = useState("1.107");

  const [op, setOp] = useState<BinaryOp>("+");

  const z1: Complex = useMemo(() => {
    if (tab === "rectangular") {
      return { re: parseFloat(aRe) || 0, im: parseFloat(aIm) || 0 };
    }
    return fromPolar(parseFloat(aR) || 0, parseFloat(aTheta) || 0);
  }, [tab, aRe, aIm, aR, aTheta]);

  const z2: Complex = useMemo(() => {
    if (tab === "rectangular") {
      return { re: parseFloat(bRe) || 0, im: parseFloat(bIm) || 0 };
    }
    return fromPolar(parseFloat(bR) || 0, parseFloat(bTheta) || 0);
  }, [tab, bRe, bIm, bR, bTheta]);

  const result = useMemo(() => {
    const opDef = BINARY_OPS.find((o) => o.key === op)!;
    return opDef.fn(z1, z2);
  }, [op, z1, z2]);

  const saveBinary = () => {
    addEntry({
      expression: `(${format(z1, 4)}) ${op} (${format(z2, 4)})`,
      result: format(result, 6),
      type: "complex",
    });
  };

  const saveUnary = (label: string, z: Complex) => {
    addEntry({
      expression: `${label.split(" ")[0]}(${format(z1, 4)})`,
      result: format(z, 6),
      type: "complex",
    });
  };

  const labelClass = "text-xs text-fg-muted font-medium uppercase tracking-wider";
  const inputClass =
    "w-full bg-raised border border-line rounded-xl px-3 py-2.5 text-sm text-fg-2 font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-all text-right";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6 text-fg-2">
          Complex Number Calculator
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
                      layoutId="complex-tab-active"
                      className="absolute inset-0 bg-accent rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <t.Icon className="relative w-3 h-3" />
                  <span className="relative font-mono">{t.label}</span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          <div className="bg-panel rounded-2xl p-5 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                {tab === "rectangular" ? (
                  <>
                    <NumberRow
                      label="z₁"
                      a={aRe}
                      b={aIm}
                      onAChange={setARe}
                      onBChange={setAIm}
                      aPlaceholder="real"
                      bPlaceholder="imag"
                      inputClass={inputClass}
                      labelClass={labelClass}
                      separator="+"
                      bSuffix="i"
                    />
                    <NumberRow
                      label="z₂"
                      a={bRe}
                      b={bIm}
                      onAChange={setBRe}
                      onBChange={setBIm}
                      aPlaceholder="real"
                      bPlaceholder="imag"
                      inputClass={inputClass}
                      labelClass={labelClass}
                      separator="+"
                      bSuffix="i"
                    />
                  </>
                ) : (
                  <>
                    <NumberRow
                      label="z₁"
                      a={aR}
                      b={aTheta}
                      onAChange={setAR}
                      onBChange={setATheta}
                      aPlaceholder="r"
                      bPlaceholder="θ rad"
                      inputClass={inputClass}
                      labelClass={labelClass}
                      separator="∠"
                      bSuffix=""
                    />
                    <NumberRow
                      label="z₂"
                      a={bR}
                      b={bTheta}
                      onAChange={setBR}
                      onBChange={setBTheta}
                      aPlaceholder="r"
                      bPlaceholder="θ rad"
                      inputClass={inputClass}
                      labelClass={labelClass}
                      separator="∠"
                      bSuffix=""
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Operation selector */}
            <div className="grid grid-cols-4 gap-1.5">
              {BINARY_OPS.map((o) => {
                const isActive = op === o.key;
                return (
                  <button
                    key={o.key}
                    onClick={() => setOp(o.key)}
                    className={`relative py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
                      isActive ? "text-white" : "bg-raised text-fg-3 hover:bg-muted"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="complex-op-active"
                        className="absolute inset-0 bg-accent rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <o.Icon className="relative w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Result */}
            <div className="bg-raised rounded-xl p-4 space-y-2">
              <p className={labelClass}>Result</p>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={format(result)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-2xl font-mono text-accent-fg">
                    {format(result)}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono text-fg-3 pt-2 border-t border-line">
                    <div>
                      <span className="text-fg-muted">|z|</span> {fmt(magnitude(result))}
                    </div>
                    <div>
                      <span className="text-fg-muted">arg(z)</span> {fmt(argument(result), 4)} rad
                    </div>
                    <div className="col-span-2 text-fg-muted">
                      {formatPolarDeg(result)}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={saveBinary}
              className="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-2 transition-all"
            >
              Save to History
            </button>

            {/* Complex plane visualization */}
            <ComplexPlane z1={z1} z2={z2} result={result} />

            {/* Unary ops on z1 */}
            <div className="border-t border-line-soft pt-4 space-y-2">
              <p className={labelClass}>Functions of z₁</p>
              <div className="grid grid-cols-3 gap-1.5">
                {UNARY_OPS.map((u) => {
                  const out = u.fn(z1);
                  return (
                    <button
                      key={u.key}
                      onClick={() => saveUnary(u.label, out)}
                      className="bg-raised hover:bg-muted rounded-lg px-2 py-2 text-left transition-colors"
                      title={`Save ${u.label} to history`}
                    >
                      <p className="text-[10px] text-fg-muted">{u.label}</p>
                      <p className="text-xs font-mono text-fg-2 truncate">
                        {format(out, 4)}
                      </p>
                    </button>
                  );
                })}
                <div className="bg-raised/50 rounded-lg px-2 py-2 text-left">
                  <p className="text-[10px] text-fg-muted">|z₁|</p>
                  <p className="text-xs font-mono text-fg-2">{fmt(magnitude(z1))}</p>
                </div>
                <div className="bg-raised/50 rounded-lg px-2 py-2 text-left">
                  <p className="text-[10px] text-fg-muted">arg(z₁)</p>
                  <p className="text-xs font-mono text-fg-2">
                    {fmt(argument(z1), 4)}
                  </p>
                </div>
                <div className="bg-raised/50 rounded-lg px-2 py-2 text-left">
                  <p className="text-[10px] text-fg-muted">polar</p>
                  <p className="text-[10px] font-mono text-fg-2 truncate">
                    {formatPolar(z1, 4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}

function NumberRow({
  label,
  a,
  b,
  onAChange,
  onBChange,
  aPlaceholder,
  bPlaceholder,
  inputClass,
  labelClass,
  separator,
  bSuffix,
}: {
  label: string;
  a: string;
  b: string;
  onAChange: (s: string) => void;
  onBChange: (s: string) => void;
  aPlaceholder: string;
  bPlaceholder: string;
  inputClass: string;
  labelClass: string;
  separator: string;
  bSuffix: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={a}
          onChange={(e) => onAChange(e.target.value)}
          placeholder={aPlaceholder}
          className={inputClass}
        />
        <span className="text-fg-muted text-sm font-mono">{separator}</span>
        <div className="flex-1 relative">
          <input
            type="number"
            value={b}
            onChange={(e) => onBChange(e.target.value)}
            placeholder={bPlaceholder}
            className={inputClass + (bSuffix ? " pr-7" : "")}
          />
          {bSuffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted font-mono text-sm pointer-events-none">
              {bSuffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ComplexPlane({ z1, z2, result }: { z1: Complex; z2: Complex; result: Complex }) {
  const padding = 20;
  const size = 240;
  const innerSize = size - padding * 2;

  const maxAbs = Math.max(
    Math.abs(z1.re), Math.abs(z1.im),
    Math.abs(z2.re), Math.abs(z2.im),
    Math.abs(result.re), Math.abs(result.im),
    1
  );
  const scale = (innerSize / 2) / maxAbs;

  const toX = (re: number) => padding + innerSize / 2 + re * scale;
  const toY = (im: number) => padding + innerSize / 2 - im * scale;

  const points = [
    { z: z1, label: "z₁", color: "fill-amber-400 stroke-amber-400" },
    { z: z2, label: "z₂", color: "fill-cyan-400 stroke-cyan-400" },
    { z: result, label: "=", color: "fill-accent stroke-accent" },
  ].filter((p) => isFinite(p.z.re) && isFinite(p.z.im));

  return (
    <div className="border-t border-line-soft pt-4">
      <p className="text-xs text-fg-muted font-medium uppercase tracking-wider mb-2">
        Complex Plane
      </p>
      <div className="flex justify-center">
        <svg width={size} height={size} className="bg-raised/30 rounded-xl">
          {/* axes */}
          <line
            x1={padding}
            y1={padding + innerSize / 2}
            x2={size - padding}
            y2={padding + innerSize / 2}
            stroke="currentColor"
            className="text-fg-faint"
            strokeWidth="1"
          />
          <line
            x1={padding + innerSize / 2}
            y1={padding}
            x2={padding + innerSize / 2}
            y2={size - padding}
            stroke="currentColor"
            className="text-fg-faint"
            strokeWidth="1"
          />
          {/* axis labels */}
          <text
            x={size - padding + 2}
            y={padding + innerSize / 2 - 4}
            className="fill-current text-fg-muted text-[9px] font-mono"
          >
            Re
          </text>
          <text
            x={padding + innerSize / 2 + 4}
            y={padding - 4}
            className="fill-current text-fg-muted text-[9px] font-mono"
          >
            Im
          </text>
          {/* origin */}
          <circle cx={padding + innerSize / 2} cy={padding + innerSize / 2} r="2" className="fill-fg-muted" />

          {/* points + vectors */}
          {points.map((p, i) => {
            const x = toX(p.z.re);
            const y = toY(p.z.im);
            return (
              <g key={i}>
                <line
                  x1={padding + innerSize / 2}
                  y1={padding + innerSize / 2}
                  x2={x}
                  y2={y}
                  className={p.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
                <circle cx={x} cy={y} r="4" className={p.color} />
                <text
                  x={x + 6}
                  y={y - 6}
                  className="fill-current text-fg-2 text-[10px] font-mono"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

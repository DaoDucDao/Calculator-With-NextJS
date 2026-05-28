"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Undo2, Redo2, Delete } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import HelpHint from "@/components/HelpHint";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import type { NumberBase } from "@/types";

interface ProgSnapshot {
  display: string;
  expression: string;
  operator: string;
  prevValue: number;
}
import {
  parseFromBase,
  formatToBase,
  formatBinaryGroups,
  bitwiseOp,
  bitwiseNot,
  BASE_DIGITS,
} from "@/utils/programmer";

export default function ProgrammerPage() {
  const { addEntry } = useHistory();
  const [display, setDisplay] = useState("0");
  const [base, setBase] = useState<NumberBase>("DEC");
  const [expression, setExpression] = useState("");
  const [operator, setOperator] = useState("");
  const [prevValue, setPrevValue] = useState(0);
  const [isNewInput, setIsNewInput] = useState(true);
  const [bitWidth, setBitWidth] = useState<8 | 16 | 32 | 64>(32);
  const { record, undo, redo, canUndo, canRedo } = useUndoRedo<ProgSnapshot>({
    display: "0", expression: "", operator: "", prevValue: 0,
  });

  const snapshot = () => record({ display, expression, operator, prevValue });

  const handleUndo = useCallback(() => {
    const prev = undo();
    if (prev) {
      setDisplay(prev.display);
      setExpression(prev.expression);
      setOperator(prev.operator);
      setPrevValue(prev.prevValue);
      setIsNewInput(true);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const next = redo();
    if (next) {
      setDisplay(next.display);
      setExpression(next.expression);
      setOperator(next.operator);
      setPrevValue(next.prevValue);
      setIsNewInput(true);
    }
  }, [redo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const currentDec = parseFromBase(display, base);

  const appendDigit = useCallback(
    (digit: string) => {
      snapshot();
      if (isNewInput) {
        setDisplay(digit);
        setIsNewInput(false);
      } else {
        setDisplay((prev) => (prev === "0" ? digit : prev + digit));
      }
    },
    [isNewInput, snapshot]
  );

  const changeBase = (newBase: NumberBase) => {
    const dec = parseFromBase(display, base);
    setDisplay(formatToBase(dec, newBase));
    setBase(newBase);
  };

  const applyOp = useCallback(
    (op: string) => {
      snapshot();
      if (operator && !isNewInput) {
        const b = parseFromBase(display, base);
        let result: number;
        if (["AND", "OR", "XOR", "NAND", "NOR", "<<", ">>"].includes(operator)) {
          result = bitwiseOp(prevValue, b, operator);
        } else {
          const expr = `${prevValue} ${operator} ${b}`;
          result = Function(`"use strict"; return (${expr})`)() as number;
        }
        const intResult = Math.trunc(result);
        setDisplay(formatToBase(intResult, base));
        setPrevValue(intResult);
      } else {
        setPrevValue(parseFromBase(display, base));
      }
      setOperator(op);
      setExpression(`${display} ${op}`);
      setIsNewInput(true);
    },
    [display, base, operator, prevValue, isNewInput, snapshot]
  );

  const evaluate = useCallback(() => {
    if (!operator) return;
    snapshot();
    const b = parseFromBase(display, base);
    let result: number;
    if (["AND", "OR", "XOR", "NAND", "NOR", "<<", ">>"].includes(operator)) {
      result = bitwiseOp(prevValue, b, operator);
    } else {
      const expr = `${prevValue} ${operator === "÷" ? "/" : operator === "×" ? "*" : operator} ${b}`;
      result = Function(`"use strict"; return (${expr})`)() as number;
    }
    const intResult = Math.trunc(result);
    const exprStr = `${formatToBase(prevValue, base)} ${operator} ${display}`;
    const resultStr = formatToBase(intResult, base);

    addEntry({ expression: exprStr, result: resultStr, type: "programmer" });
    setDisplay(resultStr);
    setExpression("");
    setOperator("");
    setPrevValue(0);
    setIsNewInput(true);
  }, [display, base, operator, prevValue, addEntry, snapshot]);

  const clear = () => {
    snapshot();
    setDisplay("0");
    setExpression("");
    setOperator("");
    setPrevValue(0);
    setIsNewInput(true);
  };

  const applyNot = () => {
    snapshot();
    const result = bitwiseNot(currentDec);
    const resultStr = formatToBase(result, base);
    addEntry({ expression: `NOT(${display})`, result: resultStr, type: "programmer" });
    setDisplay(resultStr);
    setIsNewInput(true);
  };

  const bases: NumberBase[] = ["HEX", "DEC", "OCT", "BIN"];
  const validDigits = BASE_DIGITS[base];

  const bitwiseOps = ["AND", "OR", "XOR", "NOT", "<<", ">>"];
  const arithmeticOps = [
    { label: "+", op: "+" },
    { label: "−", op: "-" },
    { label: "×", op: "*" },
    { label: "÷", op: "/" },
    { label: "%", op: "%" },
  ];

  const binStr = formatBinaryGroups(
    Math.trunc(currentDec)
      .toString(2)
      .padStart(bitWidth, currentDec < 0 ? "1" : "0")
      .slice(-bitWidth)
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-center text-2xl font-bold mb-4 text-fg-2">
          Programmer Calculator
        </h1>

        {/* Display */}
        <div className="bg-panel rounded-t-2xl px-5 pt-4 pb-3">
          <div className="text-right text-sm text-fg-muted min-h-[20px] font-mono">
            {expression || " "}
          </div>
          <div className="text-right text-3xl font-mono font-light text-fg tracking-wider overflow-hidden text-ellipsis">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={display + base}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="inline-block"
              >
                {display}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Base representations */}
        <div className="bg-panel px-5 pb-3 space-y-1.5">
          {bases.map((b) => (
            <div key={b} className="flex items-center gap-3 text-xs font-mono">
              <span className={`w-8 font-medium ${b === base ? "text-accent-fg" : "text-fg-faint"}`}>
                {b}
              </span>
              <span className={b === base ? "text-fg" : "text-fg-muted"}>
                {formatToBase(currentDec, b)}
              </span>
            </div>
          ))}
        </div>

        {/* Bit visualization */}
        <div className="bg-panel px-5 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-fg-faint uppercase tracking-wider flex items-center">
              Bits
              <HelpHint
                title="Bit width"
                content="How many bits to use for the binary representation. 8/16/32/64-bit affects how negative numbers wrap and how the binary string is padded."
              />
            </span>
            <div className="flex gap-1">
              {([8, 16, 32, 64] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setBitWidth(w)}
                  className={`text-[10px] px-2 py-0.5 rounded ${
                    bitWidth === w ? "bg-accent text-white" : "bg-raised text-fg-muted hover:bg-muted"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div className="font-mono text-xs text-emerald-400 bg-page rounded-lg px-3 py-2 overflow-x-auto whitespace-nowrap">
            {binStr}
          </div>
        </div>

        <div className="flex justify-end gap-1 bg-panel px-5 pb-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all bg-raised text-fg-3 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3 h-3" /> Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all bg-raised text-fg-3 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            title="Redo (Ctrl+Y)"
          >
            Redo <Redo2 className="w-3 h-3" />
          </button>
        </div>

        {/* Base selector */}
        <div className="grid grid-cols-4 gap-[1px] bg-panel p-[1px]">
          {bases.map((b) => (
            <button
              key={b}
              onClick={() => changeBase(b)}
              className={`py-2.5 text-sm font-medium transition-all ${
                base === b
                  ? "bg-accent text-white"
                  : "bg-raised text-fg-3 hover:bg-muted"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Bitwise operations */}
        <div className="grid grid-cols-6 gap-[1px] bg-panel p-[1px]">
          {bitwiseOps.map((op) => (
            <button
              key={op}
              onClick={() => (op === "NOT" ? applyNot() : applyOp(op))}
              className="py-2.5 text-xs font-medium bg-muted text-cyan-400 hover:bg-dim transition-all active:scale-95"
            >
              {op}
            </button>
          ))}
        </div>

        {/* Main grid: digits + operators */}
        <div className="grid grid-cols-5 gap-[1px] bg-panel rounded-b-2xl overflow-hidden p-[1px]">
          {/* Hex digits A-F row */}
          {["A", "B", "C", "D", "E", "F"].map((d) => (
            <button
              key={d}
              onClick={() => validDigits.includes(d) && appendDigit(d)}
              disabled={!validDigits.includes(d)}
              className={`h-12 text-sm font-medium transition-all active:scale-95 ${
                validDigits.includes(d)
                  ? "bg-raised text-accent-fg hover:bg-muted"
                  : "bg-panel text-fg-off cursor-not-allowed"
              }`}
            >
              {d}
            </button>
          ))}
          {/* Arithmetic ops in remaining cells of hex row */}
          {arithmeticOps.slice(0, 4).map(({ label, op }) => (
            <button
              key={op}
              onClick={() => applyOp(op)}
              className="h-12 text-sm font-medium bg-accent text-white hover:bg-accent-2 transition-all active:scale-95"
            >
              {label}
            </button>
          ))}

          {/* Number rows */}
          {["7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => validDigits.includes(d) && appendDigit(d)}
              disabled={!validDigits.includes(d)}
              className={`h-12 text-sm font-medium transition-all active:scale-95 ${
                validDigits.includes(d) ? "bg-raised text-fg hover:bg-muted" : "bg-panel text-fg-off cursor-not-allowed"
              }`}
            >
              {d}
            </button>
          ))}
          <button onClick={() => applyOp("%")} className="h-12 text-sm font-medium bg-muted text-fg-2 hover:bg-dim transition-all active:scale-95">%</button>
          <button onClick={clear} className="h-12 text-sm font-medium bg-red-600/80 text-white hover:bg-red-500 transition-all active:scale-95">C</button>

          {["4", "5", "6"].map((d) => (
            <button
              key={d}
              onClick={() => validDigits.includes(d) && appendDigit(d)}
              disabled={!validDigits.includes(d)}
              className={`h-12 text-sm font-medium transition-all active:scale-95 ${
                validDigits.includes(d) ? "bg-raised text-fg hover:bg-muted" : "bg-panel text-fg-off cursor-not-allowed"
              }`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)))}
            className="h-12 text-sm font-medium bg-muted text-fg-2 hover:bg-dim transition-all active:scale-95 flex items-center justify-center"
          ><Delete className="w-4 h-4" /></button>
          <button
            onClick={() => { setDisplay(formatToBase(bitwiseNot(currentDec), base)); setIsNewInput(true); }}
            className="h-12 text-sm font-medium bg-muted text-fg-2 hover:bg-dim transition-all active:scale-95"
          >~</button>

          {["1", "2", "3"].map((d) => (
            <button
              key={d}
              onClick={() => validDigits.includes(d) && appendDigit(d)}
              disabled={!validDigits.includes(d)}
              className={`h-12 text-sm font-medium transition-all active:scale-95 ${
                validDigits.includes(d) ? "bg-raised text-fg hover:bg-muted" : "bg-panel text-fg-off cursor-not-allowed"
              }`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setDisplay((prev) => prev.startsWith("-") ? prev.slice(1) : `-${prev}`)}
            className="h-12 text-sm font-medium bg-muted text-fg-2 hover:bg-dim transition-all active:scale-95"
          >±</button>
          <button onClick={evaluate} className="h-12 text-sm font-bold bg-accent-2 text-white hover:bg-accent transition-all active:scale-95">=</button>

          <button
            onClick={() => appendDigit("0")}
            className="h-12 col-span-3 text-sm font-medium bg-raised text-fg hover:bg-muted transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => { setDisplay(formatToBase(0, base)); setIsNewInput(true); }}
            className="h-12 col-span-2 text-sm font-medium bg-muted text-fg-2 hover:bg-dim transition-all active:scale-95"
          >
            CE
          </button>
        </div>
      </div>
    </div>
  );
}

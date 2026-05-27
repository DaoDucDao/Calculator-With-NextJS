"use client";

import { useState, useCallback, useEffect } from "react";
import { useHistory } from "@/hooks/useHistory";
import type { AngleMode } from "@/types";

const toRadians = (value: number, mode: AngleMode) =>
  mode === "DEG" ? (value * Math.PI) / 180 : value;

export default function Calculator() {
  const { addEntry } = useHistory();
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [isNewInput, setIsNewInput] = useState(true);
  const [recentHistory, setRecentHistory] = useState<string[]>([]);
  const [isInverse, setIsInverse] = useState(false);

  const currentValue = parseFloat(display) || 0;

  const appendDigit = useCallback(
    (digit: string) => {
      if (isNewInput) {
        setDisplay(digit === "." ? "0." : digit);
        setIsNewInput(false);
      } else {
        if (digit === "." && display.includes(".")) return;
        setDisplay((prev) => (prev === "0" && digit !== "." ? digit : prev + digit));
      }
    },
    [display, isNewInput]
  );

  const evaluate = useCallback(() => {
    try {
      const sanitized = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, String(Math.PI))
        .replace(/e(?!xp)/g, String(Math.E));

      const result = Function(`"use strict"; return (${sanitized + display})`)();
      const numResult = parseFloat(Number(result).toPrecision(12));

      if (!isFinite(numResult)) {
        setDisplay("Error");
        setIsNewInput(true);
        return;
      }

      const expr = `${expression}${display}`;
      const resultStr = String(numResult);
      setRecentHistory((prev) => [...prev.slice(-4), `${expr} = ${resultStr}`]);
      addEntry({ expression: expr, result: resultStr, type: "scientific" });
      setDisplay(resultStr);
      setExpression("");
      setIsNewInput(true);
    } catch {
      setDisplay("Error");
      setExpression("");
      setIsNewInput(true);
    }
  }, [display, expression, addEntry]);

  const applyOperator = useCallback(
    (op: string) => {
      if (expression && !isNewInput) {
        try {
          const sanitized = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/π/g, String(Math.PI))
            .replace(/e(?!xp)/g, String(Math.E));
          const result = Function(`"use strict"; return (${sanitized + display})`)();
          const numResult = parseFloat(Number(result).toPrecision(12));
          if (isFinite(numResult)) {
            setDisplay(String(numResult));
          }
        } catch {
          // keep current
        }
      }
      setExpression(display + ` ${op} `);
      setIsNewInput(true);
    },
    [display, expression, isNewInput]
  );

  const applyUnary = useCallback(
    (fn: (n: number) => number, label: string) => {
      const result = fn(currentValue);
      const resultStr = !isFinite(result)
        ? "Error"
        : String(parseFloat(result.toPrecision(12)));
      setDisplay(resultStr);
      const expr = `${label}(${currentValue})`;
      setRecentHistory((prev) => [...prev.slice(-4), `${expr} = ${resultStr}`]);
      addEntry({ expression: expr, result: resultStr, type: "scientific" });
      setIsNewInput(true);
    },
    [currentValue, addEntry]
  );

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setIsNewInput(true);
  };

  const backspace = () => {
    if (isNewInput) return;
    setDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  const toggleSign = () => {
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT") return;

      if (e.key >= "0" && e.key <= "9") appendDigit(e.key);
      else if (e.key === ".") appendDigit(".");
      else if (e.key === "+") applyOperator("+");
      else if (e.key === "-") applyOperator("-");
      else if (e.key === "*") applyOperator("×");
      else if (e.key === "/") {
        e.preventDefault();
        applyOperator("÷");
      } else if (e.key === "Enter" || e.key === "=") evaluate();
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendDigit, applyOperator, evaluate]);

  const factorial = (n: number): number => {
    if (n < 0 || n > 170 || n % 1 !== 0) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };

  const buttons: { label: string; action: () => void; className?: string }[] = [
    { label: isInverse ? "INV" : "INV", action: () => setIsInverse((v) => !v), className: isInverse ? "bg-amber-600/30 text-amber-400 text-xs" : "bg-zinc-700 text-xs" },
    {
      label: isInverse ? "asin" : "sin",
      action: () =>
        isInverse
          ? applyUnary((n) => {
              const r = Math.asin(n);
              return angleMode === "DEG" ? (r * 180) / Math.PI : r;
            }, "asin")
          : applyUnary((n) => Math.sin(toRadians(n, angleMode)), "sin"),
      className: "bg-zinc-700",
    },
    {
      label: isInverse ? "acos" : "cos",
      action: () =>
        isInverse
          ? applyUnary((n) => {
              const r = Math.acos(n);
              return angleMode === "DEG" ? (r * 180) / Math.PI : r;
            }, "acos")
          : applyUnary((n) => Math.cos(toRadians(n, angleMode)), "cos"),
      className: "bg-zinc-700",
    },
    {
      label: isInverse ? "atan" : "tan",
      action: () =>
        isInverse
          ? applyUnary((n) => {
              const r = Math.atan(n);
              return angleMode === "DEG" ? (r * 180) / Math.PI : r;
            }, "atan")
          : applyUnary((n) => Math.tan(toRadians(n, angleMode)), "tan"),
      className: "bg-zinc-700",
    },
    { label: "π", action: () => { setDisplay(String(Math.PI)); setIsNewInput(true); }, className: "bg-zinc-700" },

    { label: angleMode, action: () => setAngleMode((m) => (m === "DEG" ? "RAD" : "DEG")), className: "bg-zinc-700 text-amber-400 text-xs" },
    { label: isInverse ? "x³" : "x²", action: () => isInverse ? applyUnary((n) => n ** 3, "cube") : applyUnary((n) => n ** 2, "sqr"), className: "bg-zinc-700" },
    { label: isInverse ? "∛x" : "√x", action: () => isInverse ? applyUnary((n) => Math.cbrt(n), "∛") : applyUnary((n) => Math.sqrt(n), "√"), className: "bg-zinc-700" },
    { label: "xʸ", action: () => applyOperator("**"), className: "bg-zinc-700" },
    { label: isInverse ? "eˣ" : "ln", action: () => isInverse ? applyUnary((n) => Math.exp(n), "exp") : applyUnary((n) => Math.log(n), "ln"), className: "bg-zinc-700" },

    { label: "1/x", action: () => applyUnary((n) => 1 / n, "1/"), className: "bg-zinc-700" },
    { label: "|x|", action: () => applyUnary((n) => Math.abs(n), "abs"), className: "bg-zinc-700" },
    { label: "n!", action: () => applyUnary(factorial, "fact"), className: "bg-zinc-700" },
    { label: isInverse ? "10ˣ" : "log", action: () => isInverse ? applyUnary((n) => Math.pow(10, n), "10^") : applyUnary((n) => Math.log10(n), "log"), className: "bg-zinc-700" },
    { label: "⌫", action: backspace, className: "bg-zinc-700" },

    { label: "MC", action: () => setMemory(0), className: "bg-zinc-600 text-xs" },
    { label: "MR", action: () => { setDisplay(String(memory)); setIsNewInput(true); }, className: "bg-zinc-600 text-xs" },
    { label: "M+", action: () => setMemory((m) => m + currentValue), className: "bg-zinc-600 text-xs" },
    { label: "e", action: () => { setDisplay(String(Math.E)); setIsNewInput(true); }, className: "bg-zinc-700" },
    { label: "C", action: clear, className: "bg-red-600/80 hover:bg-red-500" },

    { label: "7", action: () => appendDigit("7") },
    { label: "8", action: () => appendDigit("8") },
    { label: "9", action: () => appendDigit("9") },
    { label: "÷", action: () => applyOperator("÷"), className: "bg-amber-600 hover:bg-amber-500" },
    { label: "%", action: () => applyUnary((n) => n / 100, "%"), className: "bg-zinc-700" },

    { label: "4", action: () => appendDigit("4") },
    { label: "5", action: () => appendDigit("5") },
    { label: "6", action: () => appendDigit("6") },
    { label: "×", action: () => applyOperator("×"), className: "bg-amber-600 hover:bg-amber-500" },
    { label: "(", action: () => { setExpression((prev) => prev + "("); setIsNewInput(true); }, className: "bg-zinc-700" },

    { label: "1", action: () => appendDigit("1") },
    { label: "2", action: () => appendDigit("2") },
    { label: "3", action: () => appendDigit("3") },
    { label: "−", action: () => applyOperator("-"), className: "bg-amber-600 hover:bg-amber-500" },
    { label: ")", action: () => { setExpression((prev) => prev + display + ")"); setIsNewInput(true); }, className: "bg-zinc-700" },

    { label: "0", action: () => appendDigit("0") },
    { label: ".", action: () => appendDigit(".") },
    { label: "±", action: toggleSign },
    { label: "+", action: () => applyOperator("+"), className: "bg-amber-600 hover:bg-amber-500" },
    { label: "=", action: evaluate, className: "bg-amber-500 hover:bg-amber-400 font-bold" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-4 text-zinc-300">
          Scientific Calculator
        </h1>

        <div className="bg-zinc-900 rounded-t-2xl px-4 pt-3 pb-1 min-h-[60px]">
          {recentHistory.slice(-3).map((h, i) => (
            <div key={i} className="text-xs text-zinc-500 text-right truncate">{h}</div>
          ))}
        </div>

        <div className="bg-zinc-900 px-4 pb-4">
          <div className="text-right text-sm text-zinc-500 min-h-[20px] font-mono">
            {expression || " "}
          </div>
          <div className="text-right text-4xl font-mono font-light text-white tracking-wide overflow-hidden text-ellipsis">
            {display}
          </div>
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <div className="flex gap-2">
              <span>{angleMode}</span>
              {isInverse && <span className="text-amber-500">INV</span>}
            </div>
            {memory !== 0 && <span>M = {memory}</span>}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-[1px] bg-zinc-900 rounded-b-2xl overflow-hidden p-[1px]">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`
                h-14 text-sm font-medium transition-all duration-100
                active:scale-95 active:brightness-125
                ${btn.className ?? "bg-zinc-800 hover:bg-zinc-700"}
                ${["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "±"].includes(btn.label) ? "text-white" : "text-zinc-200"}
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

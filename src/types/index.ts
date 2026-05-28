import type { LucideIcon } from "lucide-react";

export type AngleMode = "DEG" | "RAD";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  type: "scientific" | "programmer" | "converter" | "datetime" | "statistics" | "complex";
}

export type NumberBase = "DEC" | "HEX" | "OCT" | "BIN";

export interface ConversionCategory {
  name: string;
  icon: LucideIcon;
  units: ConversionUnit[];
}

export interface ConversionUnit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

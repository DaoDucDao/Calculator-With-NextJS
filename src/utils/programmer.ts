import type { NumberBase } from "@/types";

export function parseFromBase(value: string, base: NumberBase): number {
  const clean = value.replace(/\s/g, "");
  switch (base) {
    case "DEC": return parseInt(clean, 10);
    case "HEX": return parseInt(clean, 16);
    case "OCT": return parseInt(clean, 8);
    case "BIN": return parseInt(clean, 2);
  }
}

export function formatToBase(value: number, base: NumberBase): string {
  if (!isFinite(value) || isNaN(value)) return "Error";
  const int = Math.trunc(value);
  switch (base) {
    case "DEC": return int.toString(10);
    case "HEX": return int.toString(16).toUpperCase();
    case "OCT": return int.toString(8);
    case "BIN": return int.toString(2);
  }
}

export function formatBinaryGroups(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return padded.replace(/(.{4})/g, "$1 ").trim();
}

export function formatHexGroups(hex: string): string {
  const padded = hex.padStart(Math.ceil(hex.length / 2) * 2, "0");
  return padded.replace(/(.{2})/g, "$1 ").trim();
}

export function bitwiseOp(a: number, b: number, op: string): number {
  const ia = Math.trunc(a);
  const ib = Math.trunc(b);
  switch (op) {
    case "AND": return ia & ib;
    case "OR": return ia | ib;
    case "XOR": return ia ^ ib;
    case "NAND": return ~(ia & ib);
    case "NOR": return ~(ia | ib);
    case "<<": return ia << ib;
    case ">>": return ia >> ib;
    default: return 0;
  }
}

export function bitwiseNot(a: number): number {
  return ~Math.trunc(a);
}

export const BASE_DIGITS: Record<NumberBase, string[]> = {
  BIN: ["0", "1"],
  OCT: ["0", "1", "2", "3", "4", "5", "6", "7"],
  DEC: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  HEX: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"],
};

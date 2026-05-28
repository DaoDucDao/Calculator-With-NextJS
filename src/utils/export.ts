import type { HistoryEntry } from "@/types";

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function entriesToCSV(entries: HistoryEntry[]): string {
  const header = ["Type", "Expression", "Result", "Date", "Time"];
  const rows = entries.map((e) => {
    const d = new Date(e.timestamp);
    return [
      e.type,
      e.expression,
      e.result,
      d.toLocaleDateString("en-US"),
      d.toLocaleTimeString("en-US"),
    ].map(escapeCsv).join(",");
  });
  return [header.join(","), ...rows].join("\n");
}

export function entriesToJSON(entries: HistoryEntry[]): string {
  return JSON.stringify(
    entries.map((e) => ({
      ...e,
      datetime: new Date(e.timestamp).toISOString(),
    })),
    null,
    2
  );
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function timestampedFilename(prefix: string, ext: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  return `${prefix}-${stamp}.${ext}`;
}

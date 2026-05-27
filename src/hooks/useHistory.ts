"use client";

import { useCallback } from "react";
import type { HistoryEntry } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

const MAX_HISTORY = 100;

export function useHistory() {
  const [entries, setEntries, loaded] = useLocalStorage<HistoryEntry[]>(
    "calc-history",
    []
  );

  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      setEntries((prev) => [newEntry, ...prev].slice(0, MAX_HISTORY));
    },
    [setEntries]
  );

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, [setEntries]);

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [setEntries]
  );

  return { entries, loaded, addEntry, clearHistory, deleteEntry };
}

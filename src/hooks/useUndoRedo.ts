"use client";

import { useState, useCallback, useRef } from "react";

const MAX_HISTORY = 50;

export function useUndoRedo<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const currentRef = useRef<T>(initial);

  const record = useCallback((state: T) => {
    setPast((prev) => [...prev, currentRef.current].slice(-MAX_HISTORY));
    setFuture([]);
    currentRef.current = state;
  }, []);

  const undo = useCallback((): T | null => {
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, -1));
    setFuture((prev) => [currentRef.current, ...prev]);
    currentRef.current = previous;
    return previous;
  }, [past]);

  const redo = useCallback((): T | null => {
    if (future.length === 0) return null;
    const next = future[0];
    setPast((prev) => [...prev, currentRef.current]);
    setFuture((prev) => prev.slice(1));
    currentRef.current = next;
    return next;
  }, [future]);

  return {
    record,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}

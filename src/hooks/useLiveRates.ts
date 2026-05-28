"use client";

import { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "calc-fx-cache";
const TTL_MS = 60 * 60 * 1000;
const API_URL = "https://open.er-api.com/v6/latest/USD";

interface CachedRates {
  rates: Record<string, number>;
  fetchedAt: number;
  source: "live" | "cache";
}

export type RatesStatus = "loading" | "live" | "cached" | "stale" | "fallback";

export function useLiveRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [status, setStatus] = useState<RatesStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async (silent = false) => {
    if (!silent) setStatus("loading");
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.result !== "success" || !data.rates) {
        throw new Error("Invalid response");
      }
      const now = Date.now();
      setRates(data.rates);
      setFetchedAt(now);
      setStatus("live");
      const cache: CachedRates = {
        rates: data.rates,
        fetchedAt: now,
        source: "live",
      };
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch {
        // storage full / disabled — ignore
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fetch failed");
      setStatus("fallback");
    }
  }, []);

  useEffect(() => {
    let cached: CachedRates | null = null;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) cached = JSON.parse(raw) as CachedRates;
    } catch {
      // ignore
    }

    if (cached) {
      setRates(cached.rates);
      setFetchedAt(cached.fetchedAt);
      const age = Date.now() - cached.fetchedAt;
      if (age < TTL_MS) {
        setStatus("cached");
        return;
      }
      setStatus("stale");
    }

    fetchRates(!!cached);
  }, [fetchRates]);

  return {
    rates,
    fetchedAt,
    status,
    error,
    refresh: () => fetchRates(false),
  };
}

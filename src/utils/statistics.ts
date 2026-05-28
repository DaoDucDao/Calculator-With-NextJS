export function parseDataset(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !isNaN(n));
}

export function parsePairs(input: string): { x: number[]; y: number[] } {
  const x: number[] = [];
  const y: number[] = [];
  const lines = input.split(/\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const parts = line.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    if (parts.length >= 2) {
      x.push(parts[0]);
      y.push(parts[1]);
    }
  }
  return { x, y };
}

export interface DescriptiveStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  sampleVariance: number;
  sampleStdDev: number;
  q1: number;
  q3: number;
  iqr: number;
}

export function describe(data: number[]): DescriptiveStats | null {
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const sum = data.reduce((s, v) => s + v, 0);
  const mean = sum / n;

  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[(n - 1) / 2];

  const counts = new Map<number, number>();
  for (const v of data) counts.set(v, (counts.get(v) ?? 0) + 1);
  const maxCount = Math.max(...counts.values());
  const mode = maxCount === 1
    ? []
    : Array.from(counts.entries())
        .filter(([, c]) => c === maxCount)
        .map(([v]) => v)
        .sort((a, b) => a - b);

  const min = sorted[0];
  const max = sorted[n - 1];

  const sqDiffSum = data.reduce((s, v) => s + (v - mean) ** 2, 0);
  const variance = sqDiffSum / n;
  const stdDev = Math.sqrt(variance);
  const sampleVariance = n > 1 ? sqDiffSum / (n - 1) : 0;
  const sampleStdDev = Math.sqrt(sampleVariance);

  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);

  return {
    count: n,
    sum,
    mean,
    median,
    mode,
    min,
    max,
    range: max - min,
    variance,
    stdDev,
    sampleVariance,
    sampleStdDev,
    q1,
    q3,
    iqr: q3 - q1,
  };
}

function quantile(sorted: number[], p: number): number {
  const n = sorted.length;
  const pos = p * (n - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (pos - lo) * (sorted[hi] - sorted[lo]);
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function permutations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
  let result = 1;
  for (let i = 0; i < r; i++) result *= n - i;
  return result;
}

export function combinations(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
  const k = Math.min(r, n - r);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export interface LinearRegression {
  slope: number;
  intercept: number;
  r: number;
  r2: number;
  n: number;
}

export function linearRegression(x: number[], y: number[]): LinearRegression | null {
  if (x.length < 2 || x.length !== y.length) return null;
  const n = x.length;
  const xMean = x.reduce((s, v) => s + v, 0) / n;
  const yMean = y.reduce((s, v) => s + v, 0) / n;

  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - xMean;
    const dy = y[i] - yMean;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }

  if (sxx === 0) return null;
  const slope = sxy / sxx;
  const intercept = yMean - slope * xMean;
  const r = sxy / Math.sqrt(sxx * syy);
  return { slope, intercept, r, r2: r * r, n };
}

export function fmt(n: number, digits = 6): string {
  if (!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(digits)).toString();
}

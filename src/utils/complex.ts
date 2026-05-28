export interface Complex {
  re: number;
  im: number;
}

export const ZERO: Complex = { re: 0, im: 0 };

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function sub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

export function mul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function div(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) return { re: NaN, im: NaN };
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
}

export function magnitude(z: Complex): number {
  return Math.hypot(z.re, z.im);
}

export function argument(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

export function reciprocal(z: Complex): Complex {
  return div({ re: 1, im: 0 }, z);
}

export function negate(z: Complex): Complex {
  return { re: -z.re, im: -z.im };
}

export function square(z: Complex): Complex {
  return mul(z, z);
}

export function sqrt(z: Complex): Complex {
  const r = magnitude(z);
  const theta = argument(z);
  const sr = Math.sqrt(r);
  return { re: sr * Math.cos(theta / 2), im: sr * Math.sin(theta / 2) };
}

export function pow(z: Complex, n: number): Complex {
  const r = magnitude(z);
  const theta = argument(z);
  const rn = Math.pow(r, n);
  return { re: rn * Math.cos(n * theta), im: rn * Math.sin(n * theta) };
}

export function exp(z: Complex): Complex {
  const ea = Math.exp(z.re);
  return { re: ea * Math.cos(z.im), im: ea * Math.sin(z.im) };
}

export function ln(z: Complex): Complex {
  return { re: Math.log(magnitude(z)), im: argument(z) };
}

export function fromPolar(r: number, theta: number): Complex {
  return { re: r * Math.cos(theta), im: r * Math.sin(theta) };
}

export function fmt(n: number, digits = 6): string {
  if (!isFinite(n)) return "—";
  const rounded = parseFloat(n.toPrecision(digits));
  return Object.is(rounded, -0) ? "0" : rounded.toString();
}

export function format(z: Complex, digits = 6): string {
  if (!isFinite(z.re) || !isFinite(z.im)) return "—";
  const re = parseFloat(z.re.toPrecision(digits));
  const im = parseFloat(z.im.toPrecision(digits));
  if (im === 0) return fmt(re, digits);
  if (re === 0) return im === 1 ? "i" : im === -1 ? "−i" : `${fmt(im, digits)}i`;
  const sign = im >= 0 ? "+" : "−";
  const absIm = Math.abs(im);
  const imPart = absIm === 1 ? "i" : `${fmt(absIm, digits)}i`;
  return `${fmt(re, digits)} ${sign} ${imPart}`;
}

export function formatPolar(z: Complex, digits = 6): string {
  const r = magnitude(z);
  const theta = argument(z);
  return `${fmt(r, digits)} ∠ ${fmt(theta, digits)} rad`;
}

export function formatPolarDeg(z: Complex, digits = 6): string {
  const r = magnitude(z);
  const thetaDeg = (argument(z) * 180) / Math.PI;
  return `${fmt(r, digits)} ∠ ${fmt(thetaDeg, digits)}°`;
}

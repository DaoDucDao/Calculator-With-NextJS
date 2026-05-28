# Scientific Calculator Suite

A fully-featured, multi-mode calculator suite built with Next.js, React, and TypeScript. Works entirely client-side with localStorage persistence.

## Current Features

- **Scientific Calculator** - 20+ math functions, trig (with inverse), logs, powers, roots, constants, memory, keyboard support
- **Programmer Calculator** - HEX/DEC/OCT/BIN conversions, bitwise operations (AND, OR, XOR, NOT, shifts), configurable bit widths (8/16/32/64)
- **Unit Converter** - 8 categories (length, weight, temperature, area, volume, speed, time, data) with 40+ units
- **Currency Converter** - 28 currencies with live exchange rates (via exchangerate-api.com), 1-hour cache, manual refresh, and static fallback when offline
- **Date/Time Calculator** - Duration between dates, add/subtract time, business days, timezone conversions, world clock
- **Statistics Calculator** - Descriptive stats (mean, median, mode, std dev, variance, quartiles), combinatorics (n!, P(n,r), C(n,r)), linear regression with r and R²
- **Undo/Redo** - Step back and forward through expression edits (Ctrl+Z / Ctrl+Y) in Scientific and Programmer calculators
- **Theming** - 4 color themes (Dark, Light, Midnight, Sunset) with persistent selection
- **Calculation History** - Persistent history with filtering by type, date grouping, and stats
- **Export History** - Export calculations to CSV (for spreadsheets) or JSON (full data), respects active filter

## Roadmap

Planned features, in order of implementation:

1. **Matrix Calculator** - Add, subtract, multiply matrices, determinants, inverses, eigenvalues
2. **Equation Solver** - Linear, quadratic, cubic equations and systems of equations with step-by-step solutions
3. **Complex Number Support** - Operations on a + bi form for engineering use cases
4. **Calculus Tools** - Numerical differentiation, integration (trapezoidal/Simpson's rule), limits
5. **LaTeX/MathJax Rendering** - Render expressions with proper mathematical notation
6. **PWA Support** - Service worker + manifest for installable native-like app experience
7. **Accessibility Audit** - Screen reader labels, ARIA roles, focus management, high-contrast mode
8. **Unit Tests** - Test coverage for math utils, conversions, and programmer logic

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **localStorage** for client-side persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the calculator.

## Project Structure

```
src/
  app/            # Pages (scientific, programmer, converter, currency, datetime, history)
  components/     # React components (Calculator, Sidebar)
  hooks/          # Custom hooks (useHistory, useLocalStorage)
  types/          # TypeScript type definitions
  utils/          # Conversion, currency, and programmer utilities
```

## Deploy

Deploy on [Vercel](https://vercel.com/new) or any platform that supports Next.js.

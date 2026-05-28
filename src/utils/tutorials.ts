import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Hash,
  RotateCcw,
  Save,
  Keyboard,
  Binary,
  ToggleLeft,
  Eye,
  Ruler,
  ArrowUpDown,
  Banknote,
  RefreshCw,
  Wifi,
  Search,
  Timer,
  CalendarPlus,
  Globe,
  ChartBar,
  Dices,
  TrendingUp,
  Sigma,
  CircleDot,
  ChartScatter,
  Filter,
  Download,
  Trash2,
  Palette,
  ScrollText,
} from "lucide-react";

export interface TutorialStep {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface Tutorial {
  pageName: string;
  steps: TutorialStep[];
}

export const TUTORIALS: Record<string, Tutorial> = {
  "/": {
    pageName: "Scientific Calculator",
    steps: [
      {
        title: "Doing a basic calculation",
        Icon: Calculator,
        description:
          "Tap digits to type a number (e.g. 12), then an operator (+ − × ÷), then more digits (e.g. 56), then = to see the result. Use ( and ) for grouping, like 2 × (3 + 4).",
      },
      {
        title: "Trigonometry, powers, and logs",
        Icon: Hash,
        description:
          "Tap sin, cos, tan, ln, log, x², √x, n!, or |x| and the function is applied to whatever is currently on the display. For inverse trig (asin, acos, atan), tap INV first — INV also turns log into 10ˣ and ln into eˣ.",
      },
      {
        title: "Degrees vs. radians",
        Icon: ToggleLeft,
        description:
          "Trig functions need to know the angle unit. Tap the DEG/RAD button to switch. The current mode is shown right under the display so you always know which one is active.",
      },
      {
        title: "Memory: M+, MR, MC",
        Icon: Save,
        description:
          "Need to reuse a number later? Tap M+ to save the current value to memory. Tap MR to recall it into the display, or MC to clear memory. When memory holds a non-zero value, it's shown under the display.",
      },
      {
        title: "Undo a mistake",
        Icon: RotateCcw,
        description:
          "Did something wrong? Tap ↩ Undo (or press Ctrl+Z) to step back. Use Redo ↪ (Ctrl+Y) to re-apply. You can step back through the last 50 actions.",
      },
      {
        title: "Keyboard shortcuts",
        Icon: Keyboard,
        description:
          "You can type with your keyboard instead of tapping: 0–9 for digits, + − * / for operators, Enter to evaluate, Backspace to erase one character, Esc to clear. The full shortcut list is at the bottom of the sidebar.",
      },
      {
        title: "Saved automatically to History",
        Icon: ScrollText,
        description:
          "Every result is recorded automatically. Open History from the sidebar to see, filter, or export all your past calculations.",
      },
    ],
  },
  "/programmer": {
    pageName: "Programmer Calculator",
    steps: [
      {
        title: "What this calculator is for",
        Icon: Binary,
        description:
          "Programmer mode works with whole numbers in four different bases — hexadecimal (HEX), decimal (DEC), octal (OCT), and binary (BIN). It's designed for working with bits, masks, and low-level code.",
      },
      {
        title: "Switching the active base",
        Icon: ToggleLeft,
        description:
          "Tap HEX, DEC, OCT, or BIN at the top to switch the base you're entering numbers in. The current base is highlighted with the accent color. Your value is preserved when you switch.",
      },
      {
        title: "Seeing all four bases at once",
        Icon: Eye,
        description:
          "Whatever number is on the display, you can see its representation in all four bases at the same time — listed right under the display. No need to convert manually.",
      },
      {
        title: "Bitwise operations",
        Icon: Hash,
        description:
          "Tap AND, OR, XOR, NOT, << (left shift), or >> (right shift) to do bit-level operations. The flow is: enter first number, tap the operator, enter second number, then = to get the result.",
      },
      {
        title: "Bit width matters",
        Icon: ToggleLeft,
        description:
          "Tap 8, 16, 32, or 64 above the binary visualization to choose how many bits to use. This affects how negative numbers wrap and how the binary representation is shown.",
      },
      {
        title: "Grey buttons aren't usable",
        Icon: Calculator,
        description:
          "Digits not valid in the current base are greyed out. In OCT, 8 and 9 are disabled. In BIN, only 0 and 1 are clickable. Switch bases first if you need those digits.",
      },
    ],
  },
  "/converter": {
    pageName: "Unit Converter",
    steps: [
      {
        title: "Step 1 — pick a category",
        Icon: Ruler,
        description:
          "At the top, choose what kind of thing you're converting: Length, Weight, Temperature, Area, Volume, Speed, Time, or Data. Each category has its own set of units (m, kg, °C, etc.).",
      },
      {
        title: "Step 2 — pick From and To units",
        Icon: ArrowUpDown,
        description:
          "Use the two dropdowns to choose units. The top one is what you're converting from; the bottom is what you're converting to.",
      },
      {
        title: "Step 3 — type the value",
        Icon: Calculator,
        description:
          "Type a number in the From input. The conversion happens instantly — no Enter key needed. The result appears in green next to the To unit.",
      },
      {
        title: "Reverse with the swap button",
        Icon: ArrowUpDown,
        description:
          "Tap the ⇅ button between the two units to swap them. The current result becomes the new input value, so you can immediately convert back.",
      },
      {
        title: "Quick reference grid",
        Icon: Eye,
        description:
          "Below your conversion, you'll see your value automatically converted to up to 6 other units in the same category. Useful for getting a quick overview.",
      },
      {
        title: "Save to History",
        Icon: Save,
        description:
          "Tap 'Save to History' to record this conversion. You can review or export it later from the History page.",
      },
    ],
  },
  "/currency": {
    pageName: "Currency Converter",
    steps: [
      {
        title: "Pick the two currencies",
        Icon: Banknote,
        description:
          "Choose what you're converting From (top dropdown) and To (bottom dropdown). 28 currencies are supported, listed by code and full name.",
      },
      {
        title: "Type the amount",
        Icon: Calculator,
        description:
          "Enter how much you want to convert. The result updates instantly as you type. Both directional rates (1 X = ? Y, 1 Y = ? X) are shown below.",
      },
      {
        title: "How rates work",
        Icon: Wifi,
        description:
          "Rates are fetched live from exchangerate-api.com and cached for 1 hour. The colored dot under the title shows the status: green = live or cached, amber = stale/loading, red = network failed (using static fallback rates).",
      },
      {
        title: "Force a fresh fetch",
        Icon: RefreshCw,
        description:
          "Tap '↻ Refresh' to ignore the cache and fetch the very latest rates right now. The icon spins while loading.",
      },
      {
        title: "Browse all rates",
        Icon: Search,
        description:
          "Below the main converter, you'll find a table showing your amount converted into every other currency at once. Use the Search box in the header to filter by code or name. Tap any row to set it as your To currency.",
      },
    ],
  },
  "/datetime": {
    pageName: "Date / Time Calculator",
    steps: [
      {
        title: "Three modes — pick a tab",
        Icon: ToggleLeft,
        description:
          "At the top you'll see three tabs: Duration (how long between two dates), Add / Subtract (offset a date by some amount), and Timezone (same moment in a different zone).",
      },
      {
        title: "Duration tab",
        Icon: Timer,
        description:
          "Pick a Start date+time and an End date+time. The result shows the gap as years/months/days/hours/minutes/seconds, plus totals: total days, weeks, and business days (excludes Saturday and Sunday).",
      },
      {
        title: "Add / Subtract tab",
        Icon: CalendarPlus,
        description:
          "Pick a base date. Choose '+ Add' or '− Subtract', enter an amount (like 90), then a unit (years, months, weeks, days, hours, or minutes). The resulting date appears immediately.",
      },
      {
        title: "Timezone tab",
        Icon: Globe,
        description:
          "Enter a date+time in one timezone and see the same moment in another. Pick From and To timezones from 20 supported regions. The ⇅ button swaps them.",
      },
      {
        title: "World clock",
        Icon: Globe,
        description:
          "At the bottom of the Timezone tab, the World Clock panel shows the current time right now in 10 major cities around the world.",
      },
    ],
  },
  "/statistics": {
    pageName: "Statistics Calculator",
    steps: [
      {
        title: "Three modes — pick a tab",
        Icon: ToggleLeft,
        description:
          "Tabs at the top: Descriptive (analyze a dataset), Combinatorics (factorials, P, C), and Regression (linear fit on x,y pairs).",
      },
      {
        title: "Descriptive — describe a dataset",
        Icon: ChartBar,
        description:
          "Paste numbers separated by commas, spaces, or newlines (e.g. '1, 2, 3' or '1 2 3'). Below the input you'll see count, sum, mean, median, mode, range, min, max, std dev (population & sample), variance, and quartiles Q1/Q3/IQR.",
      },
      {
        title: "Combinatorics — counting problems",
        Icon: Dices,
        description:
          "Enter values for n and r. Three cards appear: n! (factorial), P(n,r) (permutations — order matters), and C(n,r) (combinations — order doesn't matter). Each card has its own Save button if you only want to record one.",
      },
      {
        title: "Regression — find a trend line",
        Icon: TrendingUp,
        description:
          "Paste x,y data pairs one per line (e.g. '1, 2' on each line). You'll get the best-fit line y = mx + b, along with correlation coefficient r and R² to measure how well the line fits the data.",
      },
    ],
  },
  "/complex": {
    pageName: "Complex Number Calculator",
    steps: [
      {
        title: "Two ways to write a complex number",
        Icon: Sigma,
        description:
          "A complex number can be written as a + bi (rectangular form) or r ∠ θ (polar form). Use the tabs at the top to choose which form you're entering. Results are always shown in both forms regardless.",
      },
      {
        title: "Enter z₁ and z₂",
        Icon: Calculator,
        description:
          "Fill the two rows: z₁ in the top, z₂ in the bottom. For rectangular: enter the real part and imaginary part separately. For polar: enter magnitude r and angle θ (in radians).",
      },
      {
        title: "Pick the operation",
        Icon: Hash,
        description:
          "Below the inputs, tap +, −, ×, or ÷ to choose what to compute between z₁ and z₂. The result updates instantly. Only one operation is active at a time — it's highlighted.",
      },
      {
        title: "Reading the result",
        Icon: CircleDot,
        description:
          "The big number in the result card is the rectangular form. Under that you'll see |z| (magnitude/modulus), arg(z) (angle in radians), and the polar form (with angle in degrees).",
      },
      {
        title: "Functions of z₁",
        Icon: Hash,
        description:
          "Below the visualization, six buttons compute single-input functions on z₁: conjugate z̄, reciprocal 1/z, z², √z, eᶻ, and ln(z). Click any to save that specific result to history. Below those, three info cards show |z₁|, arg(z₁), and z₁ in polar form.",
      },
      {
        title: "Complex plane visualization",
        Icon: ChartScatter,
        description:
          "The SVG plot shows all three numbers on the complex plane: z₁ (amber), z₂ (cyan), and the result (accent color). Each is drawn as a vector from the origin to a labeled dot. Axes scale automatically so everything fits.",
      },
    ],
  },
  "/history": {
    pageName: "History",
    steps: [
      {
        title: "Everything in one place",
        Icon: ScrollText,
        description:
          "Every calculation from every calculator is recorded here automatically — newest at the top. You don't have to do anything to save them.",
      },
      {
        title: "Filter by calculator type",
        Icon: Filter,
        description:
          "At the top is a row of 7 cards — one per calculator type plus 'All'. Each shows the count of entries. Tap a card to filter to just that type. The active filter has a colored ring around it.",
      },
      {
        title: "Grouped by date",
        Icon: ScrollText,
        description:
          "Entries are grouped by the day they happened. Each row shows the type (color badge), the time, the expression you entered, and the result.",
      },
      {
        title: "Export your history",
        Icon: Download,
        description:
          "Tap Export to download what's currently visible (after applying your filter). Choose CSV for spreadsheet apps like Excel or Google Sheets, or JSON for full data with ISO timestamps.",
      },
      {
        title: "Delete entries",
        Icon: Trash2,
        description:
          "Tap the × on the right side of any entry to remove just that one. Tap 'Clear All' to wipe everything — a confirmation dialog will pop up first to prevent accidents.",
      },
    ],
  },
};

export const GLOBAL_TUTORIAL: Tutorial = {
  pageName: "Welcome to CalcSuite",
  steps: [
    {
      title: "Eight calculators in one app",
      Icon: Calculator,
      description:
        "Use the sidebar on the left to switch between Scientific, Programmer, Unit Converter, Currency, Date/Time, Statistics, Complex Numbers, and your History.",
    },
    {
      title: "All results saved automatically",
      Icon: ScrollText,
      description:
        "Every calculation, across every calculator, is recorded to the History page. You can filter, search, and export them to CSV or JSON — nothing gets lost.",
    },
    {
      title: "Themes",
      Icon: Palette,
      description:
        "Near the bottom of the sidebar, switch between Dark, Light, Midnight, and Sunset themes. Your choice is remembered the next time you open the app.",
    },
    {
      title: "Open this tutorial anytime",
      Icon: Hash,
      description:
        "Look for the 'How to use this page' button in the top-right corner of every page. It opens a tutorial specific to the calculator you're currently on.",
    },
  ],
};

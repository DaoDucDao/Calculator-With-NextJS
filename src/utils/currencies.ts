import type { CurrencyRate } from "@/types";

export const CURRENCY_RATES: CurrencyRate[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.5 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 1325.0 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", rate: 25435.0 },
  { code: "THB", name: "Thai Baht", symbol: "฿", rate: 34.5 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.53 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.88 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.1 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", rate: 4.72 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", rate: 55.8 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 15650.0 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 4.97 },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", rate: 17.15 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 10.42 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", rate: 10.55 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", rate: 1.63 },
  { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.6 },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 91.5 },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", rate: 31.5 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", rate: 7.82 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 3.67 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 3.75 },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", rate: 30.2 },
];

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  liveRates?: Record<string, number>
): number {
  const from = CURRENCY_RATES.find((c) => c.code === fromCode);
  const to = CURRENCY_RATES.find((c) => c.code === toCode);
  if (!from || !to) return 0;
  const fromRate = liveRates?.[fromCode] ?? from.rate;
  const toRate = liveRates?.[toCode] ?? to.rate;
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

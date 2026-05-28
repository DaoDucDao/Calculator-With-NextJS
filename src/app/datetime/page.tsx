"use client";

import { useState, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, CalendarPlus, Globe, ArrowUpDown, Plus, Minus, type LucideIcon } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import HelpField from "@/components/HelpField";
import {
  TIMEZONES,
  calculateDuration,
  addToDate,
  formatDatetime,
  formatDateForInput,
  formatTimeForInput,
} from "@/utils/datetime";

type Tab = "duration" | "add-subtract" | "timezone";

const TABS: { key: Tab; label: string; Icon: LucideIcon }[] = [
  { key: "duration", label: "Duration", Icon: Timer },
  { key: "add-subtract", label: "Add / Subtract", Icon: CalendarPlus },
  { key: "timezone", label: "Timezone", Icon: Globe },
];

const UNITS = ["years", "months", "weeks", "days", "hours", "minutes"] as const;

export default function DateTimePage() {
  const { addEntry } = useHistory();
  const [tab, setTab] = useState<Tab>("duration");

  const now = new Date();
  const [startDate, setStartDate] = useState(formatDateForInput(now));
  const [startTime, setStartTime] = useState(formatTimeForInput(now));
  const [endDate, setEndDate] = useState(formatDateForInput(now));
  const [endTime, setEndTime] = useState(formatTimeForInput(now));

  const [addDate, setAddDate] = useState(formatDateForInput(now));
  const [addTime, setAddTime] = useState(formatTimeForInput(now));
  const [addAmount, setAddAmount] = useState("1");
  const [addUnit, setAddUnit] = useState<(typeof UNITS)[number]>("days");
  const [addMode, setAddMode] = useState<"add" | "subtract">("add");

  const [tzFrom, setTzFrom] = useState(0);
  const [tzTo, setTzTo] = useState(15);
  const [tzDate, setTzDate] = useState(formatDateForInput(now));
  const [tzTime, setTzTime] = useState(formatTimeForInput(now));

  const duration = useMemo(() => {
    const s = new Date(`${startDate}T${startTime}`);
    const e = new Date(`${endDate}T${endTime}`);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    return calculateDuration(s, e);
  }, [startDate, startTime, endDate, endTime]);

  const addResult = useMemo(() => {
    const base = new Date(`${addDate}T${addTime}`);
    if (isNaN(base.getTime())) return null;
    const amt = parseInt(addAmount);
    if (isNaN(amt)) return null;
    return addToDate(base, addMode === "subtract" ? -amt : amt, addUnit);
  }, [addDate, addTime, addAmount, addUnit, addMode]);

  const tzResult = useMemo(() => {
    const d = new Date(`${tzDate}T${tzTime}`);
    if (isNaN(d.getTime())) return null;
    const fromTz = TIMEZONES[tzFrom];
    const toTz = TIMEZONES[tzTo];
    return {
      from: formatDatetime(d, fromTz.iana),
      to: formatDatetime(d, toTz.iana),
    };
  }, [tzDate, tzTime, tzFrom, tzTo]);

  const saveDuration = () => {
    if (!duration) return;
    const parts: string[] = [];
    if (duration.years) parts.push(`${duration.years}y`);
    if (duration.months) parts.push(`${duration.months}mo`);
    if (duration.days) parts.push(`${duration.days}d`);
    if (duration.hours) parts.push(`${duration.hours}h`);
    if (duration.minutes) parts.push(`${duration.minutes}m`);
    if (duration.seconds) parts.push(`${duration.seconds}s`);
    const result = parts.length ? parts.join(" ") : "0d";
    addEntry({
      expression: `${startDate} ${startTime} → ${endDate} ${endTime}`,
      result: `${result} (${duration.totalDays} days)`,
      type: "datetime",
    });
  };

  const saveAddResult = () => {
    if (!addResult) return;
    const op = addMode === "add" ? "+" : "−";
    addEntry({
      expression: `${addDate} ${addTime} ${op} ${addAmount} ${addUnit}`,
      result: addResult.toLocaleString(),
      type: "datetime",
    });
  };

  const saveTzResult = () => {
    if (!tzResult) return;
    addEntry({
      expression: `${tzDate} ${tzTime} ${TIMEZONES[tzFrom].label}`,
      result: `${tzResult.to} (${TIMEZONES[tzTo].label})`,
      type: "datetime",
    });
  };

  const labelClass = "text-xs text-fg-muted font-medium uppercase tracking-wider";
  const inputClass =
    "w-full bg-raised border border-line rounded-xl px-4 py-3 text-sm text-fg-2 focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const selectClass =
    "w-full bg-raised border border-line rounded-xl px-4 py-3 text-sm text-fg-2 focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none";
  const btnClass =
    "w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6 text-fg-2">
          Date / Time Calculator
        </h1>

        <Tabs.Root value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <Tabs.List className="flex gap-1.5 mb-6 justify-center">
            {TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <Tabs.Trigger
                  key={t.key}
                  value={t.key}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive ? "text-white" : "bg-raised text-fg-3 hover:bg-muted"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="datetime-tab-active"
                      className="absolute inset-0 bg-accent rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <t.Icon className="relative w-3 h-3" />
                  <span className="relative">{t.label}</span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          <div className="bg-panel rounded-2xl p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {tab === "duration" && (
                  <>
                    <HelpField
                      label="Start Date & Time"
                      title="Start point"
                      content="The earlier moment. Pick the date on the left and the time on the right. If start is after end, the calculator still computes the correct positive duration."
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
                      </div>
                    </HelpField>

                    <div className="flex justify-center text-fg-faint">
                      <ArrowUpDown className="w-5 h-5" />
                    </div>

                    <HelpField
                      label="End Date & Time"
                      title="End point"
                      content="The later moment. The Duration result below shows the gap as years/months/days/h/m/s plus totals (total days, weeks, business days)."
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
                      </div>
                    </HelpField>

                    {duration && (
                      <HelpField
                        label="Duration"
                        title="What this means"
                        content="The big tags show the calendar-aware breakdown (e.g. '1y 2mo 3d'). Below them: total days (just subtracts dates), weeks (totalDays ÷ 7), and business days (excludes Saturdays and Sundays)."
                        className="bg-raised rounded-xl p-4 space-y-3"
                      >
                        <div className="flex flex-wrap gap-2">
                          {duration.years > 0 && (
                            <span className="bg-accent/15 text-accent-fg px-3 py-1 rounded-lg text-sm font-mono">{duration.years}y</span>
                          )}
                          {duration.months > 0 && (
                            <span className="bg-accent/15 text-accent-fg px-3 py-1 rounded-lg text-sm font-mono">{duration.months}mo</span>
                          )}
                          <span className="bg-accent/15 text-accent-fg px-3 py-1 rounded-lg text-sm font-mono">{duration.days}d</span>
                          {(duration.hours > 0 || duration.minutes > 0 || duration.seconds > 0) && (
                            <span className="bg-accent/15 text-accent-fg px-3 py-1 rounded-lg text-sm font-mono">
                              {duration.hours}h {duration.minutes}m {duration.seconds}s
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line">
                          <div className="text-center">
                            <p className="text-lg font-mono text-fg-2">{duration.totalDays}</p>
                            <p className="text-[10px] text-fg-muted">Total Days</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-mono text-fg-2">{duration.weeks}</p>
                            <p className="text-[10px] text-fg-muted">Weeks</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-mono text-fg-2">{duration.businessDays}</p>
                            <p className="text-[10px] text-fg-muted">Business Days</p>
                          </div>
                        </div>
                      </HelpField>
                    )}

                    <button onClick={saveDuration} disabled={!duration} className={btnClass}>
                      Save to History
                    </button>
                  </>
                )}

                {tab === "add-subtract" && (
                  <>
                    <HelpField
                      label="Base Date & Time"
                      title="Base date"
                      content="The starting point you'll add or subtract from. Pick Add/Subtract below, then set how much."
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} className={inputClass} />
                        <input type="time" value={addTime} onChange={(e) => setAddTime(e.target.value)} className={inputClass} />
                      </div>
                    </HelpField>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setAddMode("add")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                          addMode === "add" ? "bg-emerald-600 text-white" : "bg-raised text-fg-3 hover:bg-muted"
                        }`}
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                      <button
                        onClick={() => setAddMode("subtract")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                          addMode === "subtract" ? "bg-red-600 text-white" : "bg-raised text-fg-3 hover:bg-muted"
                        }`}
                      >
                        <Minus className="w-4 h-4" /> Subtract
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <HelpField
                        label="Amount"
                        title="How much to add/subtract"
                        content="An integer count of the unit on the right. For example, 90 with unit 'days' offsets the base date by ±90 days."
                      >
                        <input
                          type="number"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          min="0"
                          className={inputClass + " font-mono text-right"}
                        />
                      </HelpField>
                      <HelpField
                        label="Unit"
                        title="Time unit"
                        content="What the Amount is measured in: years, months, weeks, days, hours, or minutes. Calendar-aware — adding 1 month to Jan 31 gives Feb 28/29."
                      >
                        <select
                          value={addUnit}
                          onChange={(e) => setAddUnit(e.target.value as typeof addUnit)}
                          className={selectClass}
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u.charAt(0).toUpperCase() + u.slice(1)}
                            </option>
                          ))}
                        </select>
                      </HelpField>
                    </div>

                    {addResult && (
                      <HelpField
                        label="Result"
                        title="Computed date"
                        content="The base date shifted by the chosen amount and unit. Hit 'Save to History' to record it."
                        className="bg-raised rounded-xl p-4 space-y-1"
                      >
                        <p className="text-lg font-mono text-accent-fg mt-1">
                          {addResult.toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm font-mono text-fg-3 mt-0.5">
                          {addResult.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </HelpField>
                    )}

                    <button onClick={saveAddResult} disabled={!addResult} className={btnClass}>
                      Save to History
                    </button>
                  </>
                )}

                {tab === "timezone" && (
                  <>
                    <HelpField
                      label="Date & Time"
                      title="The moment to convert"
                      content="A specific date and time, interpreted in the 'From Timezone' selected below. The same moment is then displayed in the 'To Timezone'."
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" value={tzDate} onChange={(e) => setTzDate(e.target.value)} className={inputClass} />
                        <input type="time" value={tzTime} onChange={(e) => setTzTime(e.target.value)} className={inputClass} />
                      </div>
                    </HelpField>

                    <HelpField
                      label="From Timezone"
                      title="Source timezone"
                      content="What timezone the date/time above is in. The list shows the standard UTC offset (DST is handled automatically by the IANA database)."
                    >
                      <select
                        value={tzFrom}
                        onChange={(e) => setTzFrom(Number(e.target.value))}
                        className={selectClass}
                      >
                        {TIMEZONES.map((tz, i) => (
                          <option key={i} value={i}>
                            {tz.label} ({tz.offset})
                          </option>
                        ))}
                      </select>
                    </HelpField>

                    <div className="flex justify-center">
                      <motion.button
                        onClick={() => {
                          setTzFrom(tzTo);
                          setTzTo(tzFrom);
                        }}
                        whileTap={{ rotate: 180, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="w-10 h-10 rounded-full bg-raised border border-line flex items-center justify-center text-fg-3 hover:text-accent-fg hover:border-accent/50 transition-colors"
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <HelpField
                      label="To Timezone"
                      title="Target timezone"
                      content="The timezone you want to see the same moment in. The result below shows both: the From moment and the same moment in the To zone."
                    >
                      <select
                        value={tzTo}
                        onChange={(e) => setTzTo(Number(e.target.value))}
                        className={selectClass}
                      >
                        {TIMEZONES.map((tz, i) => (
                          <option key={i} value={i}>
                            {tz.label} ({tz.offset})
                          </option>
                        ))}
                      </select>
                    </HelpField>

                    {tzResult && (
                      <div className="bg-raised rounded-xl p-4 space-y-3">
                        <div>
                          <p className="text-[10px] text-fg-muted font-medium uppercase tracking-wider">
                            {TIMEZONES[tzFrom].label}
                          </p>
                          <p className="text-sm font-mono text-fg-2 mt-0.5">{tzResult.from}</p>
                        </div>
                        <div className="border-t border-line pt-3">
                          <p className="text-[10px] text-fg-muted font-medium uppercase tracking-wider">
                            {TIMEZONES[tzTo].label}
                          </p>
                          <p className="text-lg font-mono text-accent-fg mt-0.5">{tzResult.to}</p>
                        </div>
                      </div>
                    )}

                    <button onClick={saveTzResult} disabled={!tzResult} className={btnClass}>
                      Save to History
                    </button>

                    <HelpField
                      label="World Clock"
                      title="Live clock"
                      content="The current time right now in 10 major cities. Useful for quick reference while planning meetings. Not interactive — just a snapshot when the page loads."
                      className="border-t border-line-soft pt-4 space-y-2"
                    >
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {TIMEZONES.slice(0, 10).map((tz, i) => {
                          const nowInTz = new Date().toLocaleTimeString("en-US", {
                            timeZone: tz.iana,
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          });
                          return (
                            <div key={i} className="flex justify-between bg-raised/50 rounded-lg px-3 py-2">
                              <span className="text-xs text-fg-muted">{tz.label}</span>
                              <span className="text-xs text-fg-2 font-mono">{nowInTz}</span>
                            </div>
                          );
                        })}
                      </div>
                    </HelpField>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}

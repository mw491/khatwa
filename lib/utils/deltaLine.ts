// lib/utils/deltaLine.ts
import type { PrayerTimes } from "@/lib/hooks/useTodayTimings";

const parseJamaatToDate = (time: string | null, base: Date): Date | null => {
  if (!time) return null;
  const [hoursStr, minutesStr] = time.trim().split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const getTargetPrayer = (
  pt: PrayerTimes | undefined,
  now: Date
): { name: string; target: Date; isPast: boolean } | null => {
  if (!pt) return null;
  const entries = [
    { name: "fajr", t: parseJamaatToDate(pt.fajr.jamat, now) },
    { name: "dhuhr", t: parseJamaatToDate(pt.dhuhr.jamat, now) },
    { name: "asr", t: parseJamaatToDate(pt.asr.jamat, now) },
    { name: "maghrib", t: parseJamaatToDate(pt.maghrib.jamat, now) },
    { name: "isha", t: parseJamaatToDate(pt.isha.jamat, now) },
  ].filter((e): e is { name: string; t: Date } => !!e.t);

  if (entries.length === 0) return null;

  entries.sort((a, b) => a.t.getTime() - b.t.getTime());

  const nowMs = now.getTime();
  const TEN_MIN = 10 * 60 * 1000;

  const past = entries.filter((e) => e.t.getTime() <= nowMs).pop();
  if (past && nowMs - past.t.getTime() <= TEN_MIN) {
    return { name: past.name, target: past.t, isPast: true };
  }

  const next = entries.find((e) => e.t.getTime() > nowMs);
  if (next) {
    return { name: next.name, target: next.t, isPast: false };
  }

  // after last prayer → next day
  const first = entries[0];
  const t = new Date(first.t);
  t.setDate(t.getDate() + 1);
  return { name: first.name, target: t, isPast: false };
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatDelta = (target: Date, now: Date) => {
  const diffMs = Math.abs(target.getTime() - now.getTime());
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  return `${pad2(m)}:${pad2(s)}`;
};

const capitalize = (s: string) =>
  s && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export function computeDeltaLine(
  prayerTimes: PrayerTimes | undefined,
  now = new Date()
): string {
  const info = getTargetPrayer(prayerTimes, now);
  if (!info) return "—";
  return `${capitalize(info.name)} ${
    info.isPast
      ? `Jamaat ${formatDelta(info.target, now)} ago`
      : `Jamaat in ${formatDelta(info.target, now)}`
  }`;
}

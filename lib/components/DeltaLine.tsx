import { useTodayTimings, type PrayerTimes } from "@/lib/hooks/useTodayTimings";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// Helpers for computing real-time delta using only jamaat times
const parseJamaatToDate = (time: string | null, base: Date): Date | null => {
  if (!time) return null;
  const parts = time.trim().split(":");
  if (parts.length !== 2) return null;
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
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

  // After last prayer: show delta to the first prayer of tomorrow
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

export default function DeltaLine() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load selected mosque's prayer times
  const { data: timings } = useTodayTimings();
  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const mosque = timings?.find((t) => t._id === selectedMosqueID);
  const prayerTimes = mosque?.prayer_times;

  // Compute real-time delta to next or current prayer (using jamaat only)
  const info = getTargetPrayer(prayerTimes, currentTime);
  const deltaLine = info
    ? `${capitalize(info.name)} ${
        info.isPast
          ? `Jamaat ${formatDelta(info.target, currentTime)} ago`
          : `Jamaat in ${formatDelta(info.target, currentTime)}`
      }`
    : "—";

  return (
    <View className="w-full items-center my-8 py-8 max-w-96">
      <Text className="text-4xl text-center text-gray-900 dark:text-white font-mono font-bold">
        {deltaLine}
      </Text>
    </View>
  );
}

// useDeltaLine.ts
import { useEffect, useState } from "react";
import { useTodayTimings } from "@/lib/hooks/useTodayTimings";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import { computeDeltaLine } from "@/lib/utils/deltaLine";

export function useDeltaLine() {
  const [now, setNow] = useState(new Date());
  const { data: timings } = useTodayTimings();
  const selectedMosqueID = useSelectedMosqueStore((s) => s.selectedMosqueID);
  const mosque = timings?.find((t) => t._id === selectedMosqueID);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return computeDeltaLine(mosque?.prayer_times, now);
}

import {
  getCurrentOrNextPrayer,
  type Timings,
} from "@/lib/hooks/useTodayTimings";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import React from "react";
import { type WidgetTaskHandlerProps } from "react-native-android-widget";
import { JamaatTimes } from "./JamaatTimesWidget";

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  JamaatTimes: JamaatTimes,
};

// Fetch today's timings without React hooks (compatible with widget runtime)
async function getTodayTimings(): Promise<Timings[] | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    const res = await fetch("https://khatwa-backend.vercel.app/", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return (await res.json()) as Timings[];
  } catch (error) {
    console.error("Failed to fetch timings:", error);
    return undefined;
  }
}

// Read from Zustand store without React hooks
function getSelectedMosqueID(): string {
  try {
    return useSelectedMosqueStore.getState().selectedMosqueID;
  } catch {
    return "";
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_RESIZED":
    case "WIDGET_UPDATE":
      const now = new Date();
      const timings = await getTodayTimings();
      const selectedMosqueID = getSelectedMosqueID();
      const mosque = timings?.find((t) => t._id === selectedMosqueID);
      const mosqueName = mosque?.mosque_name ?? "";
      const prayerTimes = mosque?.prayer_times;
      const currentPrayer = prayerTimes
        ? getCurrentOrNextPrayer(prayerTimes, now)
        : ({ name: "", isNext: false } as { name: string; isNext: boolean });

      props.renderWidget(
        <Widget
          mosqueName={mosqueName}
          prayerTimes={prayerTimes}
          currentPrayer={currentPrayer}
          now={now.toLocaleTimeString()}
        />
      );
      break;

    case "WIDGET_DELETED":
      break;

    case "WIDGET_CLICK":
      break;

    default:
      break;
  }
}

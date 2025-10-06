import React from "react";
import { FlexWidget, SvgWidget, TextWidget } from "react-native-android-widget";

const locationSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="192" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`;

interface PrayerTimeWidgetProps {
  prayer: string;
  time?: string | null;
  currentPrayer: { name: string; isNext: boolean };
}

function PrayerCell({ prayer, time, currentPrayer }: PrayerTimeWidgetProps) {
  const isCurrent = currentPrayer.name === prayer.toLowerCase();

  return (
    <FlexWidget
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isCurrent ? "#60a5fa44" : "#F3F4F600",
        borderRadius: 8,
        padding: 4,
        margin: 2,
        flex: 1,
      }}
    >
      <TextWidget
        text={prayer}
        style={{
          fontSize: 12,
          color: "#111827",
          fontWeight: isCurrent ? "700" : "500",
        }}
      />
      <TextWidget
        text={time ?? "—"}
        style={{
          fontSize: 16,
          color: "#111827",
          fontWeight: isCurrent ? "700" : "500",
        }}
      />
    </FlexWidget>
  );
}

export interface TimingsWidgetProps {
  mosqueName?: string;
  prayerTimes?: {
    fajr: { starts: string | null; jamat: string | null };
    dhuhr: { starts: string | null; jamat: string | null };
    asr: { starts: string | null; jamat: string | null };
    maghrib: { starts: string | null; jamat: string | null };
    isha: { starts: string | null; jamat: string | null };
    jumah_1: string | null;
    jumah_2: string | null;
  };
  currentPrayer: { name: string; isNext: boolean };
  now: string;
}

export function JamaatTimes({
  mosqueName,
  prayerTimes,
  currentPrayer,
  now,
}: TimingsWidgetProps) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 12,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: "row",
          flexGap: 2,
          width: "match_parent",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <SvgWidget svg={locationSvg} style={{ height: 20, width: 20 }} />
        <TextWidget
          // text={mosqueName ? mosqueName : "Mosque"}
          text={now}
          style={{
            fontSize: 20,
            color: "#111827",
            fontWeight: "700",
          }}
        />
      </FlexWidget>

      {/* Prayer rows */}
      <FlexWidget
        style={{
          flexDirection: "row",
          width: "match_parent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PrayerCell
          prayer="Fajr"
          time={prayerTimes?.fajr.jamat ?? null}
          currentPrayer={currentPrayer}
        />
        <PrayerCell
          prayer="Dhuhr"
          time={prayerTimes?.dhuhr.jamat ?? null}
          currentPrayer={currentPrayer}
        />
        <PrayerCell
          prayer="Asr"
          time={prayerTimes?.asr.jamat ?? null}
          currentPrayer={currentPrayer}
        />
        <PrayerCell
          prayer="Maghrib"
          time={prayerTimes?.maghrib.jamat ?? null}
          currentPrayer={currentPrayer}
        />
        <PrayerCell
          prayer="Isha"
          time={prayerTimes?.isha.jamat ?? null}
          currentPrayer={currentPrayer}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

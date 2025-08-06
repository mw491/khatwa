import { View, Text, TouchableOpacity } from "react-native";
import {
  useTodayTimings,
  getCurrentOrNextPrayer,
} from "@/lib/hooks/useTodayTimings";
import { useMosqueStore } from "@/lib/store/mosqueStore";
import { router } from "expo-router";

export default function Timings() {
  const { data: timings, isLoading, error } = useTodayTimings();
  if (isLoading) return <Text>Loading...</Text>;
  if (error || !timings) return <Text>Error: {error?.message}</Text>;

  const selectedMosqueIndex = useMosqueStore(
    (state) => state.selectedMosqueIndex
  );

  const currentPrayer = getCurrentOrNextPrayer(
    timings[selectedMosqueIndex].prayer_times
  );

  const renderPrayerRow = (
    prayerName: string,
    displayName: string,
    time: string
  ) => {
    const isCurrentOrNext = currentPrayer.name === prayerName;
    const isCurrent = isCurrentOrNext && !currentPrayer.isNext;

    return (
      <View
        className={`flex-row justify-between rounded-xl p-4 border-2 border-transparent ${
          isCurrentOrNext
            ? isCurrent
              ? "bg-emerald-600"
              : "bg-neutral-700 border-emerald-400"
            : "bg-neutral-700"
        }`}
      >
        <Text
          className={`text-2xl ${isCurrentOrNext ? "text-white font-bold" : "text-white"}`}
        >
          {displayName}
        </Text>
        <Text
          className={`text-2xl ${isCurrentOrNext ? "text-white font-bold" : "text-white"}`}
        >
          {time}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <TouchableOpacity
        className="bg-neutral-700 min-w-96 rounded-xl p-8 mt-[-32px] mb-5 elevation-xl"
        onPress={() => router.push("/mosques")}
      >
        <Text className="text-2xl text-white text-center font-bold">
          {timings[selectedMosqueIndex].mosque_name}
        </Text>
      </TouchableOpacity>

      <View className="min-w-96 gap-5">
        {renderPrayerRow(
          "fajr",
          "Fajr",
          timings[selectedMosqueIndex].prayer_times.fajr
        )}
        {renderPrayerRow(
          "dhuhr",
          "Dhuhr",
          timings[selectedMosqueIndex].prayer_times.dhuhr
        )}
        {renderPrayerRow(
          "asr",
          "Asr",
          timings[selectedMosqueIndex].prayer_times.asr
        )}
        {renderPrayerRow(
          "maghrib",
          "Maghrib",
          timings[selectedMosqueIndex].prayer_times.maghrib
        )}
        {renderPrayerRow(
          "isha",
          "Isha",
          timings[selectedMosqueIndex].prayer_times.isha
        )}
      </View>
    </View>
  );
}

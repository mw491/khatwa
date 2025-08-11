import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import {
  useTodayTimings,
  getCurrentOrNextPrayer,
} from "@/lib/hooks/useTodayTimings";
import { useMosqueStore } from "@/lib/store/mosqueStore";
import { router } from "expo-router";

export default function Timings() {
  const { data: timings, isLoading, error } = useTodayTimings();
  const selectedMosqueIndex = useMosqueStore(
    (state) => state.selectedMosqueIndex
  );
  const timesOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading && !error && timings) {
      Animated.timing(timesOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      timesOpacity.setValue(0);
    }
  }, [isLoading, error, timings, timesOpacity]);

  const prayerTimes = timings?.[selectedMosqueIndex]?.prayer_times;
  const currentPrayer = prayerTimes
    ? getCurrentOrNextPrayer(prayerTimes)
    : ({ name: "", isNext: false } as { name: string; isNext: boolean });

  // const renderPrayerRow = (
  //   prayerName: string,
  //   displayName: string,
  //   time: string
  // ) => {
  //   const isCurrentOrNext = currentPrayer.name === prayerName;
  //   const isCurrent = isCurrentOrNext && !currentPrayer.isNext;

  //   return (
  //     <View
  //       className={`flex-row justify-between rounded-xl p-4 border-2 border-transparent ${
  //         isCurrentOrNext
  //           ? isCurrent
  //             ? "bg-emerald-600"
  //             : "bg-neutral-700 border-emerald-400"
  //           : "bg-neutral-700"
  //       }`}
  //     >
  //       <Text
  //         className={`text-2xl ${isCurrentOrNext ? "text-white font-bold" : "text-white"}`}
  //       >
  //         {displayName}
  //       </Text>
  //       <Text
  //         className={`text-2xl ${isCurrentOrNext ? "text-white font-bold" : "text-white"}`}
  //       >
  //         {time}
  //       </Text>
  //     </View>
  //   );
  // };

  const renderJumahCard = (displayName: string, time: string) => {
    return (
      <View className="bg-neutral-700 flex-row justify-between rounded-xl p-4 border-2 border-transparent">
        <Text className="text-2xl text-white">{displayName}</Text>
        <Text className="text-2xl text-white">{time}</Text>
      </View>
    );
  };

  const renderPrayerCard = (
    prayerName: string,
    displayName: string,
    athanTime: string,
    iqamahTime: string,
    loading: boolean
  ) => {
    const isCurrentOrNext = !loading && currentPrayer.name === prayerName;
    const isCurrent = isCurrentOrNext && !currentPrayer.isNext;

    return (
      <View
        className={`rounded-xl p-4 border-2 flex-row items-center justify-between ${
          isCurrentOrNext
            ? isCurrent
              ? "bg-emerald-600 border-emerald-400"
              : "bg-neutral-700 border-emerald-400"
            : "bg-neutral-700 border-neutral-700"
        }`}
      >
        <Text className={`text-3xl font-bold text-white`}>{displayName}</Text>
        <View className="flex-row gap-5">
          <View className="items-center">
            <Text className="text-md text-white">Athan</Text>
            {loading ? (
              <View className="h-6 w-20 bg-neutral-600 rounded mt-1" />
            ) : (
              <Animated.Text
                style={{ opacity: timesOpacity }}
                className="text-2xl text-white"
              >
                {athanTime}
              </Animated.Text>
            )}
          </View>
          <View className="items-center">
            <Text className="text-md text-white font-bold">Iqamah</Text>
            {loading ? (
              <View className="h-6 w-20 bg-neutral-600 rounded mt-1" />
            ) : (
              <Animated.Text
                style={{ opacity: timesOpacity }}
                className="text-2xl text-white font-bold"
              >
                {iqamahTime}
              </Animated.Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <TouchableOpacity
        className="bg-neutral-800 border-emerald-400 border-2 min-w-96 rounded-xl p-8 mt-[-32px] mb-5 elevation-xl"
        onPress={() => router.push("/mosques")}
      >
        {isLoading || !timings ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#10b981" />
            <Text className="text-white text-center font-bold ml-3">
              Loading...
            </Text>
          </View>
        ) : (
          <Text className="text-2xl text-white text-center font-bold">
            {timings[selectedMosqueIndex].mosque_name}
          </Text>
        )}
      </TouchableOpacity>

      {error && (
        <View className="w-full items-center mb-5">
          <View className="bg-neutral-800 border-red-400 border-2 min-w-96 rounded-xl p-4 items-center">
            <Text className="text-white text-center">{`Error: ${error?.message ?? "Unable to load"}`}</Text>
          </View>
        </View>
      )}

      <View className="min-w-96 gap-5">
        {renderPrayerCard(
          "fajr",
          "Fajr",
          prayerTimes?.fajr.starts ?? "",
          prayerTimes?.fajr.jamat ?? "",
          isLoading || !timings
        )}
        {renderPrayerCard(
          "dhuhr",
          "Dhuhr",
          prayerTimes?.dhuhr.starts ?? "",
          prayerTimes?.dhuhr.jamat ?? "",
          isLoading || !timings
        )}
        {renderPrayerCard(
          "asr",
          "Asr",
          prayerTimes?.asr.starts ?? "",
          prayerTimes?.asr.jamat ?? "",
          isLoading || !timings
        )}
        {renderPrayerCard(
          "maghrib",
          "Maghrib",
          prayerTimes?.maghrib.starts ?? "",
          prayerTimes?.maghrib.jamat ?? "",
          isLoading || !timings
        )}
        {renderPrayerCard(
          "isha",
          "Isha",
          prayerTimes?.isha.starts ?? "",
          prayerTimes?.isha.jamat ?? "",
          isLoading || !timings
        )}
        {prayerTimes?.jumah_1 &&
          renderJumahCard(
            prayerTimes?.jumah_2 ? "Jumah 1" : "Jumah",
            prayerTimes?.jumah_1 ?? ""
          )}
        {prayerTimes?.jumah_2 &&
          renderJumahCard("Jumah 2", prayerTimes?.jumah_2 ?? "")}
      </View>
    </View>
  );
}

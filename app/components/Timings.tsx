import {
  getCurrentOrNextPrayer,
  useTodayTimings,
} from "@/lib/hooks/useTodayTimings";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Timings() {
  const { data: timings, isLoading, error, isError } = useTodayTimings();
  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const timesOpacity = useRef(new Animated.Value(0)).current;
  const [now, setNow] = useState(new Date());

  // Check if we have data (either fresh or cached)
  const hasData = !!timings;
  // Only show loading if we have no data at all
  const shouldShowLoading = isLoading && !hasData;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (hasData) {
      animation = Animated.timing(timesOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      });
      animation.start();
    } else {
      timesOpacity.setValue(0);
    }
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [hasData, timesOpacity]);

  // Real-time tick so current/next prayer updates without reload
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const mosque = timings?.find((timing) => timing._id === selectedMosqueID);
  const prayerTimes = mosque?.prayer_times;
  const currentPrayer = prayerTimes
    ? getCurrentOrNextPrayer(prayerTimes, now)
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
  //             ? "bg-neutral-600"
  //             : "bg-neutral-700 border-neutral-400"
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
      <View className="bg-gray-100 dark:bg-neutral-800 flex-row justify-between rounded-3xl p-4 border-2 border-gray-200 dark:border-neutral-700">
        <Text className="text-2xl text-gray-900 dark:text-white">
          {displayName}
        </Text>
        <Text className="text-2xl text-gray-900 dark:text-white">{time}</Text>
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
        className={`rounded-3xl p-4 border-2 flex-row items-center justify-between ${
          isCurrentOrNext
            ? isCurrent
              ? "bg-gray-200 dark:bg-neutral-900 border-gray-400 dark:border-neutral-400"
              : "bg-gray-100 dark:bg-neutral-800 border-gray-400 dark:border-neutral-400"
            : "bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
        }`}
      >
        <Text className={`text-3xl font-bold text-gray-900 dark:text-white`}>
          {displayName}
        </Text>
        <View className="flex-row gap-5">
          <View className="items-center">
            <Text className="text-md text-gray-700 dark:text-white">Athan</Text>
            {loading ? (
              <View className="h-6 w-20 bg-gray-200 dark:bg-neutral-600 rounded mt-1" />
            ) : (
              <Animated.Text
                style={{ opacity: timesOpacity }}
                className="text-2xl text-gray-900 dark:text-white"
              >
                {athanTime}
              </Animated.Text>
            )}
          </View>
          <View className="items-center">
            <Text className="text-md text-gray-700 dark:text-white font-bold">
              Iqamah
            </Text>
            {loading ? (
              <View className="h-6 w-20 bg-gray-200 dark:bg-neutral-600 rounded mt-1" />
            ) : (
              <Animated.Text
                style={{ opacity: timesOpacity }}
                className="text-2xl text-gray-900 dark:text-white font-bold"
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
        className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-400 border-2 max-w-96 rounded-3xl p-8 mt-[-32px] mb-5 elevation-xl"
        onPress={() => router.push("/mosques")}
      >
        {shouldShowLoading ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#10b981" />
            <Text className="text-gray-900 dark:text-white text-center font-bold ml-3">
              Loading...
            </Text>
          </View>
        ) : (
          <Text className="text-2xl text-gray-900 dark:text-white text-center font-bold">
            {mosque?.mosque_name}
          </Text>
        )}
      </TouchableOpacity>

      {isError && error && (
        <View className="w-full items-center mb-5">
          <View className="bg-white dark:bg-neutral-800 border-red-400 border-2 min-w-96 rounded-3xl p-4 items-center">
            <Text className="text-red-600 dark:text-red-400 text-center">{`Error: ${error?.message ?? "Unable to load"}`}</Text>
          </View>
        </View>
      )}

      <View className="min-w-96 gap-5">
        {renderPrayerCard(
          "fajr",
          "Fajr",
          prayerTimes?.fajr.starts ?? "",
          prayerTimes?.fajr.jamat ?? "",
          shouldShowLoading
        )}
        {renderPrayerCard(
          "dhuhr",
          "Dhuhr",
          prayerTimes?.dhuhr.starts ?? "",
          prayerTimes?.dhuhr.jamat ?? "",
          shouldShowLoading
        )}
        {renderPrayerCard(
          "asr",
          "Asr",
          prayerTimes?.asr.starts ?? "",
          prayerTimes?.asr.jamat ?? "",
          shouldShowLoading
        )}
        {renderPrayerCard(
          "maghrib",
          "Maghrib",
          prayerTimes?.maghrib.starts ?? "",
          prayerTimes?.maghrib.jamat ?? "",
          shouldShowLoading
        )}
        {renderPrayerCard(
          "isha",
          "Isha",
          prayerTimes?.isha.starts ?? "",
          prayerTimes?.isha.jamat ?? "",
          shouldShowLoading
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

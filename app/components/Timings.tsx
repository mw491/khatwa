import { useHaptics } from "@/lib/hooks/useHaptics";
import {
  getCurrentOrNextPrayer,
  useTodayTimings,
} from "@/lib/hooks/useTodayTimings";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

export default function Timings() {
  const { data: timings, isLoading, error, isError } = useTodayTimings();
  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const timesOpacity = useRef(new Animated.Value(0)).current;
  const [now, setNow] = useState(new Date());
  const haptics = useHaptics();

  // Check if we have data (either fresh or cached)
  const hasData = !!timings;
  // Only show loading if we have no data at all
  const shouldShowLoading = isLoading && !hasData;

  // Add haptic feedback for errors
  useEffect(() => {
    if (isError && error) {
      haptics.error();
    }
  }, [isError, error, haptics]);

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
      <View className="flex-row flex-grow justify-between p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
        <Text className="font-medium text-xl text-gray-900 dark:text-white">
          {displayName}
        </Text>
        <Text className="text-lg text-gray-900 dark:text-white">{time}</Text>
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
        className={`rounded-2xl p-3 flex-row items-center justify-between ${
          isCurrentOrNext
            ? isCurrent
              ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-500"
              : "bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-500"
            : "bg-gray-50 dark:bg-neutral-800/50"
        }`}
      >
        <View className="flex-row items-center gap-2">
          {isCurrentOrNext && (
            <View
              className={`w-2 h-2 rounded-full ${
                isCurrent
                  ? "bg-blue-500 dark:bg-blue-400"
                  : "bg-amber-500 dark:bg-amber-400"
              }`}
            />
          )}
          <Text
            className={`text-xl ${
              isCurrentOrNext
                ? isCurrent
                  ? "font-bold text-blue-900 dark:text-blue-100"
                  : "font-bold text-amber-900 dark:text-amber-100"
                : "font-medium text-gray-900 dark:text-white"
            }`}
          >
            {displayName}
          </Text>
          {isCurrentOrNext && (
            <Text
              className={`text-xs font-medium ${
                isCurrent
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              {isCurrent ? "NOW" : "NEXT"}
            </Text>
          )}
        </View>
        <View className="flex-row gap-4">
          <View className="items-center">
            <Text className="text-xs text-gray-600 dark:text-gray-300">
              Athan
            </Text>
            {loading ? (
              <View className="h-5 w-16 bg-gray-200 dark:bg-neutral-600 rounded mt-1" />
            ) : (
              <Animated.Text
                style={{ opacity: timesOpacity }}
                className={`text-lg ${
                  isCurrentOrNext
                    ? isCurrent
                      ? "text-blue-900 dark:text-blue-100 font-bold"
                      : "text-amber-900 dark:text-amber-100 font-bold"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {athanTime}
              </Animated.Text>
            )}
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              Iqamah
            </Text>
            {loading ? (
              <View className="h-5 w-16 bg-gray-200 dark:bg-neutral-600 rounded mt-1" />
            ) : (
              <Animated.Text
                style={{ opacity: timesOpacity }}
                className={`text-lg font-medium ${
                  isCurrentOrNext
                    ? isCurrent
                      ? "text-blue-900 dark:text-blue-100 font-bold"
                      : "text-amber-900 dark:text-amber-100 font-bold"
                    : "text-gray-900 dark:text-white"
                }`}
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
      {isError && error && (
        <View className="w-full items-center mb-5">
          <View className="bg-white dark:bg-neutral-800 border-red-400 border-2 min-w-96 rounded-3xl p-4 items-center">
            <Text className="text-red-600 dark:text-red-400 text-center">{`Error: ${error?.message ?? "Unable to load"}`}</Text>
          </View>
        </View>
      )}

      <View className="min-w-96 gap-2">
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
        <View className="flex-row justify-between gap-2">
          {prayerTimes?.jumah_1 &&
            renderJumahCard(
              prayerTimes?.jumah_2 ? "Jumah 1" : "Jumah",
              prayerTimes?.jumah_1 ?? ""
            )}
          {prayerTimes?.jumah_2 &&
            renderJumahCard("Jumah 2", prayerTimes?.jumah_2 ?? "")}
        </View>
      </View>
    </View>
  );
}

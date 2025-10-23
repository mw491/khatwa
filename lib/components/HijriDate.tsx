import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function HijriDate() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatHijriDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      // Fallback to Gregorian if Islamic calendar isn't available
      try {
        return new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(date);
      } catch {
        // Final minimal fallback
        return date.toDateString();
      }
    }
  };

  return (
    <View className="w-full items-center mb-2">
      <View className="flex-row items-center w-full max-w-72">
        <View className="flex-1 h-px bg-gray-300 dark:bg-neutral-600" />
        <Text className="text-lg text-gray-600 dark:text-white/80 font-mono mx-4">
          {formatHijriDate(currentTime)}
        </Text>
        <View className="flex-1 h-px bg-gray-300 dark:bg-neutral-600" />
      </View>
    </View>
  );
}

import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatGregorianDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatHijriDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <View className="bg-emerald-700 justify-center items-center w-full pt-16 pb-16 rounded-b-3xl">
      <Text className="text-4xl font-bold text-white font-mono mb-6">
        Prayer Times
      </Text>
      <Text className="text-2xl text-white/80 font-mono mb-2">
        {formatGregorianDate(currentTime)}
      </Text>
      <Text className="text-2xl text-white/80 font-mono mb-2">
        {formatHijriDate(currentTime)}
      </Text>
      <Text className="text-2xl text-white font-mono font-bold">
        {formatTime(currentTime)}
      </Text>
    </View>
  );
}

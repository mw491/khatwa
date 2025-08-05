import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Text className="text-6xl font-bold text-white font-mono mt-10">
      {formatTime(currentTime)}
    </Text>
  );
}

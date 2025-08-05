import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import timingsData from "../../assets/timings.json";

interface PrayerTime {
  prayer: string;
  athan: string;
  jamaat: string;
}

interface TimingData {
  Date: number;
  Day: string;
  "Fajr Beg.": string;
  "Fajr Jamat": string;
  Sunrise: string;
  "Zuhr Beg.": string;
  "Zuhr Jamat": string;
  "Asr Beg.": string;
  "Asr Jamat": string;
  "Magrib Beg.": string;
  "Magrib Jamat": string;
  "Isha Beg.": string;
  "Isha Jamat": string;
}

export default function DataTable() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentDate, setCurrentDate] = useState<number>(0);

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  const loadPrayerTimes = () => {
    try {
      const today = new Date();
      const currentDay = today.getDate();
      setCurrentDate(currentDay);

      // Find the timing data for today's date
      const todayTimings = timingsData.find(
        (timing: TimingData) => timing.Date === currentDay
      );

      if (todayTimings) {
        const realPrayerTimes: PrayerTime[] = [
          {
            prayer: "Fajr",
            athan: todayTimings["Fajr Beg."],
            jamaat: todayTimings["Fajr Jamat"],
          },
          {
            prayer: "Sunrise",
            athan: todayTimings["Sunrise"],
            jamaat: "",
          },
          {
            prayer: "Zuhr",
            athan: todayTimings["Zuhr Beg."],
            jamaat: todayTimings["Zuhr Jamat"],
          },
          {
            prayer: "Asr",
            athan: todayTimings["Asr Beg."],
            jamaat: todayTimings["Asr Jamat"],
          },
          {
            prayer: "Maghrib",
            athan: todayTimings["Magrib Beg."],
            jamaat: todayTimings["Magrib Jamat"],
          },
          {
            prayer: "Isha",
            athan: todayTimings["Isha Beg."],
            jamaat: todayTimings["Isha Jamat"],
          },
        ];
        setPrayerTimes(realPrayerTimes);
      } else {
        console.error("No timing data found for date:", currentDay);
        // Fallback to static data if no match found
        const staticPrayerTimes: PrayerTime[] = [
          { prayer: "Fajr", athan: "05:30", jamaat: "06:00" },
          { prayer: "Dhuhr", athan: "12:30", jamaat: "13:00" },
          { prayer: "Asr", athan: "15:45", jamaat: "16:15" },
          { prayer: "Maghrib", athan: "18:30", jamaat: "19:00" },
          { prayer: "Isha", athan: "20:00", jamaat: "20:30" },
        ];
        setPrayerTimes(staticPrayerTimes);
      }
    } catch (error) {
      console.error("Error loading prayer times:", error);
    }
  };

  return (
    <View className="mt-10 w-4/5">
      <View className="flex-row">
        <View className="flex-1 border border-transparent p-6">
          <Text className="text-white text-center"></Text>
        </View>
        <View className="flex-1 border border-transparent p-6">
          <Text className="text-white text-center">Athan</Text>
        </View>
        <View className="flex-1 border border-transparent p-6">
          <Text className="text-white text-center">Jamaat</Text>
        </View>
      </View>

      {prayerTimes.map((prayer, index) => (
        <View key={index} className="flex-row">
          <View className="flex-1 border border-transparent p-6">
            <Text className="text-white text-center">{prayer.prayer}</Text>
          </View>
          <View className="flex-1 border border-transparent p-6">
            <Text className="text-white text-center">{prayer.athan}</Text>
          </View>
          <View className="flex-1 border border-transparent p-6">
            <Text className="text-white text-center">{prayer.jamaat}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

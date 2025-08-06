import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Client, Databases } from "react-native-appwrite";

// Appwrite client configuration
const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6891e76e002c8518d8cc")
  .setPlatform("com.mw491.khatwa");

const db = new Databases(client);

// Appwrite data structure based on the console log
interface AppwriteDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  mosque: string;
  ahtan: string[];
  iqama: string[];
}

interface PrayerTime {
  prayer: string;
  athan: string;
  jamaat: string;
}

export default function DataTable() {
  const [mosque, setMosque] = useState<string>("");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await db.listDocuments(
        "6891e7970021c7c70afb", // Database ID
        "6891e7c2001d400e3d4e" // Collection ID
      );

      console.log("Appwrite response:", response);

      if (response.documents && response.documents.length > 0) {
        const document = response.documents[0] as unknown as AppwriteDocument;

        // Map the prayer names to the arrays from Appwrite
        const prayerNames = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"];

        const times: PrayerTime[] = prayerNames.map((prayer, index) => ({
          prayer,
          athan: document.ahtan[index] || "",
          jamaat: document.iqama[index] || "",
        }));

        setPrayerTimes(times);
        setMosque(document.mosque);
      } else {
        setError("No prayer times data found");
        // Fallback to static data
        setPrayerTimes([
          { prayer: "Fajr", athan: "05:30", jamaat: "06:00" },
          { prayer: "Sunrise", athan: "07:00", jamaat: "" },
          { prayer: "Zuhr", athan: "12:30", jamaat: "13:00" },
          { prayer: "Asr", athan: "15:45", jamaat: "16:15" },
          { prayer: "Maghrib", athan: "18:30", jamaat: "19:00" },
          { prayer: "Isha", athan: "20:00", jamaat: "20:30" },
        ]);
      }
    } catch (err) {
      console.error("Error loading prayer times:", err);
      setError("Failed to load prayer times");
      // Fallback to static data
      setPrayerTimes([
        { prayer: "Fajr", athan: "05:30", jamaat: "06:00" },
        { prayer: "Sunrise", athan: "07:00", jamaat: "" },
        { prayer: "Zuhr", athan: "12:30", jamaat: "13:00" },
        { prayer: "Asr", athan: "15:45", jamaat: "16:15" },
        { prayer: "Maghrib", athan: "18:30", jamaat: "19:00" },
        { prayer: "Isha", athan: "20:00", jamaat: "20:30" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="mt-10 w-4/5">
        <Text className="text-white text-center">Loading prayer times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-10 w-4/5">
        <Text className="text-white text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="w-4/5">
      <View className="bg-neutral-700 rounded-xl p-4 mt-[-16px] mb-4 elevation-lg">
        <Text className="text-2xl text-white text-center font-semibold">
          {mosque}
        </Text>
      </View>

      {/* Header */}
      <View className="flex-row">
        <View className="flex-1 border border-transparent p-6">
          <Text className="text-white text-center font-semibold">Prayer</Text>
        </View>
        <View className="flex-1 border border-transparent p-6">
          <Text className="text-white text-center font-semibold">Athan</Text>
        </View>
        <View className="flex-1 border border-transparent p-6">
          <Text className="text-white text-center font-semibold">Jamaat</Text>
        </View>
      </View>

      {/* Prayer times rows */}
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

import { useTodayTimings } from "@/lib/hooks/useTodayTimings";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Dropdown from "./Dropdown";
import { router } from "expo-router";

export default function Header() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Load selected mosque's prayer times
  const { data: timings, isLoading } = useTodayTimings();
  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const mosque = timings?.find((t) => t._id === selectedMosqueID);

  // Check if we have data (either fresh or cached)
  const hasData = !!timings;
  // Only show loading if we have no data at all
  const shouldShowLoading = isLoading && !hasData;

  return (
    <View className="relative flex-row items-center w-full pt-5 pb-3 mb-5 gap-2 max-w-96">
      <TouchableOpacity
        className="bg-white dark:bg-neutral-800 rounded-full elevation-xl relative flex-1"
        onPress={() => router.push("/mosques")}
      >
        {shouldShowLoading ? (
          <View className="flex-row gap-2 p-4 items-center justify-center">
            <ActivityIndicator
              size="small"
              color={isDark ? "#ffffff" : "#111827"}
            />
            <Text className="text-gray-900 dark:text-white text-center font-bold ml-3 max-w-90">
              Loading...
            </Text>
          </View>
        ) : (
          <View className="flex-row gap-2 p-4 items-center justify-center">
            <Text className="text-gray-900 dark:text-white text-center font-bold">
              {mosque?.mosque_name}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#ffffff" : "#111827"}
            />
          </View>
        )}
      </TouchableOpacity>
      <Dropdown />
    </View>
  );
}

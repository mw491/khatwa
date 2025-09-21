import { useTodayTimings } from "@/lib/hooks/useTodayTimings";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

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
    <View className="w-full pt-5 pb-3">
      <View className="bg-white dark:bg-neutral-800 min-w-96 rounded-full p-4 mb-5 mx-auto elevation-xl">
        {shouldShowLoading ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator
              size="small"
              color={isDark ? "#ffffff" : "#111827"}
            />
            <Text className="text-gray-900 dark:text-white text-center font-bold ml-3">
              Loading...
            </Text>
          </View>
        ) : (
          <View className="flex-row gap-2 items-center justify-center">
            <Ionicons
              name="location"
              size={20}
              color={isDark ? "#ffffff" : "#111827"}
            />
            <Text className="text-lg text-gray-900 dark:text-white text-center font-bold">
              {mosque?.mosque_name}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

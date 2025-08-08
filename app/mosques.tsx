import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTodayTimings } from "@/lib/hooks/useTodayTimings";
import { useMosqueStore } from "@/lib/store/mosqueStore";
import { router } from "expo-router";

export default function MosquesScreen() {
  const { data: timings, isLoading, error } = useTodayTimings();
  const selectedMosqueIndex = useMosqueStore(
    (state) => state.selectedMosqueIndex
  );
  const setSelectedMosqueIndex = useMosqueStore(
    (state) => state.setSelectedMosqueIndex
  );

  const renderLoadingCard = () => (
    <View className="rounded-xl p-6 bg-neutral-700 items-center">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="text-white text-center mt-3">Loading...</Text>
    </View>
  );
  const renderErrorCard = () => (
    <View className="rounded-xl p-6 bg-neutral-700 items-center border-2 border-red-400">
      <Text className="text-white text-center">{`Error: ${error?.message ?? "Unable to load"}`}</Text>
    </View>
  );

  const handleMosqueSelect = (index: number) => {
    setSelectedMosqueIndex(index);
    router.back();
  };

  return (
    <View className="flex-1 bg-neutral-800">
      {/* Header */}
      <View className="bg-emerald-700 justify-center items-center w-full pt-24 pb-16 rounded-b-3xl">
        <Text className="text-4xl font-bold text-white font-mono mb-6">
          Mosques
        </Text>
        <Text className="text-lg text-white/80 text-center px-8">
          Select a mosque to view its prayer times
        </Text>
      </View>

      {/* Mosque Cards */}
      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          {isLoading && renderLoadingCard()}
          {!isLoading && error && renderErrorCard()}
          {!isLoading &&
            timings &&
            timings.map((mosque, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMosqueSelect(index)}
                className={`rounded-xl p-6 ${
                  index === selectedMosqueIndex
                    ? "bg-emerald-600 border-2 border-emerald-400"
                    : "bg-neutral-700"
                }`}
              >
                <Text
                  className={`text-2xl font-semibold text-center ${
                    index === selectedMosqueIndex ? "text-white" : "text-white"
                  }`}
                >
                  {mosque.mosque_name}
                </Text>
                {index === selectedMosqueIndex && (
                  <Text className="text-emerald-200 text-center mt-2 text-sm">
                    Currently Selected
                  </Text>
                )}
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

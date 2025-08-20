import { useTodayTimings, type Timings } from "@/lib/hooks/useTodayTimings";
import {
  usePinnedMosquesStore,
  useSelectedMosqueStore,
} from "@/lib/store/mosqueStore";
import { Ionicons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function MosquesScreen() {
  const colorScheme = useColorScheme();
  const { data: timings, isLoading, error } = useTodayTimings();
  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const setselectedMosqueID = useSelectedMosqueStore(
    (state) => state.setSelectedMosqueID
  );

  const pinnedMosques = usePinnedMosquesStore((state) => state.pinnedMosques);
  const togglePinnedMosque = usePinnedMosquesStore(
    (state) => state.togglePinnedMosque
  );

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // Memoize filtered and sorted data to prevent recalculation
  const filteredTimings = useMemo(() => {
    if (!timings) return [];

    let filtered = timings;

    // Apply search filter if query exists
    if (deferredQuery) {
      const queryLower = deferredQuery.toLowerCase();
      filtered = timings.filter((timing) =>
        timing.mosque_name.toLowerCase().includes(queryLower)
      );
    }

    // Sort: selected mosque first, then pinned mosques, then the rest
    return filtered.sort((a, b) => {
      // Selected mosque comes first
      if (a._id === selectedMosqueID) return -1;
      if (b._id === selectedMosqueID) return 1;

      // Pinned mosques come second
      const aIsPinned = pinnedMosques.includes(a._id);
      const bIsPinned = pinnedMosques.includes(b._id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      // Rest remain in original order
      return 0;
    });
  }, [timings, deferredQuery, selectedMosqueID, pinnedMosques]);

  const renderLoadingCard = () => (
    <View className="rounded-xl p-6 bg-white dark:bg-neutral-700 items-center">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="text-gray-900 dark:text-white text-center mt-3">
        Loading...
      </Text>
    </View>
  );
  const renderErrorCard = () => (
    <View className="rounded-xl p-6 bg-white dark:bg-neutral-700 items-center border-2 border-red-400">
      <Text className="text-red-600 dark:text-red-400 text-center">{`Error: ${error?.message ?? "Unable to load"}`}</Text>
    </View>
  );

  const handleMosqueSelect = (id: string) => {
    setselectedMosqueID(id);
    router.back();
  };

  const renderItem = ({ item: mosque }: { item: Timings }) => (
    <TouchableOpacity
      onPress={() => handleMosqueSelect(mosque._id)}
      activeOpacity={0.5}
      className={`bg-gray-100 dark:bg-neutral-700 rounded-xl p-6 flex-row items-center gap-3 ${mosque._id === selectedMosqueID
        ? "border-2 border-gray-300 dark:border-neutral-400"
        : ""
        }`}
    >
      <Text
        className={`text-2xl font-semibold text-left flex-1 text-gray-900 dark:text-white`}
        numberOfLines={3}
      >
        {mosque.mosque_name}
      </Text>
      <TouchableOpacity
        onPress={() => togglePinnedMosque(mosque._id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="star"
          size={24}
          color={
            pinnedMosques.includes(mosque._id)
              ? "#facc15"
              : colorScheme === "dark"
                ? "#ffffff"
                : "#9ca3af"
          }
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Memoize the ItemSeparatorComponent
  const ItemSeparatorComponent = useCallback(
    () => <View style={{ height: 16 }} />,
    []
  );

  // Memoize the ListHeaderComponent
  const ListHeaderComponent = useCallback(
    () => (
      <View style={{ marginBottom: 16 }}>
        {isLoading && renderLoadingCard()}
        {!isLoading && error && renderErrorCard()}
      </View>
    ),
    [isLoading, error]
  );

  // Memoize the keyExtractor
  const keyExtractor = useCallback((item: any) => item._id, []);

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      {/* Header */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#262626", "#171717"]
            : ["#d1d5db", "#ffffff"]
        }
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
        className="justify-center items-center w-full pt-24 pb-16 rounded-b-3xl relative"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-5 top-5 p-3 rounded-full bg-black/10 dark:bg-white/10"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
        </TouchableOpacity>
        <Text className="text-4xl font-bold text-gray-900 dark:text-white font-mono mb-6">
          Mosques
        </Text>
        <Text className="text-lg text-gray-600 dark:text-white/80 text-center px-8">
          Select a mosque to view its prayer times
        </Text>
      </LinearGradient>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search mosques..."
        placeholderTextColor={colorScheme === "dark" ? "#d4d4d8" : "#9ca3af"}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        className="bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white rounded-xl my-5 mx-4 p-4"
      />

      {/* Mosque Cards */}
      <LegendList
        className="flex-1"
        data={filteredTimings}
        keyExtractor={keyExtractor}
        recycleItems={true}
        maintainVisibleContentPosition
        renderItem={renderItem}
        extraData={pinnedMosques}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

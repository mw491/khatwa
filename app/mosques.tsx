import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { useTodayTimings } from "@/lib/hooks/useTodayTimings";
import { useMosqueStore } from "@/lib/store/mosqueStore";
import { router } from "expo-router";
import { useDeferredValue, useState, useMemo, useCallback } from "react";
import { LegendList } from "@legendapp/list";
import { Ionicons } from "@expo/vector-icons";

export default function MosquesScreen() {
  const { data: timings, isLoading, error } = useTodayTimings();
  const selectedMosqueID = useMosqueStore((state) => state.selectedMosqueID);
  const setselectedMosqueID = useMosqueStore(
    (state) => state.setSelectedMosqueID
  );

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // Memoize filtered data to prevent recalculation
  const filteredTimings = useMemo(() => {
    if (!timings) return [];
    if (!deferredQuery) return timings;

    const queryLower = deferredQuery.toLowerCase();
    return timings.filter((timing) =>
      timing.mosque_name.toLowerCase().includes(queryLower)
    );
  }, [timings, deferredQuery]);

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

  const handleMosqueSelect = (id: string) => {
    setselectedMosqueID(id);
    router.back();
  };

  // Memoize the renderItem function
  const renderItem = useCallback(
    ({ item: mosque }: { item: any }) => (
      <TouchableOpacity
        onPress={() => handleMosqueSelect(mosque._id)}
        activeOpacity={0.5}
        className={`rounded-xl p-6 ${
          mosque._id === selectedMosqueID
            ? "bg-emerald-600 border-2 border-emerald-400"
            : "bg-neutral-700"
        }`}
      >
        <Text
          className={`text-2xl font-semibold text-center ${
            mosque._id === selectedMosqueID ? "text-white" : "text-white"
          }`}
        >
          {mosque.mosque_name}
        </Text>
        {mosque._id === selectedMosqueID && (
          <Text className="text-emerald-200 text-center mt-2 text-sm">
            Currently Selected
          </Text>
        )}
      </TouchableOpacity>
    ),
    [selectedMosqueID]
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
    <View className="flex-1 bg-neutral-800">
      {/* Header */}
      <View className="bg-emerald-700 justify-center items-center w-full pt-24 pb-16 rounded-b-3xl relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-5 top-5 p-3 rounded-full bg-white/10"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-4xl font-bold text-white font-mono mb-6">
          Mosques
        </Text>
        <Text className="text-lg text-white/80 text-center px-8">
          Select a mosque to view its prayer times
        </Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search mosques..."
        placeholderTextColor="#d4d4d8"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        className="bg-neutral-700 text-white rounded-xl my-5 mx-4 p-4"
      />

      {/* Mosque Cards */}
      <LegendList
        className="flex-1"
        data={filteredTimings}
        keyExtractor={keyExtractor}
        recycleItems={true}
        maintainVisibleContentPosition
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

import { useHaptics } from "@/lib/hooks/useHaptics";
import { useTodayTimings, type Timings } from "@/lib/hooks/useTodayTimings";
import { useLiveLocation } from "@/lib/hooks/useUserLocation";
import {
  usePinnedMosquesStore,
  useSelectedMosqueStore,
} from "@/lib/store/mosqueStore";
import calculateDistance from "@/lib/utils/calculateDistance";
import { Ionicons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { router } from "expo-router";
import Fuse from "fuse.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useDebounce } from "use-debounce";

export default function MosquesScreen() {
  const colorScheme = useColorScheme();
  const { data: timings, isLoading, error: fetchError } = useTodayTimings();
  const haptics = useHaptics();

  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const setselectedMosqueID = useSelectedMosqueStore(
    (state) => state.setSelectedMosqueID
  );

  const { coords, error: locationError } = useLiveLocation();
  const [sortedTimings, setSortedTimings] = useState<Timings[] | null>(null);

  useEffect(() => {
    if (!timings) return;
    const withDistances = timings
      .map((mosque) => ({
        ...mosque,
        distanceM: coords
          ? Math.round(
              calculateDistance(
                coords.latitude,
                coords.longitude,
                mosque.coordinates.lat,
                mosque.coordinates.long
              )
            )
          : undefined,
      }))
      .sort((a, b) => (a.distanceM ?? Infinity) - (b.distanceM ?? Infinity));
    setSortedTimings(withDistances);
  }, [coords, timings]);

  const pinnedMosques = usePinnedMosquesStore((state) => state.pinnedMosques);
  const togglePinnedMosque = usePinnedMosquesStore(
    (state) => state.togglePinnedMosque
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);

  const fuse = useMemo(() => {
    if (!sortedTimings) return null;
    return new Fuse(sortedTimings, {
      keys: ["mosque_name", "postcode"],
      includeScore: true,
      threshold: 0.4,
    });
  }, [sortedTimings]);

  // Memoize filtered and sorted data to prevent recalculation
  const filteredTimings = useMemo(() => {
    if (!sortedTimings) return [];

    if (debouncedQuery && fuse) {
      const results = fuse.search(debouncedQuery);
      return results.map((result) => result.item);
    }

    // When no search query, sort by selected, then pinned, then distance
    return [...sortedTimings].sort((a, b) => {
      // Selected mosque comes first
      if (a._id === selectedMosqueID) return -1;
      if (b._id === selectedMosqueID) return 1;

      // Pinned mosques come second
      const aIsPinned = pinnedMosques.includes(a._id);
      const bIsPinned = pinnedMosques.includes(b._id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      // The rest are already sorted by distance
      return 0;
    });
  }, [sortedTimings, debouncedQuery, selectedMosqueID, pinnedMosques, fuse]);

  const renderLoadingCard = () => (
    <View className="rounded-2xl p-4 bg-gray-50 dark:bg-neutral-800/50 items-center">
      <ActivityIndicator
        size="small"
        color={colorScheme === "dark" ? "#ffffff" : "#111827"}
      />
      <Text className="text-gray-900 dark:text-white text-center mt-2 text-sm">
        Loading...
      </Text>
    </View>
  );
  const renderErrorCard = (errorMessage: string) => (
    <View className="rounded-2xl p-4 bg-red-50 dark:bg-red-900/20 items-center border-2 border-red-400">
      <Text className="text-red-600 dark:text-red-400 text-center text-sm">{`Error: ${errorMessage ?? "Unable to load"}`}</Text>
    </View>
  );

  const handleMosqueSelect = (id: string) => {
    haptics.success();
    setselectedMosqueID(id);
    router.back();
  };

  const renderItem = ({ item: mosque }: { item: Timings }) => (
    <Pressable
      onPress={() => handleMosqueSelect(mosque._id)}
      className={`bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-4 flex-row items-center gap-3 overflow-hidden
        active:scale-[0.99] transition-transform duration-200 ${
          mosque._id === selectedMosqueID
            ? "border-2 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border border-gray-200 dark:border-neutral-600"
        }`}
      android_ripple={{
        color:
          colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
        foreground: true,
      }}
      style={({ pressed }) => [pressed && { opacity: 0.6 }]}
    >
      <View className="gap-1 flex-1">
        <Text
          className={`text-lg font-semibold text-left text-gray-900 dark:text-white`}
          numberOfLines={2}
        >
          {mosque.mosque_name}
        </Text>
        {!!mosque.postcode && (
          <Text
            className={`text-sm text-left text-gray-600 dark:text-white/70`}
            numberOfLines={1}
          >
            {mosque.postcode}
          </Text>
        )}
        <View className="flex-row items-center gap-3 mt-1">
          {mosque.distanceM != null ? (
            <View className="px-2 py-1 rounded-full bg-gray-200 dark:bg-neutral-700">
              <Text className="text-xs text-gray-900 dark:text-white">
                {mosque.distanceM >= 1000
                  ? (mosque.distanceM / 1000).toFixed(2) + " km"
                  : mosque.distanceM + " m"}
              </Text>
            </View>
          ) : !locationError ? (
            <View
              className="rounded-full bg-gray-200 dark:bg-neutral-700"
              style={{ height: 20, minWidth: 56 }}
            />
          ) : null}
          <Pressable
            onPress={async () => {
              try {
                haptics.light();
                const url = mosque.google_maps_link;
                await Linking.openURL(url);
              } catch (err) {
                Alert.alert(
                  "Unable to open map",
                  `Failed to open the map link due to error: ${String(err)}`
                );
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            android_ripple={{
              color:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              foreground: true,
            }}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Ionicons
              name="map"
              size={16}
              color={colorScheme === "dark" ? "#ffffff" : "#111827"}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              const isCurrentlyPinned = pinnedMosques.includes(mosque._id);
              if (isCurrentlyPinned) {
                haptics.light(); // Light feedback for unpinning
              } else {
                haptics.success(); // Success feedback for pinning
              }
              togglePinnedMosque(mosque._id);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            android_ripple={{
              color:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              foreground: true,
            }}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Ionicons
              name="star"
              size={16}
              color={
                pinnedMosques.includes(mosque._id)
                  ? "#facc15"
                  : colorScheme === "dark"
                    ? "#ffffff"
                    : "#9ca3af"
              }
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  // Memoize the ItemSeparatorComponent
  const ItemSeparatorComponent = useCallback(
    () => <View style={{ height: 12 }} />,
    []
  );

  // Memoize the ListHeaderComponent
  const ListHeaderComponent = useCallback(() => {
    const showLoading = isLoading;
    const showFetchError = !isLoading && !!fetchError;
    const showLocationError = !isLoading && !!locationError;

    const hasContent = showLoading || showFetchError || showLocationError;

    if (!hasContent) return null;

    return (
      <View style={{ marginBottom: 16 }}>
        {showLoading && renderLoadingCard()}
        {showFetchError && renderErrorCard(fetchError?.message)}
        {showLocationError && renderErrorCard(locationError as string)}
      </View>
    );
  }, [isLoading, fetchError, locationError]);

  // Add haptic feedback once on transition to an error state
  const prevFetchError = useRef<boolean>(false);
  const prevLocationError = useRef<boolean>(false);
  useEffect(() => {
    const hasFetchError = !!fetchError;
    const hasLocationError = !!locationError;

    if (hasFetchError && !prevFetchError.current) {
      haptics.error();
    }
    if (hasLocationError && !prevLocationError.current) {
      haptics.warning();
    }

    prevFetchError.current = hasFetchError;
    prevLocationError.current = hasLocationError;
  }, [fetchError, locationError]);

  // Memoize the keyExtractor
  const keyExtractor = useCallback((item: any) => item._id, []);

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      {/* Header */}
      <View className="w-full pt-16 pb-6 relative">
        <Pressable
          onPress={() => {
            haptics.light();
            router.back();
          }}
          className="absolute left-5 top-5 p-3 rounded-full bg-gray-100 dark:bg-neutral-800 shadow-md overflow-hidden"
          android_ripple={{
            color:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.1)",
            foreground: true,
          }}
          //  active:scale-[0.98] transition-transform duration-200"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
        </Pressable>
        <View className="items-center px-16">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-2">
            Mosques
          </Text>
          <Text className="text-base text-gray-600 dark:text-white/80 text-center">
            Select a mosque to view its prayer times
          </Text>
        </View>
      </View>

      <View className="flex-row items-center bg-gray-50 dark:bg-neutral-800/50 rounded-2xl my-3 mx-4 p-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search mosques..."
          placeholderTextColor={colorScheme === "dark" ? "#d4d4d8" : "#9ca3af"}
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 text-gray-900 dark:text-white"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => {
              setQuery("");
              haptics.light();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            android_ripple={{
              color:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              foreground: true,
            }}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </Pressable>
        )}
      </View>

      {/* Mosque Cards */}
      <LegendList
        className="flex-1"
        data={filteredTimings}
        keyExtractor={keyExtractor}
        recycleItems={true}
        // maintainVisibleContentPosition
        renderItem={renderItem}
        extraData={{ pinnedMosques, locationError }}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

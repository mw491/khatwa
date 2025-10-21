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
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ActivityIndicator,
  TextInput,
  Text,
  Pressable,
  View,
  useColorScheme,
} from "react-native";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce";

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const haptics = useHaptics();
  const { data: timings } = useTodayTimings();
  const { coords } = useLiveLocation();
  const [sortedTimings, setSortedTimings] = useState<Timings[] | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);

  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const setSelectedMosqueID = useSelectedMosqueStore(
    (state) => state.setSelectedMosqueID
  );

  const pinnedMosques = usePinnedMosquesStore((s) => s.pinnedMosques);
  const togglePinnedMosque = usePinnedMosquesStore((s) => s.togglePinnedMosque);

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

  const keyExtractor = useCallback((item: any) => item._id, []);

  const fuse = useMemo(() => {
    if (!sortedTimings) return null;
    return new Fuse(sortedTimings, {
      keys: ["mosque_name", "postcode"],
      includeScore: true,
      threshold: 0.4,
    });
  }, [sortedTimings]);

  const filteredTimings = useMemo(() => {
    if (!sortedTimings) return [];
    if (debouncedQuery && fuse) {
      const results = fuse.search(debouncedQuery);
      return results.map((r) => r.item);
    }
    return sortedTimings;
  }, [sortedTimings, debouncedQuery, fuse]);

  const renderItem = ({ item: mosque }: { item: Timings }) => (
    <Pressable
      onPress={() => setSelectedMosqueID(mosque._id)}
      className={`bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-4 flex-row items-center gap-3 overflow-hidden ${
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
          >
            {mosque.postcode}
          </Text>
        )}
        <View className="flex-row items-center gap-3 mt-1">
          {!!mosque.distanceM && (
            <View className="px-2 py-1 rounded-full bg-gray-200 dark:bg-neutral-700">
              <Text className="text-xs text-gray-900 dark:text-white">
                {mosque.distanceM >= 1000
                  ? (mosque.distanceM / 1000).toFixed(2) + " km"
                  : mosque.distanceM + " m"}
              </Text>
            </View>
          )}
          <Pressable
            onPress={() => togglePinnedMosque(mosque._id)}
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

  const canContinue = !!selectedMosqueID;

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <View className="items-center px-8 pt-20 pb-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-2">
          Welcome
        </Text>
        <Text className="text-base text-gray-600 dark:text-white/80 text-center">
          Select your mosque and optionally star your favourites. You can change
          this later.
        </Text>
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
            onPress={() => setQuery("")}
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

      {!sortedTimings ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="small"
            color={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
        </View>
      ) : (
        <LegendList
          className="flex-1"
          data={filteredTimings}
          keyExtractor={keyExtractor}
          recycleItems
          renderItem={renderItem}
          extraData={{ selectedMosqueID, pinnedMosques, debouncedQuery }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View className="px-4 pb-8">
        <Pressable
          disabled={!canContinue}
          onPress={() => {
            haptics.success();
            router.replace("/");
          }}
          className={`py-4 rounded-2xl items-center overflow-hidden ${
            canContinue
              ? "bg-blue-600 dark:bg-blue-500"
              : "bg-gray-200 dark:bg-neutral-700"
          }`}
          android_ripple={{
            color:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.1)",
            foreground: true,
          }}
          style={({ pressed }) => [pressed && canContinue && { opacity: 0.7 }]}
        >
          <Text
            className={`text-base font-semibold ${
              canContinue ? "text-white" : "text-gray-500 dark:text-white/60"
            }`}
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

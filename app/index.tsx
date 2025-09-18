import Header from "@/app/components/Header";
import DeltaLine from "@/app/components/DeltaLine";
import HijriDate from "@/app/components/HijriDate";
import Timings from "@/app/components/Timings";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { RefreshControl, ScrollView, View, useColorScheme } from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: ["dailyData"] });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <ScrollView
      className="bg-white dark:bg-neutral-900"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colorScheme === "dark" ? "#525252" : "#6b7280"}
          colors={[colorScheme === "dark" ? "#525252" : "#6b7280"]}
        />
      }
    >
      <View className="flex-1 pb-8 justify-start items-center bg-white dark:bg-neutral-900">
        <Header />
        <DeltaLine />
        <HijriDate />
        <Timings />
      </View>
    </ScrollView>
  );
}

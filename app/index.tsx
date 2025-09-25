import Header from "@/lib/components/Header";
import DeltaLine from "@/lib/components/DeltaLine";
import HijriDate from "@/lib/components/HijriDate";
import Timings from "@/lib/components/Timings";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { RefreshControl, ScrollView, View, useColorScheme } from "react-native";
import ReportModal from "@/lib/components/ReportModal";

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
      <ReportModal />
    </ScrollView>
  );
}

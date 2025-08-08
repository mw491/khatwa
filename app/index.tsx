import { ScrollView, View, RefreshControl } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import DataTable from "@/app/components/DataTable";
import Timings from "@/app/components/Timings";
import Header from "@/app/components/Header";
import React from "react";

export default function Index() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Invalidate and refetch the daily data
      await queryClient.invalidateQueries({ queryKey: ["dailyData"] });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <ScrollView
      className="bg-neutral-800"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#10b981" // emerald-500 color
          colors={["#10b981"]} // for Android
        />
      }
    >
      <View className="flex-1 pb-8 justify-start items-center bg-neutral-800">
        <Header />
        {/* <DataTable /> */}
        <Timings />
      </View>
    </ScrollView>
  );
}

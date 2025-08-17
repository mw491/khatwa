import Header from "@/app/components/Header";
import Timings from "@/app/components/Timings";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function Index() {
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
      className="bg-neutral-800"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#525252" // neutral-600 color
          colors={["#525252"]} // for Android
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

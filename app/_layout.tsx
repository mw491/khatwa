import "@/app/global.css";
import { Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";

import { mmkvPersister } from "@/lib/storage/queryPersist";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24h
      gcTime: 1000 * 60 * 60 * 24, // 24h
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Kick off persistence (sync storage)
persistQueryClient({
  queryClient,
  persister: mmkvPersister,
  maxAge: 1000 * 60 * 60 * 24, // keep data for 24h
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider
        apiKey="phc_sJHstC8XmssuaL5xYh4A7EKETH8xps5Joi1KZ1hiXCp"
        options={{
          host: "https://eu.i.posthog.com",
          // enableSessionReplay: true,
        }}
        autocapture
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: isDark ? "#171717" : "#ffffff" }}
        >
          <StatusBar style={isDark ? "light" : "dark"} animated />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="mosques" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </PostHogProvider>
    </QueryClientProvider>
  );
}

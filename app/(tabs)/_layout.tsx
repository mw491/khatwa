import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const activeTint = "#3b82f6"; // blue-500
  const inactiveTint = isDark ? "#9ca3af" : "#94a3b8"; // gray-400 / slate-400
  const bg = isDark ? "#171717" : "#ffffff"; // neutral-800 / white
  const border = isDark ? "#262626" : "#e5e7eb"; // neutral-900 / gray-200

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "shift",
        sceneStyle: {
          backgroundColor: bg,
        },
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: border,
          borderTopWidth: 1,
          height: 60,
          paddingTop: 3,
          paddingBottom: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Timings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mosques"
        options={{
          title: "Mosques",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "map" : "map-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

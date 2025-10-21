import { Text, View } from "react-native";
import { useDeltaLine } from "@/lib/hooks/useDeltaLine";

export default function DeltaLine() {
  const deltaLine = useDeltaLine();

  return (
    <View className="w-full items-center my-8 max-w-96">
      <View className="w-full py-8 px-4">
        <Text className="text-4xl text-center text-gray-900 dark:text-white font-mono font-bold tracking-tight">
          {deltaLine}
        </Text>
      </View>
    </View>
  );
}

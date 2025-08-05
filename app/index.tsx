import { View } from "react-native";
import DataTable from "./components/DataTable";
import TimeDisplay from "./components/TimeDisplay";

export default function Index() {
  return (
    <View className="flex-1 justify-start items-center pt-16 bg-neutral-800">
      <TimeDisplay />
      <DataTable />
    </View>
  );
}

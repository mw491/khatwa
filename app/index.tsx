import { View } from "react-native";
import DataTable from "./components/DataTable";
import Header from "./components/Header";

export default function Index() {
  return (
    <View className="flex-1 justify-start items-center bg-neutral-800">
      <Header />
      <DataTable />
    </View>
  );
}

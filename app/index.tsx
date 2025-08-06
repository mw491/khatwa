import { View } from "react-native";
import DataTable from "@/app/components/DataTable";
import Timings from "@/app/components/Timings";
import Header from "@/app/components/Header";

export default function Index() {
  return (
    <View className="flex-1 justify-start items-center bg-neutral-800">
      <Header />
      {/* <DataTable /> */}
      <Timings />
    </View>
  );
}

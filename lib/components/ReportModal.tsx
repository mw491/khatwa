import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  TextInputChangeEvent,
} from "react-native";
import {
  type ReportModalType,
  useReportModalStore,
} from "@/lib/store/reportModalStore";
import { useSelectedMosqueStore } from "@/lib/store/mosqueStore";
import { useTodayTimings } from "@/lib/hooks/useTodayTimings";
import { useState } from "react";
import { useSubmitOnce } from "@/lib/hooks/useSubmitOnce";

export default function ReportModal() {
  const [message, setMessage] = useState("");
  const [newMosqueName, setNewMosqueName] = useState("");
  const { isOpen, reportModalType, closeReportModal } = useReportModalStore();
  const { data: timings } = useTodayTimings();
  const selectedMosqueID = useSelectedMosqueStore(
    (state) => state.selectedMosqueID
  );
  const mosque = timings?.find((t) => t._id === selectedMosqueID);

  const submitReport = async (type: ReportModalType) => {
    const response = await fetch("https://khatwa-backend.vercel.app/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type:
          type === "incorrect_timings"
            ? "Reported Incorrect Timings"
            : type === "new_mosque"
              ? "Requested New Mosque"
              : "Feature Requested",
        mosque:
          type === "incorrect_timings"
            ? mosque?.mosque_name
            : type === "new_mosque"
              ? newMosqueName
              : "",
        message,
      }),
    });

    if (response.ok) {
      Alert.alert("Success", "Your report has been submitted successfully.");
      setMessage("");
      setNewMosqueName("");
      closeReportModal();
    } else {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  const { isSubmitting, handleSubmit } = useSubmitOnce(submitReport, {
    debounceMs: 2000,
    onError: () => {
      Alert.alert(
        "Error",
        "Failed to submit report. Please check your connection."
      );
    },
  });

  return (
    <Modal animationType="fade" transparent visible={isOpen}>
      <TouchableOpacity
        className="flex-1 justify-center items-center bg-neutral-300/80 dark:bg-neutral-900/80"
        activeOpacity={1}
        onPress={() => closeReportModal()}
      >
        <View className="w-96 p-5 elevation-xl rounded-2xl bg-white dark:bg-neutral-800 gap-4">
          {reportModalType === "incorrect_timings" && (
            <Text className="dark:text-white text-xl font-bold">
              Report Incorrect Prayer Timings
            </Text>
          )}
          {reportModalType === "feature_request" && (
            <Text className="dark:text-white text-xl font-bold">
              Request New Featre
            </Text>
          )}
          {reportModalType === "new_mosque" && (
            <Text className="dark:text-white text-xl font-bold">
              Request New Mosque
            </Text>
          )}

          {reportModalType === "incorrect_timings" && (
            <Text className="text-lg dark:text-white font-bold">
              Mosque: <Text className="font-normal">{mosque?.mosque_name}</Text>
            </Text>
          )}

          {reportModalType === "new_mosque" && (
            <TextInput
              className="dark:text-white border-[1px] border-neutral-700 rounded-2xl p-3"
              placeholder="New Mosque Name"
              value={newMosqueName}
              onChange={(text: TextInputChangeEvent) =>
                setNewMosqueName(text.nativeEvent.text)
              }
            />
          )}

          <TextInput
            className="dark:text-white border-[1px] border-neutral-700 rounded-2xl p-3"
            placeholder="Message"
            value={message}
            onChange={(text: TextInputChangeEvent) =>
              setMessage(text.nativeEvent.text)
            }
          />

          <View className="flex-row justify-between gap-2">
            <TouchableOpacity
              className="flex-grow bg-neutral-200 dark:bg-neutral-700 items-center rounded-2xl p-2"
              onPress={closeReportModal}
            >
              <Text className="dark:text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-grow items-center rounded-2xl p-2 ${
                isSubmitting
                  ? "bg-neutral-300 dark:bg-neutral-600"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
              onPress={() => handleSubmit(reportModalType)}
              disabled={isSubmitting}
            >
              <Text
                className={`${
                  isSubmitting
                    ? "text-neutral-500 dark:text-neutral-400"
                    : "dark:text-white"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

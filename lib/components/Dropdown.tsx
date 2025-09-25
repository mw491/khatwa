import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import { useReportModalStore } from "../store/reportModalStore";

export default function Dropdown() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { openReportModal } = useReportModalStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const buttonRef = useRef<TouchableOpacity>(null);
  const dropdownRef = useRef<Modal>(null);

  const toggleDropdown = () => {
    if (!modalVisible) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownTop(y + height + 40);
        setDropdownLeft(x - width - 150); // Initial position estimate
        setModalVisible(true);
      });
    } else {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    if (modalVisible && buttonRef.current && dropdownRef.current) {
      // Small delay to ensure the modal is fully rendered
      setTimeout(() => {
        buttonRef.current.measureInWindow((x, y, width, height) => {
          dropdownRef.current.measureInWindow(
            (dropdownX, dropdownY, dropdownWidth, dropdownHeight) => {
              setDropdownLeft(x + width - dropdownWidth);
            }
          );
        });
      }, 10);
    }
  }, [modalVisible]);

  return (
    <View>
      <TouchableOpacity
        className="bg-white dark:bg-neutral-800 p-4 rounded-full elevation-xl"
        onPress={toggleDropdown}
        ref={buttonRef}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={isDark ? "white" : "black"}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-transparent"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            className="absolute bg-white dark:bg-neutral-800 py-2 rounded-2xl gap-2 border-[1px] border-neutral-300 dark:border-neutral-600 elevation-xl"
            style={{
              top: dropdownTop,
              left: dropdownLeft,
            }}
            ref={dropdownRef}
          >
            <TouchableOpacity
              className="flex-row items-center py-1 px-4"
              onPress={() => openReportModal("incorrect_timings")}
            >
              <Ionicons
                name="flag-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text className="dark:text-white p-2 text-lg">
                Report Incorrect Timings
              </Text>
            </TouchableOpacity>
            <View className="h-px bg-neutral-300 dark:bg-neutral-600" />

            <TouchableOpacity
              className="flex-row items-center py-1 px-4"
              onPress={() => openReportModal("new_mosque")}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text className="dark:text-white p-2 text-lg">
                Request New Mosque
              </Text>
            </TouchableOpacity>
            <View className="h-px bg-neutral-300 dark:bg-neutral-600" />

            <TouchableOpacity
              className="flex-row items-center py-1 px-4"
              onPress={() => openReportModal("feature_request")}
            >
              <Ionicons
                name="bulb-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text className="dark:text-white p-2 text-lg">
                Feature Request
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

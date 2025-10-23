import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useReportModalStore } from "../store/reportModalStore";

export default function Dropdown() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { openReportModal } = useReportModalStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const buttonRef = useRef<View>(null);
  const dropdownRef = useRef<View>(null);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (!modalVisible) {
      buttonRef.current?.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          setDropdownTop(y + height + 40);
          setDropdownLeft(x - width - 150); // Initial position estimate
          setModalVisible(true);
        }
      );
    } else {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    if (modalVisible && buttonRef.current && dropdownRef.current) {
      // Small delay to ensure the modal is fully rendered
      setTimeout(() => {
        buttonRef.current?.measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            dropdownRef.current?.measureInWindow(
              (
                dropdownX: number,
                dropdownY: number,
                dropdownWidth: number,
                dropdownHeight: number
              ) => {
                setDropdownLeft(x + width - dropdownWidth);
              }
            );
          }
        );
      }, 10);

      // Animate in
      slideAnim.setValue(0);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: Platform.OS === "android" ? 250 : 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: Platform.OS === "android" ? 250 : 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  return (
    <View>
      {/* prev TouchableOpacity className: bg-white dark:bg-neutral-800 p-4 rounded-full relative shadow-md active:scale-[0.98] transition-transform duration-200 */}
      <Pressable
        className="bg-white dark:bg-neutral-800 p-4 rounded-full relative shadow-md overflow-hidden"
        // active:scale-[0.98] transition-transform duration-200"
        onPress={toggleDropdown}
        android_ripple={{
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
          foreground: true,
        }}
        ref={buttonRef}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={isDark ? "white" : "black"}
        />
      </Pressable>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDropdown}
      >
        <Pressable className="flex-1 bg-transparent" onPress={closeDropdown}>
          <Animated.View
            className="absolute bg-white dark:bg-neutral-800 rounded-2xl gap-0 overflow-hidden
              border-[0.5px] border-neutral-200/80 dark:border-neutral-700 shadow-md"
            style={{
              top: dropdownTop,
              left: dropdownLeft,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
                {
                  scale: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            }}
            ref={dropdownRef}
          >
            <Pressable
              className="flex-row items-center py-2 px-4"
              onPress={() => {
                closeDropdown();
                openReportModal("incorrect_timings");
              }}
              android_ripple={{
                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                foreground: true,
              }}
            >
              <Ionicons
                name="flag-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text className="dark:text-white p-2 text-lg">
                Report Incorrect Timings
              </Text>
            </Pressable>
            <View className="h-[0.5px] bg-neutral-200/80 dark:bg-neutral-700" />

            <Pressable
              className="flex-row items-center py-2 px-4"
              onPress={() => {
                closeDropdown();
                openReportModal("new_mosque");
              }}
              android_ripple={{
                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                foreground: true,
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text className="dark:text-white p-2 text-lg">
                Request New Mosque
              </Text>
            </Pressable>
            <View className="h-[0.5px] bg-neutral-200/80 dark:bg-neutral-700" />

            <Pressable
              className="flex-row items-center py-2 px-4"
              onPress={() => {
                closeDropdown();
                openReportModal("feature_request");
              }}
              android_ripple={{
                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                foreground: true,
              }}
            >
              <Ionicons
                name="bulb-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text className="dark:text-white p-2 text-lg">
                Feature Request
              </Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

import type { WithAndroidWidgetsParams } from "react-native-android-widget";

const widgetConfig: WithAndroidWidgetsParams = {
  // Paths to all custom fonts used in all widgets
  // fonts: ['./assets/fonts/Inter.ttf'],
  widgets: [
    {
      name: "Hello", // This name will be the **name** with which we will reference our widget.
      label: "My Hello Widget", // Label shown in the widget picker
      minWidth: "320dp",
      minHeight: "120dp",
      // This means the widget's default size is 5x2 cells, as specified by the targetCellWidth and targetCellHeight attributes.
      // Or 320×120dp, as specified by minWidth and minHeight for devices running Android 11 or lower.
      // If defined, targetCellWidth,targetCellHeight attributes are used instead of minWidth or minHeight.
      targetCellWidth: 5,
      targetCellHeight: 2,
      description: "This is my first widget", // Description shown in the widget picker
      // previewImage: './assets/widget-preview/hello.png', // Path to widget preview image

      // How often, in milliseconds, that this AppWidget wants to be updated.
      // The task handler will be called with widgetAction = 'UPDATE_WIDGET'.
      // Default is 0 (no automatic updates)
      // Minimum is 1800000 (30 minutes == 30 * 60 * 1000).
      updatePeriodMillis: 1800000,
    },
  ],
};

const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  expo: {
    name: IS_DEV ? "Khatwa [Dev]" : "Khatwa",
    slug: "khatwa",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "khatwa",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? "com.mw491.khatwadev" : "com.mw491.khatwa",
      icon: {
        dark: "./assets/icons/ios-dark.png",
        light: "./assets/icons/ios-light.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/android-adaptive.png",
        monochromeImage: "./assets/icons/android-adaptive.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: IS_DEV ? "com.mw491.khatwadev" : "com.mw491.khatwa",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-dark.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/icons/splash-light.png",
            backgroundColor: "#000000",
          },
        },
      ],
      ["react-native-android-widget", widgetConfig],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "6783c71f-a097-498d-8472-b07da1cfeb21",
      },
    },
  },
};

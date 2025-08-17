const IS_DEV = process.env.APP_VARIANT === 'development';
console.log(IS_DEV ? "com.mw491.khatwadev" : "com.mw491.khatwa")

export default {
  "expo": {
    "name": IS_DEV ? "Khatwa [Dev]" : "Khatwa",
    "slug": "khatwa",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "khatwa",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": IS_DEV ? "com.mw491.khatwadev" : "com.mw491.khatwa",
      "icon": {
        "dark": "./assets/icons/ios-dark.png",
        "light": "./assets/icons/ios-light.png",
        "tinted": "./assets/icons/ios-tinted.png"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icons/android-adaptive.png",
        "monochromeImage": "./assets/icons/android-adaptive.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": IS_DEV ? "com.mw491.khatwadev" : "com.mw491.khatwa"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/icons/splash-dark.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "image": "./assets/icons/splash-light.png",
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "6783c71f-a097-498d-8472-b07da1cfeb21"
      }
    }
  }
}

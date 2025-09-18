import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

interface HelloWidgetProps {
  name: string;
}

export function HelloWidget({ name }: HelloWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 16,
      }}
    >
      <TextWidget
        text={`Hello ${name}`}
        style={{
          fontSize: 32,
          color: "#000000",
        }}
      />
    </FlexWidget>
  );
}

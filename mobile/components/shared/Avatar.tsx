import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme, radius } from "@/theme";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<Size, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 };

type Props = {
  name: string;
  hue?: string;
  size?: Size;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function colorFor(name: string): string {
  const hues = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#ec4899", "#14b8a6"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return hues[h % hues.length];
}

export function Avatar({ name, hue, size = "md" }: Props) {
  const t = useTheme();
  const px = sizeMap[size];
  const bg = hue ?? colorFor(name);
  return (
    <View
      style={[
        styles.box,
        {
          width: px,
          height: px,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderColor: t.border,
        },
      ]}
    >
      <Text
        variant={size === "xs" ? "micro" : size === "sm" ? "caption" : size === "md" ? "bodySmall" : "h3"}
        weight="bold"
        style={{ color: "#fff" }}
      >
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
});

import { View, StyleSheet } from "react-native";
import { Text } from "../shared/Text";
import { useTheme } from "@/theme";
import { Signal, Wifi, BatteryFull } from "lucide-react-native";
import type { ReactNode } from "react";

// Visual approximation of a Pixel-class Android device for screenshot framing.
// Outer body is the bezel; inner box is the viewport that should match a
// nominal 412 x 915 dp viewport scaled to whatever container the frame is
// rendered inside.

type Props = {
  children: ReactNode;
  time?: string;
  statusBarTone?: "light" | "dark";
};

export function AndroidFrame({ children, time = "9:41", statusBarTone = "dark" }: Props) {
  const t = useTheme();
  const fg = statusBarTone === "light" ? "#fff" : t.textPrimary;

  return (
    <View style={[styles.bezel, { backgroundColor: t.bg }]}>
      <View style={[styles.statusBar]}>
        <Text variant="caption" weight="bold" style={{ color: fg }}>{time}</Text>
        <View style={styles.statusIcons}>
          <Signal size={12} color={fg} />
          <Wifi size={12} color={fg} />
          <BatteryFull size={14} color={fg} />
        </View>
      </View>
      <View style={{ flex: 1 }}>{children}</View>
      <View style={[styles.navBar, { borderTopColor: t.border }]}>
        <View style={[styles.navPill, { backgroundColor: t.textPrimary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bezel: {
    flex: 1,
  },
  statusBar: {
    height: 28,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navBar: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 0,
  },
  navPill: {
    width: 110,
    height: 4,
    borderRadius: 2,
    opacity: 0.85,
  },
});

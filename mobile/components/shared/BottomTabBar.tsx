import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { useTheme, space } from "@/theme";
import type { ComponentType } from "react";

type Tab<T extends string> = {
  key: T;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
};

type Props<T extends string> = {
  tabs: readonly Tab<T>[];
  active: T;
  onChange?: (key: T) => void;
};

export function BottomTabBar<T extends string>({ tabs, active, onChange }: Props<T>) {
  const t = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: t.bgElevated, borderTopColor: t.border }]}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const color = isActive ? t.primary : t.textMuted;
        const Icon = tab.icon;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onChange?.(tab.key)}>
            <Icon size={22} color={color} />
            <Text variant="micro" weight={isActive ? "semibold" : "regular"} style={{ color }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    paddingTop: space.sm,
    paddingBottom: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
});

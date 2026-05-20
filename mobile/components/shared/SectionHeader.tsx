import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "./Text";
import { space } from "@/theme";

type Props = {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress?: () => void };
};

export function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="h3" weight="bold">{title}</Text>
        {subtitle ? <Text variant="bodySmall" tone="secondary">{subtitle}</Text> : null}
      </View>
      {action ? (
        <Pressable onPress={action.onPress}>
          <Text variant="bodySmall" weight="semibold" tone="accent">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.sm,
  },
});

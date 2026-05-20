import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { Button } from "./Button";
import { useTheme, radius, space } from "@/theme";
import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onPress?: () => void };
};

export function EmptyState({ icon, title, description, action }: Props) {
  const t = useTheme();
  return (
    <View style={[styles.wrap, { borderColor: t.border, backgroundColor: t.surface }]}>
      {icon ? <View style={[styles.icon, { backgroundColor: t.primarySoft }]}>{icon}</View> : null}
      <Text variant="h3" weight="bold" align="center">{title}</Text>
      {description ? <Text variant="bodySmall" tone="secondary" align="center">{description}</Text> : null}
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: space.xxxl,
    paddingHorizontal: space.lg,
    alignItems: "center",
    gap: space.md,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

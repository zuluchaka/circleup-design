import { Modal, View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ComponentType } from "react";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius } from "@/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  icon: ComponentType<{ size?: number; color?: string }>;
  tone?: "danger" | "warning" | "primary";
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryPress?: () => void;
};

export function ConfirmSheet({
  open,
  onClose,
  icon: Icon,
  tone = "danger",
  title,
  description,
  primaryLabel,
  secondaryLabel = "Cancel",
  onPrimaryPress,
}: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const toneVisual =
    tone === "danger"
      ? { bg: t.dangerSoft, fg: t.danger }
      : tone === "warning"
      ? { bg: t.warningSoft, fg: t.warning }
      : { bg: t.primarySoft, fg: t.primary };

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.sheet,
            {
              backgroundColor: t.surface,
              borderColor: t.border,
              paddingBottom: insets.bottom + space.lg,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: t.bgMuted }]} />

          <View style={[styles.iconWrap, { backgroundColor: toneVisual.bg }]}>
            <Icon size={28} color={toneVisual.fg} />
          </View>

          <Text variant="h2" weight="bold" align="center" style={{ marginTop: space.md, paddingHorizontal: space.lg }}>
            {title}
          </Text>
          <Text
            variant="bodySmall"
            tone="secondary"
            align="center"
            style={{ marginTop: space.sm, paddingHorizontal: space.lg, lineHeight: 20 }}
          >
            {description}
          </Text>

          <View style={[styles.actions, { paddingHorizontal: space.lg }]}>
            <Pressable
              onPress={onPrimaryPress}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: tone === "danger" ? t.danger : t.primary,
                },
              ]}
            >
              <Text variant="body" weight="bold" style={{ color: "#fff" }}>
                {primaryLabel}
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={[styles.secondaryBtn, { backgroundColor: t.bgMuted }]}
            >
              <Text variant="body" weight="semibold">
                {secondaryLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 1,
    paddingTop: space.sm,
    alignItems: "center",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: space.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.sm,
  },
  actions: {
    width: "100%",
    gap: space.sm,
    marginTop: space.lg,
  },
  primaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
  },
  secondaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.md,
    borderRadius: radius.md,
  },
});

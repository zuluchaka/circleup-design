import { Modal, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius } from "@/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function BottomSheet({ open, onClose, title, subtitle, children, footer }: Props) {
  const t = useTheme();

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
          style={[styles.sheet, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          {/* Drag handle */}
          <View style={[styles.handle, { backgroundColor: t.bgMuted }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text variant="h3" weight="bold">
                {title}
              </Text>
              {subtitle ? (
                <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: t.bgMuted }]}>
              <X size={16} color={t.textPrimary} />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView
            style={{ maxHeight: 480 }}
            contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.md }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Footer */}
          {footer ? (
            <View style={[styles.footer, { borderTopColor: t.border, backgroundColor: t.surface }]}>
              {footer}
            </View>
          ) : null}
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
    paddingBottom: space.lg,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: space.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

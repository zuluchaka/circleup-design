import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme, radius } from "@/theme";

type Role =
  | "President"
  | "Treasurer"
  | "Secretary"
  | "Organizer"
  | "Member"
  | "Admin"
  | "Auditor";

const toneFor = (role: Role) => {
  switch (role) {
    case "President": return "primary";
    case "Treasurer": return "success";
    case "Secretary": return "info";
    case "Organizer": return "warning";
    case "Auditor": return "info";
    case "Admin": return "danger";
    default: return "neutral";
  }
};

type Props = { role: Role | string };

export function RoleBadge({ role }: Props) {
  const t = useTheme();
  const tone = toneFor(role as Role);
  const map = {
    neutral: { bg: t.bgMuted, fg: t.textSecondary },
    primary: { bg: t.primarySoft, fg: t.primary },
    success: { bg: t.successSoft, fg: t.success },
    warning: { bg: t.warningSoft, fg: t.warning },
    danger: { bg: t.dangerSoft, fg: t.danger },
    info: { bg: t.infoSoft, fg: t.info },
  } as const;
  const c = map[tone as keyof typeof map];
  return (
    <View style={[styles.box, { backgroundColor: c.bg }]}>
      <Text variant="micro" weight="bold" style={{ color: c.fg, letterSpacing: 0.5 }}>
        {String(role).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
});

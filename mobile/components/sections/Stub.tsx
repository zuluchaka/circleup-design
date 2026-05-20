import { View } from "react-native";
import { LayoutDashboard } from "lucide-react-native";
import { Text } from "@/components/shared/Text";
import { Card } from "@/components/shared/Card";
import { ScreenContainer } from "@/components/shared/ScreenContainer";
import { AppHeader } from "@/components/shared/AppHeader";
import { useTheme, space } from "@/theme";

type Props = {
  sectionTitle: string;
  sectionIndex: number;
  screenLabel: string;
};

export function ScreenStub({ sectionTitle, sectionIndex, screenLabel }: Props) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <AppHeader title={screenLabel} subtitle={`Section ${String(sectionIndex).padStart(2, "0")} · ${sectionTitle}`} />
      <ScreenContainer>
        <View style={{ alignItems: "center", paddingVertical: space.xxxl, gap: space.md }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: t.primarySoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LayoutDashboard size={28} color={t.primary} />
          </View>
          <Text variant="h2" weight="bold" align="center">Design preview</Text>
          <Text variant="bodySmall" tone="secondary" align="center" style={{ maxWidth: 280 }}>
            This screen has a spec, user flows, sample data, and types in
            <Text variant="bodySmall" weight="semibold" tone="accent"> mobile/product/sections </Text>
            but the rendered RN design is being added in the next pass.
          </Text>
        </View>
        <Card padded>
          <Text variant="caption" tone="muted" weight="semibold">REVIEW MATERIAL READY</Text>
          <View style={{ height: space.sm }} />
          <Text variant="bodySmall">spec.md · UI requirements and integration points.</Text>
          <Text variant="bodySmall">user-flows.md · primary flows and edge states.</Text>
          <Text variant="bodySmall">data.json · canonical sample data for this screen.</Text>
          <Text variant="bodySmall">types.ts · TypeScript shapes used by the screen.</Text>
        </Card>
      </ScreenContainer>
    </View>
  );
}

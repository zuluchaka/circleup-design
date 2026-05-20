import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DuesDispute } from "@/components/sections/screens/DuesDispute";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function DuesDisputeRoute() {
  const t = useTheme();
  const { id, duesId } = useLocalSearchParams<{ id: string; duesId: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <DuesDispute associationId={id ?? "ma1"} duesId={duesId ?? "e1"} />
      </View>
      <AppTabs />
    </View>
  );
}

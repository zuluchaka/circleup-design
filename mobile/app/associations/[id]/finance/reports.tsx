import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LedgerReports } from "@/components/sections/screens/LedgerReports";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function LedgerReportsRoute() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <LedgerReports associationId={id ?? "ma1"} />
      </View>
      <AppTabs />
    </View>
  );
}

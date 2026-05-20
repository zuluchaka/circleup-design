import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BrDetail } from "@/components/sections/screens/BrDetail";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function BusinessRelationshipDetailRoute() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <BrDetail id={id ?? "br1"} />
      </View>
      <AppTabs />
    </View>
  );
}

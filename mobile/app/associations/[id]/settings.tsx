import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AssociationSettings } from "@/components/sections/screens/AssociationSettings";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function AssociationSettingsRoute() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <AssociationSettings id={id ?? "ma1"} />
      </View>
      <AppTabs />
    </View>
  );
}

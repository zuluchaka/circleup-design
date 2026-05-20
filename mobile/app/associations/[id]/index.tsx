import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AssociationDetail } from "@/components/sections/screens/AssociationDetail";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function AssociationDetailRoute() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <AssociationDetail id={id ?? "ma1"} />
      </View>
      <AppTabs />
    </View>
  );
}

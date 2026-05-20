import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AssociationFinance } from "@/components/sections/screens/AssociationFinance";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function AssociationFinanceRoute() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <AssociationFinance id={id ?? "ma1"} />
      </View>
      <AppTabs />
    </View>
  );
}

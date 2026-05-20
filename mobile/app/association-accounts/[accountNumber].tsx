import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AssociationAccountView } from "@/components/sections/screens/AssociationAccountView";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function AssociationAccountRoute() {
  const t = useTheme();
  const { accountNumber } = useLocalSearchParams<{ accountNumber: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <AssociationAccountView accountNumber={accountNumber ?? "ASS-7K2N-PRI"} />
      </View>
      <AppTabs />
    </View>
  );
}

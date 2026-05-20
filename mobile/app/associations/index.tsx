import { View } from "react-native";
import { MyAssociations } from "@/components/sections/screens/MyAssociations";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function AssociationsRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <MyAssociations />
      </View>
      <AppTabs />
    </View>
  );
}

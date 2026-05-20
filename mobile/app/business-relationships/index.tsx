import { View } from "react-native";
import { MyRelationships } from "@/components/sections/screens/MyRelationships";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function BusinessRelationshipsRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <MyRelationships />
      </View>
      <AppTabs />
    </View>
  );
}

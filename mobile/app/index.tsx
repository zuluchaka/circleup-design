import { View } from "react-native";
import { DiscoverHub } from "@/components/sections/screens/DiscoverHub";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function Index() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <DiscoverHub />
      </View>
      <AppTabs />
    </View>
  );
}

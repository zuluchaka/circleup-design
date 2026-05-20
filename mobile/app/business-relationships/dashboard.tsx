import { View } from "react-native";
import { BrDashboard } from "@/components/sections/screens/BrDashboard";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function BrDashboardRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <BrDashboard />
      </View>
      <AppTabs />
    </View>
  );
}

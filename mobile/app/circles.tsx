import { View } from "react-native";
import { RoscaMyCircles } from "@/components/sections/screens/RoscaMyCircles";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function CirclesRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <RoscaMyCircles />
      </View>
      <AppTabs />
    </View>
  );
}

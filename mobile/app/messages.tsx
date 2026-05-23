import { View } from "react-native";
import { MessagesHub } from "@/components/sections/screens/MessagesHub";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function MessagesRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <MessagesHub />
      </View>
      <AppTabs />
    </View>
  );
}

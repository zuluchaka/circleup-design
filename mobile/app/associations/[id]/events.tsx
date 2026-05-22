import { View } from "react-native";
import { AssociationEvents } from "@/components/sections/screens/AssociationEvents";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function AssociationEventsRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <AssociationEvents />
      </View>
      <AppTabs />
    </View>
  );
}

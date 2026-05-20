import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { OnboardingChecklistView } from "@/components/sections/screens/OnboardingChecklist";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function OnboardingRoute() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <OnboardingChecklistView brId={id ?? "br3"} />
      </View>
      <AppTabs />
    </View>
  );
}

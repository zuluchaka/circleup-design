import { View } from "react-native";
import { BrCreationWizard } from "@/components/sections/screens/BrCreationWizard";
import { useTheme } from "@/theme";

export default function NewBrRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <BrCreationWizard />
    </View>
  );
}

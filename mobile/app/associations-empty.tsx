// Screenshot-only route for the brand-new-user empty state of /associations.
// Lives at its own path because the [id] dynamic route catches /associations/*.

import { View } from "react-native";
import { MyAssociationsEmpty } from "@/components/sections/screens/MyAssociations";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function AssociationsEmptyRoute() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <MyAssociationsEmpty />
      </View>
      <AppTabs />
    </View>
  );
}

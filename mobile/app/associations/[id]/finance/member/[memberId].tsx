import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MemberLedger } from "@/components/sections/screens/MemberLedger";
import { AppTabs } from "@/components/shared/AppTabs";
import { useTheme } from "@/theme";

export default function MemberLedgerRoute() {
  const t = useTheme();
  const { id, memberId } = useLocalSearchParams<{ id: string; memberId: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flex: 1 }}>
        <MemberLedger associationId={id ?? "ma1"} memberId={memberId ?? "m1"} />
      </View>
      <AppTabs />
    </View>
  );
}

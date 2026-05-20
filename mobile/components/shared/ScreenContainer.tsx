import { ScrollView, View, StyleSheet, ScrollViewProps } from "react-native";
import { useTheme, space } from "@/theme";
import type { ReactNode } from "react";

type Props = ScrollViewProps & {
  children: ReactNode;
  padded?: boolean;
  scroll?: boolean;
};

export function ScreenContainer({ children, padded = true, scroll = true, contentContainerStyle, ...rest }: Props) {
  const t = useTheme();
  if (!scroll) {
    return (
      <View style={[styles.flex, { backgroundColor: t.bg, padding: padded ? space.lg : 0 }]}>
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      {...rest}
      style={[styles.flex, { backgroundColor: t.bg }]}
      contentContainerStyle={[
        { padding: padded ? space.lg : 0, paddingBottom: space.xxxl, gap: space.lg },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

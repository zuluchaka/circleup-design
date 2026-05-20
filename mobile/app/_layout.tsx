import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme, View } from "react-native";
import { ThemeContext, resolveTheme } from "@/theme";

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = resolveTheme(scheme);
  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.bg },
            }}
          />
        </View>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

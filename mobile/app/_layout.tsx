import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { useTheme } from "@/theme";
import { ThemeModeProvider } from "@/theme/ThemeModeProvider";
import { SnackbarProvider } from "@/components/shared/Snackbar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeModeProvider>
        <SnackbarProvider>
          <RootStack />
        </SnackbarProvider>
      </ThemeModeProvider>
    </SafeAreaProvider>
  );
}

function RootStack() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
        }}
      />
    </View>
  );
}

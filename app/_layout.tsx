import { Slot } from "expo-router";
import { AuthContextProvider } from "../context/auth";
import { useTheme } from "../theme"; // Import your custom theme hook
import { View, StatusBar } from "react-native";

export default function RootLayout() {
  const theme = useTheme();

  return (
    <AuthContextProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar
          barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
        />
        <Slot />
      </View>
    </AuthContextProvider>
  );
}

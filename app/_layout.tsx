<<<<<<< HEAD
import '../sentry.config';
=======
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
import { Slot } from "expo-router";
import { AuthContextProvider } from "../context/auth";
import { useTheme } from "../theme"; // Import your custom theme hook
import { View, StatusBar } from "react-native";
<<<<<<< HEAD
import ErrorBoundary from "../components/ErrorBoundary";
=======
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c

export default function RootLayout() {
  const theme = useTheme();

  return (
<<<<<<< HEAD
    <ErrorBoundary>
      <AuthContextProvider>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <StatusBar
            barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
          />
          <Slot />
        </View>
      </AuthContextProvider>
    </ErrorBoundary>
=======
    <AuthContextProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar
          barStyle={theme.background === "#000" ? "light-content" : "dark-content"}
        />
        <Slot />
      </View>
    </AuthContextProvider>
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
  );
}

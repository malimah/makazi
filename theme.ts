<<<<<<< HEAD
// theme.ts
import { useColorScheme } from "react-native";

export const lightTheme = {
  background: "#fff",
  text: "#000",
  primary: "#455fff",
  border: "#ccc",
  inputBackground: "#fff",
  placeholder: "#888",
  link: "#455fff",
};

export const darkTheme = {
  background: "#000",
  text: "#fff",
  primary: "#aaaaff",
  border: "#444",
  inputBackground: "#222",
  placeholder: "#aaa",
  link: "#aaaaff",
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
};
=======
// theme.ts
import { useColorScheme } from "react-native";

export const lightTheme = {
  background: "#fff",
  text: "#000",
  primary: "#455fff",
  border: "#ccc",
  inputBackground: "#fff",
  placeholder: "#888",
  link: "#455fff",
};

export const darkTheme = {
  background: "#000",
  text: "#fff",
  primary: "#aaaaff",
  border: "#444",
  inputBackground: "#222",
  placeholder: "#aaa",
  link: "#aaaaff",
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
};
>>>>>>> 07f5fb1884e5e59842ddd2d4f473ffffd327cd6e

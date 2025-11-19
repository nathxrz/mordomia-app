import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import AuthProvider from "@/context/AuthProvider";
import { Alert, Text, TouchableOpacity } from "react-native";

export default function UsersLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#fcfcfc",
            },
          }}
        >
          <Stack.Screen name="[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="catsitters/[id]"
            options={{
              title: "Cat Sitter",
              headerShown: true,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => Alert.alert("Chat em desenvolvimento...")}
                >
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 30,
                      lineHeight: 30,
                      marginRight: 16,
                      color: "#CF0790",
                    }}
                  >
                    chat
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}

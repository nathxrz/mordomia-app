import React from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function LoadingScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" color="#7F13EC" />
      <Text style={{ marginTop: 10, color: "#7F13EC" }}>Carregando...</Text>
    </SafeAreaView>
  );
}

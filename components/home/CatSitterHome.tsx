import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CatSitterHome({ user }: { user: { id: string } }) {
  return (
    <SafeAreaView>
      <Text>Bem-vindo(a) cat sitter</Text>
    </SafeAreaView>
  );
}

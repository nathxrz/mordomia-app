import SkillsList from "@/components/skills/SkillsList";
import { router } from "expo-router";
import React from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SkillsPage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1 }}>
          <SkillsList />
        </View>
        <Button
          title="Adicionar skill"
          onPress={() => router.push("/skills/registerSkill")}
        />
      </View>
    </SafeAreaView>
  );
}

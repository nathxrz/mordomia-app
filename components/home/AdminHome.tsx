import { router } from "expo-router";
import React from "react";
import { Button, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SkillsList from "../skills/SkillsList";

export default function AdminHome() {
  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, padding: 20 }}>
          <View>
            <SkillsList />
          </View>
          <Button
            title="Adicionar skill"
            onPress={() => router.push("/skills/registerSkill")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

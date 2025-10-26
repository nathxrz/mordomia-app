import CatList from "@/components/cats/CatList";
import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function CatsIndex() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View>
        <Text>Meus Pets</Text>
        <CatList />
      </View>
      <Button
        title="Adicionar pet"
        onPress={() => router.push("/cats/registerCat")}
      />
    </View>
  );
}

import CatList from "@/components/cats/CatList";
import { router, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CatsIndex() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Meus Pets",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              style={{ marginLeft: 16 }}
            >
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 30,
                  lineHeight: 30,
                  color: "#000",
                }}
              >
                arrow_back
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView edges={[]} style={styles.safeArea}>
        <View style={styles.container}>
          <CatList />

          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/cats/registerCat");
            }}
            style={{
              position: "absolute",
              bottom: 20,
              right: 16,
              backgroundColor: "#7F13EC",
              padding: 20,
              borderRadius: 17,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 30,
                color: "#fff",
              }}
            >
              add
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F6F8",
    flex: 1,
  },
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 30,
  },
});

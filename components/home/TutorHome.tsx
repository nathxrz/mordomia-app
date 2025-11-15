import React from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import CatSittersList from "../users/CatSittersList";

export default function TutorHome() {
  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        enableOnAndroid={true}
      >
        <View style={styles.container}>
          <CatSittersList />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
    height: "100%",
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
});

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CatSittersList from "../users/CatSittersList";

export default function TutorHome() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CatSittersList />
    </SafeAreaView>
  );
}

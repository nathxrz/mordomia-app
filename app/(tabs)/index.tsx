import AdminHome from "@/components/home/AdminHome";
import CatSitterHome from "@/components/home/CatSitterHome";
import TutorHome from "@/components/home/TutorHome";
import { useUser } from "@/hooks/useUser";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useUser();

  const getHomeScreen = () => {
    if (!user) {
      return (
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#7F13EC" />
          <Text style={{ marginTop: 10, color: "#7F13EC" }}>
            Carregando perfil...
          </Text>
        </SafeAreaView>
      );
    }

    if (user.roles?.includes("admin") && user.deleted_at === null) {
      return <AdminHome user={{ id: user.id }} />;
    } else if (user.roles?.includes("catsitter") && user.deleted_at === null) {
      return <CatSitterHome user={{ id: user.id }} />;
    } else if (user.roles?.includes("tutor") && user.deleted_at === null) {
      return <TutorHome user={{ id: user.id }} />;
    } else {
      return <Redirect href="./login" />;
    }
  };

  return <SafeAreaView style={{ flex: 1 }}>{getHomeScreen()}</SafeAreaView>;
}

import AdminHome from "@/components/home/AdminHome";
import CatSitterHome from "@/components/home/CatSitterHome";
import TutorHome from "@/components/home/TutorHome";
import { AuthContext } from "@/context/AuthProvider";
import React, { useContext } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useContext(AuthContext);

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

  const getHomeScreen = () => {
    if (user.roles.includes("admin")) {
      return <AdminHome user={{ id: user.id }} />;
    } else if (user.roles.includes("catsitter")) {
      return <CatSitterHome user={{ id: user.id }} />;
    } else {
      return <TutorHome user={{ id: user.id }} />;
    }
  };

  return <SafeAreaView style={{ flex: 1 }}>{getHomeScreen()}</SafeAreaView>;
}

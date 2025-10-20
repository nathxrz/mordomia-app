import AdminProfile from "@/components/profile/AdminProfile";
import CatSitterProfile from "@/components/profile/CatSitterProfile";
import TutorProfile from "@/components/profile/TutorProfile";
import { AuthContext } from "@/context/AuthProvider";
import React, { useContext } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile({ userId }: { userId: string }) {
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

  const getProfileScreen = () => {
    if (user.roles.includes("catsitter")) {
      return <CatSitterProfile userId={user.id} />;
    } else if (user.roles.includes("admin")) {
      return <AdminProfile userId={user.id} />;
    } else {
      return <TutorProfile userId={user.id} />;
    }
  };

  return <SafeAreaView>{getProfileScreen()}</SafeAreaView>;
}

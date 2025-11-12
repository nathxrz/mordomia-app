import AdminHome from "@/components/home/AdminHome";
import LoadingScreen from "@/components/LoadinfScreen";
import { useUser } from "@/hooks/useUser";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const { user } = useUser();

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {user.roles?.includes("admin") && user.deleted_at === null ? (
        <AdminHome />
      ) : (
        <Redirect href="./login" />
      )}
    </SafeAreaView>
  );
}

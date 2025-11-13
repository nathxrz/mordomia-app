import LoadingScreen from "@/components/LoadinfScreen";
import AdminProfile from "@/components/profile/AdminProfile";
import { useUser } from "@/hooks/useUser";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView>
      {user.roles?.includes("admin") ? (
        <AdminProfile />
      ) : (
        <Redirect href="../login" />
      )}
    </SafeAreaView>
  );
}

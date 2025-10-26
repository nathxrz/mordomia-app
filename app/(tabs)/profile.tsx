import LoadingScreen from "@/components/LoadinfScreen";
import AdminProfile from "@/components/profile/AdminProfile";
import CatSitterProfile from "@/components/profile/CatSitterProfile";
import TutorProfile from "@/components/profile/TutorProfile";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return <LoadingScreen />;
  }

  const getProfileScreen = () => {
    if (user?.roles.includes("catsitter")) {
      return <CatSitterProfile userId={user?.id} />;
    } else if (user?.roles.includes("admin")) {
      return <AdminProfile userId={user?.id} />;
    } else {
      return <TutorProfile />;
    }
  };

  return <SafeAreaView>{getProfileScreen()}</SafeAreaView>;
}

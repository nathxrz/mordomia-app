import LoadingScreen from "@/components/LoadinfScreen";
import AdminProfile from "@/components/profile/AdminProfile";
import CatSitterProfile from "@/components/profile/CatSitterProfile";
import TutorProfile from "@/components/profile/TutorProfile";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return <LoadingScreen />;
  }

  const getProfileScreen = () => {
    if (user?.roles.includes("catsitter")) {
      return <CatSitterProfile />;
    } else if (user?.roles.includes("admin")) {
      return <AdminProfile />;
    } else {
      return <TutorProfile />;
    }
  };

  return <SafeAreaView>{getProfileScreen()}</SafeAreaView>;
}

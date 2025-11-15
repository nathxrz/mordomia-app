import AdminHome from "@/components/home/AdminHome";
import CatSitterHome from "@/components/home/CatSitterHome";
import TutorHome from "@/components/home/TutorHome";
import LoadingScreen from "@/components/LoadinfScreen";
import { useUser } from "@/hooks/useUser";
import { Redirect } from "expo-router";
import React from "react";

export default function HomePage() {
  const { user } = useUser();

  const getHomeScreen = () => {
    if (!user) {
      return <LoadingScreen />;
    }

    if (user.roles?.includes("admin") && user.deleted_at === null) {
      return <AdminHome />;
    } else if (user.roles?.includes("catsitter") && user.deleted_at === null) {
      return <CatSitterHome />;
    } else if (user.roles?.includes("tutor") && user.deleted_at === null) {
      return <TutorHome />;
    } else {
      return <Redirect href="./login" />;
    }
  };

  return getHomeScreen();
}

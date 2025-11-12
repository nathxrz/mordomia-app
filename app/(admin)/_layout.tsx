// app/tabs/_layout.js
import LoadingScreen from "@/components/LoadinfScreen";
import { useUser } from "@/hooks/useUser";
import { Tabs } from "expo-router";

export default function AdminLayout() {
  const { user } = useUser();

  if (!user) return <LoadingScreen />;

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="users" options={{ title: "Usuários" }} />
      <Tabs.Screen name="skills" options={{ title: "Habilidades" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

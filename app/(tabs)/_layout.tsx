// app/tabs/_layout.js
import { useUser } from "@/hooks/useUser";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const { user, loading } = useUser();

  console.log("user:", user);
  console.log("user role:", user?.roles.includes("admin"));

  if (loading) return null;

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      {user && user.roles.includes("admin") && (
        <>
          <Tabs.Screen name="users" options={{ title: "Usuários" }} />
          <Tabs.Screen name="skills" options={{ title: "Skills" }} />
        </>
      )}
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

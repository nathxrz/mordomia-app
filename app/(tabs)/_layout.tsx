// app/tabs/_layout.js
import { useUser } from "@/hooks/useUser";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const { user } = useUser();
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      {user?.is_admin && (
        <Tabs.Screen name="skills" options={{ title: "Skills" }} />
      )}
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

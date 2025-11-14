import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  const { user } = useUser();

  const isAdmin = user?.roles?.includes("admin");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4b5563",
      }}
    >
      {/* Abas comuns */}
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="users/index"
        options={{
          title: "Usuários",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
          href: isAdmin ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="skills/index"
        options={{
          title: "Habilidades",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" color={color} size={size} />
          ),
          href: isAdmin ? undefined : null,
        }}
      />

      {/* Aba comum */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

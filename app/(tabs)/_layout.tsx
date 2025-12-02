import { useUser } from "@/hooks/useUser";
import { MaterialSymbolsOutlined_400Regular } from "@expo-google-fonts/material-symbols-outlined";
import { useFonts } from "expo-font";
import { router, Tabs } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

export default function TabsLayout() {
  const { user } = useUser();

  const isAdmin = user?.roles?.includes("admin");

  let [fontsLoaded] = useFonts({
    MaterialSymbolsOutlined: MaterialSymbolsOutlined_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#fcfcfc",
        },
        tabBarActiveTintColor: "#CF0790",
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: {
          backgroundColor: "#fcfcfc",
          height: 110,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Mordomia",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Notificações",
                  "Funcionalidade em desenvolvimento."
                )
              }
            >
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 30,
                  lineHeight: 30,
                  marginRight: 16,
                  color: "#CF0790",
                }}
              >
                notifications
              </Text>
            </TouchableOpacity>
          ),
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 30,
                color: color,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              home
            </Text>
          ),
          tabBarIconStyle: {
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />

      <Tabs.Screen
        name="users/usersList/index"
        options={{
          title: "Usuários",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 30,
                color: color,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              group
            </Text>
          ),
          tabBarIconStyle: {
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          },
          href: isAdmin ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="skills/index"
        options={{
          title: "Habilidades",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 38,
                color: color,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              military_tech
            </Text>
          ),
          tabBarIconStyle: {
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          },
          href: isAdmin ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="schedules/index"
        options={{
          title: "Agendamentos",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 38,
                color: color,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              calendar_month
            </Text>
          ),
          tabBarIconStyle: {
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          },
          href: !isAdmin ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="chat/index"
        options={{
          title: "Mensagens",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 38,
                color: color,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Sms
            </Text>
          ),
          tabBarIconStyle: {
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          },
          href: !isAdmin ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("./edits/editProfileUser/")}
            >
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 30,
                  lineHeight: 30,
                  marginRight: 16,
                  color: "#CF0790",
                }}
              >
                edit
              </Text>
            </TouchableOpacity>
          ),
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 38,
                color: color,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              person
            </Text>
          ),
          tabBarIconStyle: {
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />

      <Tabs.Screen
        name="users/catsitters/[id]"
        options={{
          title: "Cat sitter",
          href: null,
        }}
      />

      <Tabs.Screen
        name="edits/editProfileUser/index"
        options={{
          title: "Editar Perfil",
          href: null,
        }}
      />

      <Tabs.Screen
        name="edits/editProfileAddress/index"
        options={{
          title: "Editar Endereço",
          href: null,
        }}
      />

      <Tabs.Screen
        name="cats/index"
        options={{
          title: "Meus Pets",
          href: null,
        }}
      />

      <Tabs.Screen
        name="cats/registerCat"
        options={{
          title: "Adicionar felino",
          href: null,
        }}
      />

      <Tabs.Screen
        name="cats/[id]"
        options={{
          title: "Detalhes do Felino",
          href: null,
        }}
      />
      <Tabs.Screen
        name="cats/editCat"
        options={{
          title: "Editar Felino",
          href: null,
        }}
      />

      <Tabs.Screen
        name="users/usersList/[id]"
        options={{
          title: "Detalhes do Usuário",
          href: null,
        }}
      />
      <Tabs.Screen
        name="skills/registerSkill"
        options={{
          title: "Adicionar Habilidade",
          href: null,
        }}
      />
      <Tabs.Screen
        name="skills/[id]"
        options={{
          title: "Detalhes da Habilidade",
          href: null,
        }}
      />
      <Tabs.Screen
        name="skills/editSkill"
        options={{
          title: "Editar Habilidade",
          href: null,
        }}
      />
      <Tabs.Screen
        name="schedules/formSchedule"
        options={{
          title: "Novo Agendamento",
          href: null,
        }}
      />
    </Tabs>
  );
}

import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

async function fetchUsers() {
  try {
    const { data: users, error } = await supabase
      .from("users_with_roles")
      .select("*")
      .order("roles", { ascending: true });

    if (error) {
      throw new Error(translateError(error.code));
    }

    return users;
  } catch (error) {
    Alert.alert("Erro ao buscar os usuários", String(error));
    return [];
  }
}

export default function UsersList() {
  const { user } = useUser();

  const [users, setUsers] = useState<
    {
      id: string;
      name: string;
      roles: string;
      avatar_url: string;
      created_at: Date;
      deleted_at: Date | null;
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      fetchUsers().then((data) => {
        if (data) setUsers(data);
      });
    }, [user?.id])
  );

  const UserItem = ({
    id,
    name,
    roles,
    avatar_url,
    created_at,
    deleted_at,
  }: {
    id: string;
    name: string;
    roles: string;
    avatar_url: string;
    created_at: Date;
    deleted_at: Date | null;
  }) => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginBottom: 20,
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.push(`/users/${id}`);
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1 }}>
                <Image
                  source={
                    avatar_url
                      ? { uri: avatar_url }
                      : require("../../assets/images/avatar.png")
                  }
                  style={{ width: 100, height: 100 }}
                />
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{name}</Text>
                <Text style={{ fontStyle: "italic", color: "#666" }}>
                  {roles}
                </Text>

                <View>
                  <Text style={{ marginVertical: 5, color: "#666" }}>
                    Criado em:{" "}
                    {new Intl.DateTimeFormat("pt-BR").format(
                      new Date(created_at)
                    )}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: deleted_at ? "red" : "green",
                    }}
                  >
                    {deleted_at ? "Desativado" : "Ativo"}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  function renderComponent() {
    if (users.length === 0) {
      return <Text>Você não possui habilidades cadastradas.</Text>;
    }

    return (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserItem
            id={item.id}
            name={item.name}
            roles={item.roles}
            avatar_url={item.avatar_url}
            created_at={item.created_at}
            deleted_at={item.deleted_at}
          />
        )}
      />
    );
  }

  return <View style={{ padding: 20 }}>{renderComponent()}</View>;
}

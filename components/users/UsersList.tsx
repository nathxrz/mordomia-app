import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
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
    const rolesArray = roles.split(",").map((r) => r.trim());

    const roleLabels = rolesArray.map((role) =>
      role === "admin"
        ? "Administrador"
        : role === "catsitter"
        ? "Cat Sitter"
        : role === "tutor"
        ? "Tutor"
        : role
    );

    const displayRoles = roleLabels.join(" - ");
    return (
      <TouchableOpacity
        onPress={() => {
          router.push(`/(tabs)/users/usersList/${id}`);
        }}
      >
        <View style={styles.cardContainer}>
          <Image
            source={
              avatar_url
                ? { uri: avatar_url }
                : require("../../assets/images/avatar.png")
            }
            style={styles.profileImage}
          />
          <View style={styles.cardContent}>
            <View style={styles.userInfoTitle}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text
                style={[
                  styles.statusText,
                  { color: deleted_at ? "#EE0101" : "#008000" },
                ]}
              >
                {deleted_at ? "Desativado" : "Ativo"}
              </Text>
            </View>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>
                Criado em:{" "}
                {new Intl.DateTimeFormat("pt-BR").format(new Date(created_at))}
              </Text>

              {deleted_at && (
                <Text style={styles.metaText}>
                  Desativado em:{" "}
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(deleted_at)
                  )}
                </Text>
              )}
            </View>
            <Text style={styles.rolesText}>{displayRoles}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  function renderComponent() {
    if (users.length === 0) {
      return <Text>Nenhum usuário encontrado.</Text>;
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

  return renderComponent();
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  userInfoTitle: {
    marginBottom: 12,
  },
  profileImage: {
    height: "100%",
    width: 134,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardTitle: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  rolesText: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontStyle: "italic",
    color: "#B83FCF",
    marginTop: 8,
  },
  metaContainer: {
    gap: 5,
  },
  metaText: {
    fontFamily: "Roboto",
    fontSize: 13,
    color: "#605A6D",
  },
  statusText: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "700",
  },
});

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
      .from("users")
      .select("*")
      .order("name", { ascending: true });

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
    avatar_url,
    created_at,
    deleted_at,
  }: {
    id: string;
    name: string;
    avatar_url: string;
    created_at: Date;
    deleted_at: Date | null;
  }) => {
    // const { deleteUser } = useUser(id);
    // const [modalVisibleConfirmed, setModalVisibleConfirmed] = useState(false);

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
                <View>
                  <Text style={{ marginVertical: 5, color: "#666" }}>
                    Criado em: {new Date(created_at).toLocaleDateString()}
                  </Text>
                  {deleted_at && (
                    <Text style={{ marginVertical: 5, color: "red" }}>
                      Deletado em: {new Date(deleted_at).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>

              {/* <TouchableOpacity onPress={() => setModalVisibleConfirmed(true)}>
                <Icon name="delete" size={24} color="#000" />
              </TouchableOpacity> */}
            </View>
          </TouchableOpacity>

          {/* <ConfirmedModal
            modalVisible={modalVisibleConfirmed}
            onConfirm={() => {
              deleteSkill(id);
              setSkills((prevSkills) =>
                prevSkills.filter((skill) => skill.id !== id)
              );
              setModalVisibleConfirmed(false);
            }}
            onCancel={() => setModalVisibleConfirmed(false)}
            message="Tem certeza que deseja excluir esta habilidade?"
          /> */}
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

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

async function fetchCatSitters() {
  try {
    const { data: catSitters, error } = await supabase
      .from("users")
      .select("*, cat_sitters!inner(id)")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(translateError(error.code));
    }

    return catSitters;
  } catch (error) {
    Alert.alert("Erro ao buscar os usuários", String(error));
    return false;
  }
}

export default function CatSittersList() {
  const { user } = useUser();

  const [users, setUsers] = useState<
    {
      id: string;
      name: string;
      // skills: string;
      avatar_url: string;
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      fetchCatSitters().then((data) => {
        if (data) setUsers(data);
      });
    }, [user?.id])
  );

  const UserItem = ({
    id,
    name,
    // skills,
    avatar_url,
  }: {
    id: string;
    name: string;
    // skills: string;
    avatar_url: string;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push(`/users/catsitters/${id}`);
        }}
        style={styles.profileCard}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
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
            <Text style={{ fontStyle: "italic", color: "#666" }}></Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  function renderComponent() {
    if (users.length === 0) {
      return <Text>Nenhum cat sitter encontrado.</Text>;
    }

    return (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserItem
            id={item.id}
            name={item.name}
            // skills={item.skills}
            avatar_url={item.avatar_url}
          />
        )}
      />
    );
  }

  return renderComponent();
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#FCFCFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A4459",
  },
});

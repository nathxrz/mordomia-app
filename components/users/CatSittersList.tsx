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
      >
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{name}</Text>
            <View style={styles.ratingContainer}>
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 16,
                  lineHeight: 16,
                  color: "#F2C94C",
                  marginRight: 4,
                }}
              >
                star
              </Text>
              <Text style={styles.ratingValue}>4.9</Text>
            </View>
            <View style={styles.priceDistanceContainer}>
              <Text style={styles.priceText}>R$45/visita</Text>
              <Text style={styles.distanceText}>1.2km</Text>
            </View>
            <Text
              style={styles.skillsText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              skills skills skills skills skills skills skills
            </Text>
          </View>
          <Image
            style={styles.profileImage}
            source={
              avatar_url
                ? { uri: avatar_url }
                : require("../../assets/images/avatar.png")
            }
          />
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
  cardContainer: {
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 18,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    height: 140,
  },
  cardContent: {
    paddingVertical: 18,
    paddingHorizontal: 21,
    borderWidth: 1,
    borderColor: "red",
    flex: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 16,
    color: "#333",
  },
  priceDistanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    color: "#333",
  },
  distanceText: {
    fontSize: 16,
    color: "#333",
  },
  skillsText: {
    fontSize: 14,
    color: "#666",
  },
  profileImage: {
    flex: 1,
    height: "100%",
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
  },
});

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
      .select(
        `
        id,
        name,
        avatar_url,
        cat_sitters!inner(id),
        skills!left(id, short_name)
      `
      )
      .order("name", { ascending: true });

    if (error) throw new Error(translateError(error.code));

    return catSitters || [];
  } catch (error) {
    Alert.alert("Erro ao buscar os usuários", String(error));
    return [];
  }
}

export default function CatSittersList() {
  const { user } = useUser();
  const [users, setUsers] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      fetchCatSitters().then((data) => setUsers(data));
    }, [user?.id])
  );

  const UserItem = ({ id, name, avatar_url, skills }: any) => {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/users/catsitters/${id}`)}
      >
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{name}</Text>

            <View style={styles.subtitleContainer}>
              <View style={styles.ratingContainer}>
                <Text
                  style={{
                    fontFamily: "MaterialSymbolsOutlined",
                    fontSize: 16,
                    lineHeight: 16,
                    color: "#F08000",
                    marginRight: 4,
                  }}
                >
                  star
                </Text>
                <Text style={styles.ratingValue}>4.9</Text>
              </View>
              <Text style={styles.priceText}>R$45/visita</Text>
              <Text style={styles.distanceText}>1.2km</Text>
            </View>

            <View style={styles.skillsContainer}>
              {skills && skills.length > 0 ? (
                skills.map((skill: any) => (
                  <Text key={skill.id} style={styles.skillsText}>
                    {skill.short_name}
                  </Text>
                ))
              ) : (
                <Text style={styles.skillsText}>Sem habilidades</Text>
              )}
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => router.push(`/users/catsitters/${id}`)}
              >
                <Text style={styles.infoText}>Ver perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Favoritar", "Funcionalidade em desenvolvimento.")
                }
              >
                <Text
                  style={{
                    fontFamily: "MaterialSymbolsOutlined",
                    fontSize: 25,
                    lineHeight: 25,
                    color: "#605A6D",
                    marginRight: 10,
                  }}
                >
                  favorite
                </Text>
              </TouchableOpacity>
            </View>
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

  return users.length === 0 ? (
    <Text>Nenhum cat sitter encontrado.</Text>
  ) : (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserItem
          id={item.id}
          name={item.name}
          avatar_url={item.avatar_url}
          skills={item.skills || []}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
    padding: 15,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Roboto",
    fontWeight: "700",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "700",
    color: "#7F13EC",
  },
  priceText: {
    color: "#4A4459",
    fontFamily: "Roboto",
    fontSize: 14,
  },
  distanceText: {
    color: "#4A4459",
    fontFamily: "Roboto",
    fontSize: 14,
  },
  skillsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    overflow: "hidden",
    flexWrap: "wrap",
  },
  skillsText: {
    fontFamily: "Roboto",
    fontSize: 12,
    textAlign: "center",
    borderRadius: 100,
    color: "#A40BC0",
    backgroundColor: "#FAE5FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Roboto",
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#7F13EC",
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  profileImage: {
    height: "100%",
    width: 134,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
});

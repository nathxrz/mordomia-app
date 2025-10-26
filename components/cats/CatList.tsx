import { useTutor } from "@/hooks/useTutor";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

async function fetchCats(userTutor: string) {
  try {
    const { data: cats, error } = await supabase
      .from("cats")
      .select("id, avatar_url, name")
      .eq("id_tutor", userTutor);

    if (error) {
      throw new Error(translateError(error.code));
    }
    return cats;
  } catch (error) {
    Alert.alert("Erro ao buscar pets", String(error));
  }
}

export default function CatList() {
  const tutor = useTutor();
  const [cats, setCats] = React.useState<
    { id: string; name: string; avatar_url: string }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      if (!tutor?.id) return;

      fetchCats(tutor.id).then((data) => {
        if (data) setCats(data);
      });
    }, [tutor?.id])
  );

  const CatItem = ({
    id,
    name,
    avatar_url,
  }: {
    id: string;
    name: string;
    avatar_url: string;
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
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.push(`./cats/${id}`);
            }}
          >
            <View
              style={{
                marginBottom: 10,
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Image
                source={{ uri: avatar_url }}
                style={{ width: 100, height: 100 }}
              />
              <Text>{name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  function renderComponent() {
    if (cats.length === 0) {
      return <Text>Você não possui pets cadastrados.</Text>;
    }
    return (
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatItem id={item.id} name={item.name} avatar_url={item.avatar_url} />
        )}
      />
    );
  }

  return <View>{renderComponent()}</View>;
}

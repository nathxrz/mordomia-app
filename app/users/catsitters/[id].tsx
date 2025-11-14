import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { Button } from "react-native-paper";

async function fetchCatSitter(id: string) {
  try {
    const { data: userData, error } = await supabase
      .from("user_with_address_catsitter_and_skills")
      .select("*")
      .eq("id", id);

    if (error) {
      throw new Error(translateError(error.code));
    }

    return userData;
  } catch (error) {
    Alert.alert("Erro ao buscar o cat sitter", String(error));
  }
}

export default function CatSitterDetails() {
  const { id } = useLocalSearchParams();
  const [catSitterData, setCatSitterData] = useState<{
    id: string;
    name: string;
    avatar_url: string;
    phone: string;
    date_birth: Date;
    biography: string;
    portfolio_url: string;
    email: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement: string;
    skills: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      fetchCatSitter(id as string).then((data) => {
        if (data && data.length > 0) setCatSitterData(data[0]);
      });
    }, [id])
  );

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <View style={{ marginBottom: 20 }}>
        <Image
          source={
            catSitterData?.avatar_url
              ? { uri: catSitterData?.avatar_url }
              : require("../../../assets/images/avatar.png")
          }
          style={{ width: 100, height: 100 }}
        />
        <Text>{catSitterData?.name}</Text>
        <Text>
          {catSitterData?.skills
            ? catSitterData.skills
            : "Nenhuma habilidade informada"}
        </Text>
        <Text>{catSitterData?.email}</Text>
        <Text>{catSitterData?.phone}</Text>
        <Text>
          Data de nascimento:{" "}
          {catSitterData?.date_birth
            ? new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
              }).format(new Date(catSitterData.date_birth))
            : "Data não informada"}
        </Text>
        <Text>Biografia: {catSitterData?.biography}</Text>
        <Text>
          Portfólio:{" "}
          {catSitterData?.portfolio_url
            ? catSitterData.portfolio_url
            : "Portfólio não informado"}
        </Text>
        {catSitterData?.cep && (
          <View>
            <Text>
              {catSitterData?.street}, {catSitterData?.number} -{" "}
              {catSitterData?.neighborhood}
            </Text>
            <Text>
              {catSitterData?.city} - {catSitterData?.state}
            </Text>
            <Text>{catSitterData?.cep}</Text>
            <Text>{catSitterData?.complement}</Text>
          </View>
        )}
      </View>

      <Button
        mode="contained"
        onPress={() => {
          router.back();
        }}
      >
        voltar
      </Button>
    </View>
  );
}

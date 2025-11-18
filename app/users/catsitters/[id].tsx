import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            style={styles.profileImage}
            source={
              catSitterData?.avatar_url
                ? { uri: catSitterData?.avatar_url }
                : require("../../../assets/images/avatar.png")
            }
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{catSitterData?.name}</Text>
            <Text style={styles.profileEmail}>{catSitterData?.email}</Text>
            <View style={styles.ratingContainer}>
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 14,
                  lineHeight: 14,
                  color: "#F08000",
                  marginRight: 4,
                }}
              >
                star
              </Text>
              <Text style={styles.profileReviews}>4.9 (23 reviews)</Text>
            </View>
          </View>
        </View>

        <View style={styles.basicInfoContainer}>
          <Text style={styles.basicInfoTitle}>Informações básicas</Text>
          <View style={styles.cardContainer}>
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 25,
                lineHeight: 25,
                color: "#B434CC",
                backgroundColor: "#FAE5FF",
                padding: 14,
                borderRadius: 13,
              }}
            >
              phone
            </Text>
            <Text style={styles.basicInfoPhone}>{catSitterData?.phone}</Text>
          </View>
          <View style={styles.cardContainer}>
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 25,
                lineHeight: 25,
                color: "#B434CC",
                backgroundColor: "#FAE5FF",
                padding: 14,
                borderRadius: 13,
              }}
            >
              location_on
            </Text>
            <View style={styles.addressContainer}>
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
          </View>
          <View style={styles.availabilityContainer}>
            <Text>Disponibilidade</Text>
            <Text>R$45/visita</Text>
          </View>
        </View>

        <View style={styles.biographyContainer}>
          <Text>Biografia: {catSitterData?.biography}</Text>
          <Text>
            Portfólio:{" "}
            {catSitterData?.portfolio_url
              ? catSitterData.portfolio_url
              : "Portfólio não informado"}
          </Text>
          <Text>
            {catSitterData?.skills
              ? catSitterData.skills
              : "Nenhuma habilidade informada"}
          </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F6F8",
    flex: 1,
  },
  container: {
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 30,
  },
  profileHeader: {
    alignItems: "center",
    gap: 20,
  },
  profileImage: {
    width: 144,
    height: 144,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  profileInfo: {
    alignItems: "center",
    gap: 4,
  },
  profileName: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
  },
  profileEmail: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#B83FCF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileReviews: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#4A4459",
  },
  basicInfoContainer: {},
  basicInfoTitle: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FCFCFC",
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  basicInfoPhone: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#000000",
    lineHeight: 20,
  },
  addressContainer: {},
  availabilityContainer: {},
  biographyContainer: {},
});

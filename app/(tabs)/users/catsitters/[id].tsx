import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [openAbout, setOpenAbout] = useState(false);
  const [openSocial, setOpenSocial] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
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
    <>
      <Stack.Screen
        options={{
          title: "Cat Sitter",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 30,
                  lineHeight: 30,
                  color: "#000",
                }}
              >
                arrow_back
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => Alert.alert("Chat em desenvolvimento...")}
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
                chat
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.profileHeader}>
              <Image
                style={styles.profileImage}
                source={
                  catSitterData?.avatar_url
                    ? { uri: catSitterData?.avatar_url }
                    : require("../../../../assets/images/avatar.png")
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
              <Text style={styles.titleSection}>Informações básicas</Text>
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
                <Text style={styles.titleCard}>{catSitterData?.phone}</Text>
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
                <View>
                  {catSitterData?.cep && (
                    <View>
                      <Text style={styles.titleCard}>
                        {catSitterData?.city} - {catSitterData?.state}
                      </Text>
                      <Text style={styles.subtitleCard}>
                        {catSitterData?.street}, {catSitterData?.number},{" "}
                        {catSitterData?.neighborhood}.
                      </Text>
                    </View>
                  )}
                </View>
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
                <View>
                  <Text style={styles.titleCard}>Disponibilidade</Text>
                  <Text style={styles.subtitleCard}>R$45/visita</Text>
                </View>
              </View>
            </View>

            <View style={styles.aboutContainer}>
              <Text style={styles.titleSection}>Portfólio e Skills</Text>
              <View style={styles.cardExpansiveContainer}>
                <TouchableOpacity
                  style={styles.headerExpandable}
                  onPress={() => setOpenAbout(!openAbout)}
                >
                  <Text style={styles.titleAboutSection}>Sobre o cuidador</Text>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 30,
                      lineHeight: 30,
                      color: "#000",
                    }}
                  >
                    {openAbout ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  </Text>
                </TouchableOpacity>

                {openAbout && (
                  <Text style={styles.description}>
                    {catSitterData?.biography}
                  </Text>
                )}
              </View>
              <View style={styles.cardExpansiveContainer}>
                <TouchableOpacity
                  style={styles.headerExpandable}
                  onPress={() => setOpenSocial(!openSocial)}
                >
                  <Text style={styles.titleAboutSection}>Redes sociais</Text>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 30,
                      lineHeight: 30,
                      color: "#000",
                    }}
                  >
                    {openSocial ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  </Text>
                </TouchableOpacity>

                {openSocial && (
                  <Text style={styles.description}>
                    {catSitterData?.portfolio_url || "Portfólio não informado."}
                  </Text>
                )}
              </View>

              <View style={styles.cardExpansiveContainer}>
                <TouchableOpacity
                  style={styles.headerExpandable}
                  onPress={() => setOpenSkills(!openSkills)}
                >
                  <Text style={styles.titleAboutSection}>Skills</Text>
                  <Text
                    style={{
                      fontFamily: "MaterialSymbolsOutlined",
                      fontSize: 30,
                      lineHeight: 30,
                      color: "#000",
                    }}
                  >
                    {openSkills ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  </Text>
                </TouchableOpacity>

                {openSkills && (
                  <View style={styles.skillsContainer}>
                    {/* <Text numberOfLines={1} ellipsizeMode="tail"> */}
                    {/* {skills.map((s) => s.short_name).join(" • ")} */}
                    <Text style={styles.skillsText}>Emergências</Text>
                    <Text style={styles.skillsText}>Idosos</Text>
                    <Text style={styles.skillsText}>Medicação</Text>
                    <Text style={styles.skillsText}>Idosos</Text>
                    <Text style={styles.skillsText}>Idosos</Text>
                    <Text style={styles.skillsText}>Emergências</Text>
                    <Text style={styles.skillsText}>Idosos</Text>
                    <Text style={styles.skillsText}>Medicação</Text>
                  </View>
                )}
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={styles.button_submit}
                onPress={() => Alert.alert("Cadastro em desenvolvimento...")}
              >
                <Text style={styles.buttonText}>Agendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
  basicInfoContainer: {
    gap: 10,
  },
  titleSection: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
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
  titleCard: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
    lineHeight: 20,
  },
  subtitleCard: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#B83FCF",
  },
  aboutContainer: {
    gap: 10,
  },
  cardExpansiveContainer: {
    position: "relative",
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 30,
  },
  titleAboutSection: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
  },
  description: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#4A4459",
  },
  arrowIconAbout: {
    position: "absolute",
    right: 21,
    top: 20,
    alignSelf: "center",
  },
  button_submit: {
    alignSelf: "flex-end",
    marginVertical: 30,
    backgroundColor: "#7F13EC",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 100,
    boxShadow: "0px 4px 4px #00000025",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
  },
  headerExpandable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
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
});

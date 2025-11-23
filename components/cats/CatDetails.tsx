import { useCat } from "@/hooks/useCat";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoadingScreen from "../LoadinfScreen";

export default function CatDetails({ catId }: { catId: string }) {
  const { cat, fetchCat } = useCat(catId);
  const [openInfoBasic, setOpenInfoBasic] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!catId) return;
      fetchCat();
    }, [catId, fetchCat])
  );

  if (!cat) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <View style={styles.profileHeader}>
        <Image style={styles.profileImage} source={{ uri: cat?.avatar_url }} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{cat?.name}</Text>
          <Text style={styles.profileAgeStage}> {cat?.age_stage}</Text>
        </View>
      </View>

      <View style={styles.aboutContainer}>
        <View style={styles.cardExpansiveContainer}>
          <TouchableOpacity
            style={styles.headerExpandable}
            onPress={() => setOpenInfoBasic(!openInfoBasic)}
          >
            <Text style={styles.titleAboutSection}>Informações básicas</Text>
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 30,
                color: "#000",
              }}
            >
              {openInfoBasic ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </Text>
          </TouchableOpacity>

          {openInfoBasic && (
            <View>
              <Text style={styles.description}>
                <Text style={styles.bold}>Gênero: </Text>
                {cat?.gender}
              </Text>

              <Text style={styles.description}>
                <Text style={styles.bold}>Raça: </Text>
                {cat?.breed}
              </Text>

              <Text style={styles.description}>
                <Text style={styles.bold}>Castrado? </Text>
                {cat?.is_neutered ? "Sim" : "Não"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F6F8",
    flex: 1,
  },
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 30,
  },

  profileHeader: {
    alignItems: "center",
    gap: 20,
    marginTop: 10,
    marginBottom: 30,
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

  profileAgeStage: {
    width: "100%",
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#B83FCF",
    textTransform: "capitalize",
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
  headerExpandable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bold: { fontWeight: "700" },
});

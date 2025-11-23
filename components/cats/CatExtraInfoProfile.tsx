import { useCat } from "@/hooks/useCat";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CatExtraInfoProfile({ catId }: { catId: string }) {
  const { getCatExtraInfo } = useCat(catId as string);
  const [catExtraInfo, setCatExtraInfo] = React.useState<any>(null);

  const [openRoutine, setOpenRoutine] = React.useState(false);
  const [openHealthNotes, setOpenHealthNotes] = React.useState(false);
  const [openSpecialNeeds, setOpenSpecialNeeds] = React.useState(false);

  const fetchExtraInfo = useCallback(async () => {
    const info = await getCatExtraInfo();
    setCatExtraInfo(info || null);
  }, [getCatExtraInfo]);

  useFocusEffect(() => {
    fetchExtraInfo();
  });

  return (
    <View style={styles.aboutContainer}>
      <View style={styles.cardExpansiveContainer}>
        <View style={styles.headerExpandable}>
          <Text style={styles.titleAboutSection}>Rotina e comportamento</Text>
          <TouchableOpacity onPress={() => setOpenRoutine(!openRoutine)}>
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 30,
                color: "#000",
              }}
            >
              {openRoutine ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </Text>
          </TouchableOpacity>
        </View>

        {openRoutine &&
          (catExtraInfo ? (
            <View>
              <Text style={styles.description}>
                <Text style={styles.bold}>Humor / Temperamento: </Text>
                {catExtraInfo.feeling || "Não informado"}
              </Text>
              <Text style={styles.description}>
                <Text style={styles.bold}>Uso da caixa de areia: </Text>
                {catExtraInfo.litter_box || "Não informado"}
              </Text>
              <Text style={styles.description}>
                <Text style={styles.bold}>Sociabilidade com humanos: </Text>
                {catExtraInfo.sociability_humans || "Não informado"}
              </Text>
              <Text style={styles.description}>
                <Text style={styles.bold}>
                  Sociabilidade com outros animais:{" "}
                </Text>
                {catExtraInfo.sociability_animals || "Não informado"}
              </Text>
              <Text style={styles.description}>
                <Text style={styles.bold}>Nível de atividade: </Text>
                {catExtraInfo.activity_level || "Não informado"}
              </Text>
            </View>
          ) : (
            <Text style={styles.description}>
              Nenhuma informação adicional disponível.
            </Text>
          ))}
      </View>

      <View style={styles.cardExpansiveContainer}>
        <View style={styles.headerExpandable}>
          <Text style={styles.titleAboutSection}>
            Observações gerais de saúde
          </Text>
          <TouchableOpacity
            onPress={() => setOpenHealthNotes(!openHealthNotes)}
          >
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 30,
                color: "#000",
              }}
            >
              {openHealthNotes ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </Text>
          </TouchableOpacity>
        </View>

        {openHealthNotes &&
          (catExtraInfo ? (
            <View>
              <Text style={styles.description}>
                <Text style={styles.bold}>Vacina antirrábica: </Text>
                {catExtraInfo.rabies_vaccine ? "Em dia" : "Atrasada"}
              </Text>
              <Text style={styles.description}>
                <Text style={styles.bold}>Anotações de saúde: </Text>
                {catExtraInfo.health_notes || "Não informado"}
              </Text>
            </View>
          ) : (
            <Text style={styles.description}>Nenhum dado registrado.</Text>
          ))}
      </View>

      <View style={styles.cardExpansiveContainer}>
        <View style={styles.headerExpandable}>
          <Text style={styles.titleAboutSection}>Cuidados especiais</Text>
          <TouchableOpacity
            onPress={() => setOpenSpecialNeeds(!openSpecialNeeds)}
          >
            <Text
              style={{
                fontFamily: "MaterialSymbolsOutlined",
                fontSize: 30,
                lineHeight: 30,
                color: "#000",
              }}
            >
              {openSpecialNeeds ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </Text>
          </TouchableOpacity>
        </View>

        {openSpecialNeeds &&
          (catExtraInfo ? (
            <View>
              <Text style={styles.description}>
                <Text style={styles.bold}>Necessidades especiais: </Text>
                {catExtraInfo.special_needs || "Não informado"}
              </Text>
            </View>
          ) : (
            <Text style={styles.description}>
              Nenhuma informação adicional disponível.
            </Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    gap: 8,
  },
  cardExpansiveContainer: {
    position: "relative",
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 20,
  },
  headerExpandable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleAboutSection: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#4A4459",
    marginBottom: 30,
  },
  bold: { fontWeight: "700" },
});

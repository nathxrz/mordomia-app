import { useCat } from "@/hooks/useCat";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

export default function CatExtraInfoProfile({ catId }: { catId: string }) {
  const { getCatExtraInfo } = useCat(catId as string);
  const [catExtraInfo, setCatExtraInfo] = React.useState<any>(null);

  const fetchExtraInfo = useCallback(async () => {
    const info = await getCatExtraInfo();
    if (info) {
      setCatExtraInfo(info);
    } else {
      setCatExtraInfo(null);
    }
  }, [getCatExtraInfo]);

  useFocusEffect(() => {
    fetchExtraInfo();
  });

  const hasExtraInfo = () => {
    if (catExtraInfo) {
      return (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Humor / Temperamento:</Text>
          <Text style={styles.value}>
            {catExtraInfo.feeling || "Não informado"}
          </Text>

          <Text style={styles.label}>Uso da caixa de areia:</Text>
          <Text style={styles.value}>
            {catExtraInfo.litter_box || "Não informado"}
          </Text>

          <Text style={styles.label}>Sociabilidade:</Text>
          <View>
            <Text style={styles.value}>
              Com humanos: {catExtraInfo.sociability_humans || "Não informado"}
            </Text>
          </View>
          <View>
            <Text style={styles.value}>
              Com outros animais:{" "}
              {catExtraInfo.sociability_animals || "Não informado"}
            </Text>
          </View>

          <Text style={styles.label}>Nível de atividade:</Text>
          <Text style={styles.value}>
            {catExtraInfo.activity_level || "Não informado"}
          </Text>

          <Text style={styles.label}>Vacina antirrábica:</Text>
          <Text style={styles.value}>
            {catExtraInfo.rabies_vaccine ? "Em dia" : "Atrasada"}
          </Text>

          <Text style={styles.label}>Anotações de saúde:</Text>
          <Text style={styles.value}>
            {catExtraInfo.health_notes || "Não informado"}
          </Text>

          <Text style={styles.label}>Necessidades especiais:</Text>
          <Text style={styles.value}>
            {catExtraInfo.special_needs || "Não informado"}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma informação adicional cadastrada para este gato.
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "./(stack)/cats/editCatExtraInfo",
            params: { id: catId },
          });
        }}
      >
        <Icon name="edit" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Bem-estar e Comportamento</Text>
      {hasExtraInfo()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1127",
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "500",
    color: "#7F13EC",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },
  updateButton: {
    marginTop: 16,
    borderColor: "#7F13EC",
  },
});

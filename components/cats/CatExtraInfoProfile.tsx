import { useCat } from "@/hooks/useCat";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

export default function CatExtraInfoProfile({ catId }: { catId: string }) {
  const { fetchCatExtraInfo } = useCat(catId as string);
  const [catExtraInfo, setCatExtraInfo] = React.useState<any>(null);

  useEffect(() => {
    const getExtraInfo = async () => {
      const info = await fetchCatExtraInfo();
      return info;
    };

    const catExtraInfo = getExtraInfo();
    if (catExtraInfo) {
      setCatExtraInfo(catExtraInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/cats/editCatExtraInfo",
            params: { id: catId },
          });
        }}
      >
        <Icon name="edit" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Bem-estar e Comportamento</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Humor / Temperamento:</Text>
        <Text style={styles.value}>
          {catExtraInfo?.feeling || "Não informado"}
        </Text>

        <Text style={styles.label}>Uso da caixa de areia:</Text>
        <Text style={styles.value}>
          {catExtraInfo?.litter_box || "Não informado"}
        </Text>

        <Text style={styles.label}>Sociabilidade:</Text>
        <Text style={styles.value}>
          {catExtraInfo?.sociability || "Não informado"}
        </Text>

        <Text style={styles.label}>Nível de atividade:</Text>
        <Text style={styles.value}>
          {catExtraInfo?.active_level || "Não informado"}
        </Text>

        <Text style={styles.label}>Anotações de saúde:</Text>
        <Text style={styles.value}>
          {catExtraInfo?.health_notes || "Nenhuma anotação"}
        </Text>

        <Text style={styles.label}>Necessidades especiais:</Text>
        <Text style={styles.value}>
          {catExtraInfo?.special_needs || "Nenhuma"}
        </Text>
      </View>
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

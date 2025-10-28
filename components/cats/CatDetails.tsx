import { useCat } from "@/hooks/useCat";
import formatDate from "@/scripts/format-date";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Image, Text, View } from "react-native";
import LoadingScreen from "../LoadinfScreen";

export default function CatDetails({ catId }: { catId: string }) {
  const { cat, fetchCat } = useCat(catId);

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
      <Image
        source={{ uri: cat?.avatar_url }}
        style={{ width: 100, height: 100 }}
      />
      <Text>Informações Básicas:</Text>
      <Text>Nome: {cat?.name}</Text>
      {cat?.date_birth && (
        <Text>Data de Nascimento: {formatDate(cat.date_birth)}</Text>
      )}
      <Text>Genero: {cat?.gender}</Text>
      <Text>Raça: {cat?.breed}</Text>
      <Text>Castrado: {cat?.castrated ? "Sim" : "Não"}</Text>
    </View>
  );
}

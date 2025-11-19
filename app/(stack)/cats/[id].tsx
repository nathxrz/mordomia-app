import CatDetailsProfile from "@/components/cats/CatDetails";
import CatExtraInfoProfile from "@/components/cats/CatExtraInfoProfile";
import ConfirmedModal from "@/components/modais/ConfirmedModal";
import { useCat } from "@/hooks/useCat";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CatDetails() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = React.useState(false);

  const { deleteCat } = useCat(id as string);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "./(stack)/cats/",
            params: { id: id },
          });
        }}
      >
        <Icon name="edit" size={24} color="#000" />
      </TouchableOpacity>

      {/* Informações básicas do gato: */}
      <CatDetailsProfile catId={id as string} />

      {/* Informações adicionais do gato: */}
      <CatExtraInfoProfile catId={id as string} />

      <Button
        mode="contained"
        onPress={() => {
          router.back();
        }}
      >
        voltar
      </Button>
      <Button mode="outlined" onPress={() => setModalVisible(true)}>
        excluir gato
      </Button>

      <ConfirmedModal
        modalVisible={modalVisible}
        onConfirm={() => {
          deleteCat(id as string);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
        message="Tem certeza que deseja excluir este felino?"
      />
    </View>
  );
}

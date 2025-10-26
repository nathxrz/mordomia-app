import CatDetailsProfile from "@/components/cats/CatDetails";
import ConfirmedModal from "@/components/modais/ConfirmedModal";
import { useCat } from "@/hooks/useCat";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, TouchableOpacity, View } from "react-native";
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
            pathname: "/cats/editCat",
            params: { id: id },
          });
        }}
      >
        <Icon name="edit" size={24} color="#000" />
      </TouchableOpacity>
      <CatDetailsProfile catId={id as string} />
      <Button
        title="voltar"
        onPress={() => {
          router.back();
        }}
      />
      <Button title="excluir gato" onPress={() => setModalVisible(true)} />

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

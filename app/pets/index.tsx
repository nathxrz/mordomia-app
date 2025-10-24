import RegisterPet from "@/components/RegisterPet";
import React from "react";
import { Button, View } from "react-native";

export default function PetsIndex() {
  const [visible, setVisible] = React.useState(false);

  function onClose() {
    setVisible(false);
  }

  return (
    <>
      {visible ? (
        <RegisterPet onClose={onClose} />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button title="Adicionar pet" onPress={() => setVisible(true)} />
        </View>
      )}
    </>
  );
}

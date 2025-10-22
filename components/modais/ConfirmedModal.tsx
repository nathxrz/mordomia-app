import { Button, Modal, Text, View } from "react-native";

export default function ConfirmedModal({
  modalVisible,
  onConfirm,
  onCancel,
}: {
  modalVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onCancel}
    >
      <View>
        <Text>Tem certeza que deseja continuar?</Text>
        <Button title="Confirmar" onPress={onConfirm} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </Modal>
  );
}

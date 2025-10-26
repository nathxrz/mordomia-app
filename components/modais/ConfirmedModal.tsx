import { Button, Modal, Text, View } from "react-native";

export default function ConfirmedModal({
  modalVisible,
  onConfirm,
  onCancel,
  message,
}: {
  modalVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onCancel}
    >
      <View>
        <Text>{message}</Text>
        <Button title="Confirmar" onPress={onConfirm} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </Modal>
  );
}

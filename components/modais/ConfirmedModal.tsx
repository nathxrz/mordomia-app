import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaProvider>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onCancel}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{message}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={{ ...styles.button, ...styles.buttonConfirm }}
                  onPress={onConfirm}
                >
                  <Text style={styles.textStyleButtonConfirm}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.button, ...styles.buttonCancel }}
                  onPress={onCancel}
                >
                  <Text style={styles.textStyleButtonCancel}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 22,
    backgroundColor: "#fff",

    paddingHorizontal: 35,
    paddingVertical: 25,

    marginHorizontal: 20,

    gap: 20,
  },
  modalText: {
    fontFamily: "Roboto",
    fontSize: 16,
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 10,
  },
  button: {
    borderRadius: 22,
    padding: 15,
    elevation: 2,
  },
  buttonConfirm: {
    backgroundColor: "#7F13EC",
  },
  buttonCancel: {
    backgroundColor: "#DFD2FF",
  },
  textStyleButtonConfirm: {
    color: "#fcfcfc",
    textAlign: "center",
    fontSize: 16,
  },
  textStyleButtonCancel: {
    color: "#5910A2",
    textAlign: "center",
    fontSize: 16,
  },
});

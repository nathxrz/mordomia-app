import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { useContext, useState } from "react";
import * as yup from "yup";

import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import Icon from "react-native-vector-icons/MaterialIcons";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    password: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Use letra maiúscula, minúscula, número e símbolo"
      ),
  })
  .required();

export default function ConfirmedModalPassword({
  modalVisible,
  onConfirm,
  onCancel,
}: {
  modalVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { confirmedPassword } = useContext(AuthContext);
  const { desactivateProfile } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "" },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  return (
    <SafeAreaProvider>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onCancel}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Digite sua senha para prosseguir:
            </Text>

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    style={{ backgroundColor: "#fcfcfc" }}
                    right={
                      <TextInput.Icon
                        icon={() =>
                          showPassword ? (
                            <Icon name="visibility" size={20} color="#B434CC" />
                          ) : (
                            <Icon
                              name="visibility-off"
                              size={20}
                              color="#B434CC"
                            />
                          )
                        }
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    placeholder="Senha"
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password?.message}</Text>
              )}
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={{ ...styles.button, ...styles.buttonConfirm }}
                onPress={handleSubmit(async (data) => {
                  const result = await confirmedPassword(data.password);
                  if (result) {
                    onConfirm();
                    desactivateProfile();
                  }
                })}
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
    width: "90%",
  },
  modalText: {
    fontFamily: "Roboto",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
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
  errorText: {
    color: "#EE0101",
    fontSize: 13,
    marginTop: 4,
  },
});

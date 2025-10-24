import { Button, Modal, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

import { yupResolver } from "@hookform/resolvers/yup";

import { Controller, useForm } from "react-hook-form";

import { useContext, useState } from "react";
import * as yup from "yup";

import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import Icon from "react-native-vector-icons/MaterialIcons";

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
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onCancel}
    >
      <View>
        <Text>Digite sua senha para prosseguir:</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Senha"
              right={
                <TextInput.Icon
                  icon={() =>
                    showPassword ? (
                      <Icon name="visibility" size={20} color="#888" />
                    ) : (
                      <Icon name="visibility-off" size={20} color="#888" />
                    )
                  }
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              onChangeText={onChange}
              value={value}
              secureTextEntry={!showPassword}
              placeholder="Digite sua senha"
            />
          )}
        />

        {errors.password && (
          <Text style={styles.messageAlert}>{errors.password?.message}</Text>
        )}

        <Button
          title="Confirmar"
          onPress={handleSubmit(async (data) => {
            const result = await confirmedPassword(data.password);
            if (result) {
              onConfirm(); // fecha o modal
              desactivateProfile(); // chama exclusão
            }
          })}
        />

        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  messageAlert: { color: "red" },
});

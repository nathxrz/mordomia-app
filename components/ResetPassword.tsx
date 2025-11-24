import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("E-mail inválido")
      .required(requiredMessage),
  })
  .required();

export default function SignIn() {
  const { loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
        enableOnAndroid={true}
      >
        <View style={styles.container}>
          <View>
            <View>
              <Text style={styles.textLabel}>
                Informe o e-mail associado à sua conta
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <Icon name="person" size={20} color="#7F13EC" />
                        )}
                      />
                    }
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="E-mail"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                )}
              />

              {errors.email && (
                <Text style={styles.errorText}>{errors.email?.message}</Text>
              )}
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.button_submit}
              disabled={loading}
              onPress={() => Alert.alert("clicou")}
            >
              <Text style={styles.buttonText}>
                {loading ? "Enviando..." : "Enviar e-mail"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FCFCFC",
    flex: 1,
  },
  container: {
    position: "relative",
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginTop: -100,
  },
  textLabel: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button_submit: {
    alignSelf: "flex-end",
    marginTop: 50,
    backgroundColor: "#7F13EC",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 100,
    boxShadow: "0px 4px 4px #00000025",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
  },
  errorText: {
    color: "#EE0101",
    fontSize: 13,
    marginTop: 4,
  },
});

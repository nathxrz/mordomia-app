import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

    password: yup.string().trim().required(requiredMessage),
  })
  .required();

export default function SignIn() {
  const { signIn, loading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  return (
    <SafeAreaView style={{ backgroundColor: "#FCFCFC", flex: 1 }}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={100}
        style={styles.container}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Mordomia</Text>
          <Text style={styles.subtitle}>Seja bem-vindo de volta!</Text>
        </View>
        <View>
          <View style={styles.inputsContainer}>
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7F13EC"
                    outlineColor="#7F13EC"
                    activeOutlineColor="#7F13EC"
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
                    placeholder="email@address.com"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                )}
              />

              {errors.email && (
                <Text style={styles.messageAlert}>{errors.email?.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7F13EC"
                    outlineColor="#7F13EC"
                    activeOutlineColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    textColor="#7F13EC"
                    left={
                      <TextInput.Icon
                        icon={() =>
                          showPassword ? (
                            <Icon name="visibility" size={20} color="#7F13EC" />
                          ) : (
                            <Icon
                              name="visibility-off"
                              size={20}
                              color="#7F13EC"
                            />
                          )
                        }
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry={!showPassword}
                    placeholder="Senha"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                )}
              />

              {errors.password && (
                <Text style={styles.messageAlert}>
                  {errors.password?.message}
                </Text>
              )}
            </View>
          </View>
          <Link style={styles.link} href="/login/recover-password">
            Esqueceu a senha?
          </Link>
          <View>
            <TouchableOpacity
              style={styles.button_submit}
              disabled={loading}
              onPress={handleSubmit(async (data) => {
                await signIn(data.email, data.password);
              })}
            >
              <Text style={styles.buttonText}>
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Link
          style={{ ...styles.link, ...styles.link_signup }}
          href="/login/signup"
        >
          Não tem uma conta? Crie aqui.
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    height: "100%",
    backgroundColor: "#FCFCFC",
    padding: 16,
    justifyContent: "center",
  },

  titleSection: {
    fontFamily: "Inter",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginBottom: 17,
  },
  title: {
    fontWeight: "normal",
    fontSize: 30,
    color: "#1D1127",
  },
  subtitle: {
    fontWeight: "light",
    fontSize: 16,
    color: "#913FDE",
  },
  inputsContainer: {
    display: "flex",
    gap: 14,
  },
  textInput: {
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button_submit: {
    marginTop: 20,
    backgroundColor: "#7F13EC",
    padding: 16,
    borderRadius: 100,
    boxShadow: "0px 4px 4px #00000025",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 14,
    color: "#7F13EC",
    marginTop: 17,
  },
  link_signup: {
    position: "absolute",
    bottom: 26,
    width: "100%",
    textAlign: "center",
    color: "#7F13EC",
    fontWeight: "bold",
    fontSize: 14,
  },
  messageAlert: { color: "red", marginTop: 4, fontSize: 12, marginLeft: 10 },
});

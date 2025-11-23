import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
        enableOnAndroid={true}
      >
        <View style={styles.container}>
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
                      placeholderTextColor="#7f13ecab"
                      outlineColor="#979797"
                      activeOutlineColor="#979797"
                      textColor="#7F13EC"
                      theme={{ roundness: 100 }}
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <Icon name="person" size={20} color="#B434CC" />
                          )}
                        />
                      }
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="E-mail"
                      autoCapitalize="none"
                    />
                  )}
                />

                {errors.email && (
                  <Text style={styles.errorText}>{errors.email?.message}</Text>
                )}
              </View>

              <View>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      mode="outlined"
                      placeholderTextColor="#7f13ecab"
                      activeOutlineColor="#979797"
                      outlineColor="#979797"
                      theme={{ roundness: 100 }}
                      textColor="#7F13EC"
                      left={
                        <TextInput.Icon
                          icon={() =>
                            showPassword ? (
                              <Icon
                                name="visibility"
                                size={20}
                                color="#B434CC"
                              />
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
                      onBlur={onBlur}
                      value={value}
                      secureTextEntry={!showPassword}
                      placeholder="Senha"
                      autoCapitalize="none"
                    />
                  )}
                />

                {errors.password && (
                  <Text style={styles.errorText}>
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

          <Link style={styles.link_signup} href="/login/signup">
            Não tem uma conta? Crie aqui.
          </Link>
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
    justifyContent: "center",
    paddingHorizontal: 16,
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
    color: "#7F13EC",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
  },
  errorText: {
    color: "#EE0101",
    fontSize: 13,
    marginTop: 4,
  },
});

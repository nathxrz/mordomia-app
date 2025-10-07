import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
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
  const { signInWithEmail, loading } = useContext(AuthContext);
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <>
          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  left={
                    <TextInput.Icon
                      icon={() => <Icon name="person" size={20} color="#888" />}
                    />
                  }
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder="email@address.com"
                  autoCapitalize="none"
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
                  label="Password"
                  left={
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
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={!showPassword}
                  placeholder="Password"
                  autoCapitalize="none"
                />
              )}
            />

            {errors.password && (
              <Text style={styles.messageAlert}>
                {errors.password?.message}
              </Text>
            )}
          </View>
          <View>
            <Button
              mode="contained"
              disabled={loading}
              onPress={handleSubmit(async (data) => {
                await signInWithEmail(data.email, data.password);
              })}
            >
              Entrar
            </Button>
          </View>
          <Link style={styles.link} href="/login/recover-password">
            Esqueceu a senha?
          </Link>
          <Link style={styles.link} href="/login/signup">
            Criar uma conta
          </Link>
        </>
      </ScrollView>
    </SafeAreaView>
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
  link: {
    marginTop: 20,
  },
  messageAlert: { color: "red" },
});

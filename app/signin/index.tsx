import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    email: yup.string().email("Email inválido").required(requiredMessage),

    password: yup.string().required(requiredMessage),
    // .min(8, "Senha deve ter no mínimo 8 caracteres")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número, um caractere especial e ter no mínimo 8 caracteres"
    // ),
  })
  .required();

export default function SignIn() {
  const { signInWithEmail, loading } = useContext(AuthContext);

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
    <SafeAreaView>
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
                      icon={() => (
                        <Icon name="envelope" size={20} color="#888" />
                      )}
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
                      icon={() => <Icon name="lock" size={20} color="#888" />}
                    />
                  }
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry
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
          <Link style={styles.link} href="./recover-password">
            Esqueceu a senha?
          </Link>
          <Link style={styles.link} href="./signup">
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

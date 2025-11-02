import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import maskPhone from "@/scripts/mask-phone";
import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import formatDate from "@/scripts/format-date";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import MaskInput from "react-native-mask-input";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    avatar_url: yup.string().required("Selecione uma foto de perfil"),
    name: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(3, "Nome deve ter no mínimo 3 caracteres"),
    phone: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^\([1-9]{2}\)\s9[0-9]{4}-[0-9]{4}$/,
        "Formato esperado: (99) 99999-9999"
      ),
    birthDate: yup
      .string()
      .required(requiredMessage)
      .test("valid-date", "Data inválida", (value) => {
        if (!value || value.length < 10) return false;

        const [dayStr, monthStr, yearStr] = value.split("/");
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);

        if (day === 0 || month === 0 || year === 0) return false;

        const parsed = new Date(`${year}-${month}-${day}`);
        if (isNaN(parsed.getTime())) return false;

        const today = new Date();
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(today.getFullYear() - 100);

        return parsed <= today && parsed >= hundredYearsAgo;
      })
      .test("valid-format", "Data deve estar no formato dd/mm/aaaa", (value) =>
        /^\d{2}\/\d{2}\/\d{4}$/.test(value || "")
      ),
  })
  .required();

async function pickImageAndSet(onChange: (uri: string) => void) {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      onChange(uri);
    }
  } catch (error) {
    console.error("Erro ao selecionar imagem:", error);
  }
}

export default function EditProfileUser() {
  const { user, updateProfile } = useUser();

  const { loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar_url: "",
      name: "",
      phone: "",
      birthDate: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        avatar_url: user.avatar_url,
        name: user.name,
        phone: maskPhone(user.phone),
        birthDate: formatDate(user.date_birth),
      });
    }
  }, [user, reset]);

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
              name="avatar_url"
              render={({ field: { value, onChange } }) => (
                <View style={styles.container}>
                  <Button onPress={() => pickImageAndSet(onChange)}>
                    Selecionar foto de perfil
                  </Button>

                  {value && (
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        marginTop: 10,
                        borderRadius: 10,
                      }}
                      source={{ uri: value }}
                    />
                  )}
                </View>
              )}
            />
            {errors.avatar_url && (
              <Text style={styles.messageAlert}>
                {errors.avatar_url?.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text>Nome completo</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Digite seu nome completo"}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.messageAlert}>{errors.name?.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text>Telefone</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <MaskInput
                  value={value}
                  onChangeText={(masked) => onChange(masked)}
                  mask={[
                    "(",
                    /\d/,
                    /\d/,
                    ")",
                    " ",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    paddingVertical: 8,
                    fontSize: 16,
                  }}
                  keyboardType="phone-pad"
                  placeholder="(99) 99999-9999"
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.messageAlert}>{errors.phone?.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text>Data de nascimento</Text>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value ? value : ""}
                  placeholder="dd/mm/aaaa"
                  render={(props) => (
                    <MaskInput
                      {...props}
                      value={value}
                      onChangeText={(masked) => onChange(masked)}
                      mask={[
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                      ]}
                      style={{
                        borderBottomWidth: 1,
                        borderColor: "#ccc",
                        paddingVertical: 8,
                        fontSize: 16,
                      }}
                      keyboardType="numeric"
                    />
                  )}
                />
              )}
            />
            {errors.birthDate && (
              <Text style={styles.messageAlert}>
                {errors.birthDate?.message}
              </Text>
            )}
          </View>

          <View>
            <Button
              mode="contained"
              disabled={loading}
              style={styles.mt20}
              onPress={handleSubmit((data) => {
                const [day, month, year] = data.birthDate.split("/");
                const birthDate = new Date(`${year}-${month}-${day}T00:00:00`);

                updateProfile(
                  data.avatar_url,
                  data.name,
                  data.phone.replace(/\D/g, ""),
                  birthDate
                );
              })}
            >
              Salvar alterações
            </Button>

            <Button
              onPress={() => {
                router.push("/(tabs)/profile");
              }}
              style={{ marginTop: 10 }}
            >
              Cancelar
            </Button>
          </View>
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
  messageAlert: { color: "red" },
});

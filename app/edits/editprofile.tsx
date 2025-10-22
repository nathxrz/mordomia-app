import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    avatar_url: yup.string().nullable(),
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
    birthDate: yup.date().required(requiredMessage).nullable(),
  })
  .required();

function formatDate(dateString?: string | Date) {
  if (!dateString) return "";
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function maskPhone(phone?: string) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export default function EditProfile() {
  const { user, updateProfile } = useUser();
  const [open, setOpen] = useState(false);

  const { loading } = useContext(AuthContext);

  const [image, setImage] = React.useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

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
      birthDate: null,
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
        birthDate: user.date_birth ? new Date(user.date_birth) : null,
      });

      setImage(user.avatar_url || null);
    }
  }, [user, reset]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <>
          <View style={styles.container}>
            <Button onPress={pickImage}>
              Escolher uma foto de perfil
              {image && <Image source={{ uri: image }} />}
            </Button>
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text variant="labelLarge">Nome completo</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value || user?.name}
                  placeholder={user?.name}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.messageAlert}>{errors.name?.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text variant="labelLarge">Telefone</Text>
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

          <View>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <>
                  {open && (
                    <DateTimePicker
                      value={value || new Date(user?.date_birth)}
                      onChange={(event, selectedDate) => {
                        onChange(selectedDate || value);
                        setOpen(false);
                      }}
                      maximumDate={new Date()}
                    />
                  )}

                  <TouchableOpacity onPress={() => setOpen(true)}>
                    <TextInput
                      editable={false}
                      label="Data de nascimento"
                      pointerEvents="none"
                      value={
                        value
                          ? value.toLocaleDateString("pt-BR")
                          : formatDate(user?.date_birth)
                      }
                      placeholder="Selecione sua data de nascimento"
                    />
                  </TouchableOpacity>
                </>
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
                updateProfile(
                  image,
                  data.name,
                  data.phone.replace(/\D/g, ""),
                  data.birthDate as Date
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

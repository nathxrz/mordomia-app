import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Switch, View } from "react-native";

import { Controller, useForm } from "react-hook-form";

import { AuthContext } from "@/context/AuthProvider";
import { useCat } from "@/hooks/useCat";
import { Button, Text, TextInput } from "react-native-paper";
import Picker from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    avatar_url: yup.string().required("Selecione uma foto do gato"),
    name: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(2, "Nome deve ter no mínimo 2 caracteres"),
    breed: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(2, "Raça deve ter no mínimo 2 caracteres"),
    castrated: yup.boolean().required(),
    gender: yup.string().nullable().required(),
    age_stage: yup.string().nullable().required(),
  })
  .required();

export default function EditCat({ catId }: { catId: string }) {
  const { cat, updateCat } = useCat(catId as string);
  const { loading } = useContext(AuthContext);

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar_url: "",
      name: "",
      breed: "",
      age_stage: undefined,
      castrated: false,
      gender: undefined,
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (cat) {
      reset({
        avatar_url: cat.avatar_url,
        name: cat.name,
        breed: cat.breed,
        age_stage: cat.age_stage,
        castrated: !!cat.castrated,
        gender: cat.gender,
      });
    }
  }, [cat, reset]);

  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Text>Cadastro de Pet</Text>

        <View>
          <Controller
            control={control}
            name="avatar_url"
            render={({ field: { value, onChange } }) => (
              <View style={styles.container}>
                <Button onPress={() => pickImageAndSet(onChange)}>
                  {value && "Trocar foto do gato"}
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

        <View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nome"
                onChangeText={onChange}
                value={value}
                placeholder={"Digite o nome do seu gato(a)"}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.messageAlert}>{errors.name?.message}</Text>
          )}
        </View>

        <View>
          <Controller
            control={control}
            name="age_stage"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{ label: "Selecione a idade", value: null }}
                  items={[
                    { label: "Filhote — até 1 ano de idade", value: "filhote" },
                    { label: "Jovem — entre 1 e 3 anos", value: "jovem" },
                    { label: "Adulto — entre 3 e 7 anos", value: "adulto" },
                    { label: "Idoso — acima de 7 anos", value: "idoso" },
                  ]}
                  onValueChange={(value) => onChange(value)}
                  value={value}
                />
                {errors.age_stage && (
                  <Text style={styles.messageAlert}>
                    {errors.age_stage.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Controller
            control={control}
            name="gender"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{ label: "Selecione o gênero", value: null }}
                  items={[
                    { label: "Macho", value: "Macho" },
                    { label: "Fêmea", value: "Fêmea" },
                  ]}
                  onValueChange={(value) => onChange(value)}
                  value={value}
                />
                {errors.gender && (
                  <Text style={styles.messageAlert}>
                    {errors.gender.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Controller
            control={control}
            name="breed"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Raça"
                onChangeText={onChange}
                value={value}
                placeholder={cat?.breed}
              />
            )}
          />
          {errors.breed && (
            <Text style={styles.messageAlert}>{errors.breed?.message}</Text>
          )}
        </View>

        <View>
          <Controller
            control={control}
            name="castrated"
            render={({ field: { value, onChange } }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Switch
                  value={!!value}
                  onValueChange={onChange}
                  thumbColor={value ? "#fff" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
                <Text style={{ marginLeft: 8 }}>Castrado?</Text>
              </View>
            )}
          />
        </View>

        <View>
          <Button
            mode="contained"
            disabled={loading}
            style={styles.mt20}
            onPress={handleSubmit(async (data) => {
              await updateCat(
                catId as string,
                data.name,
                data.age_stage,
                data.gender,
                data.breed,
                data.castrated,
                data.avatar_url
              );
            })}
          >
            Salvar alterações
          </Button>

          <Button
            onPress={() => {
              router.back();
            }}
          >
            Cancelar
          </Button>
        </View>
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

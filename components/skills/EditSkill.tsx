import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { Controller, useForm } from "react-hook-form";

import { AuthContext } from "@/context/AuthProvider";
import { useSkill } from "@/hooks/useSkill";
import { useUser } from "@/hooks/useUser";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    name: yup
      .string()
      .min(2, "Nome deve ter no mínimo 2 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres")
      .trim()
      .required(requiredMessage),
    description: yup
      .string()
      .max(255, "Descrição deve ter no máximo 255 caracteres")
      .trim()
      .nullable(),
  })
  .required();

export default function EditSkill({ skillId }: { skillId: string }) {
  const { loading } = useContext(AuthContext);
  const { user } = useUser();
  const { skill, updateSkill } = useSkill(skillId as string);

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
      name: "",
      description: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (skill) {
      reset({
        name: skill.name,
        description: skill.description,
      });
    }
  }, [skill, reset]);

  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Text>Atualização de Habilidade</Text>

        <View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nome"
                onChangeText={onChange}
                value={value}
                placeholder={"Digite o nome da habilidade"}
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
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Descrição"
                onChangeText={onChange}
                value={value || ""}
                placeholder={"Digite a descrição da habilidade"}
              />
            )}
          />
          {errors.description && (
            <Text style={styles.messageAlert}>
              {errors.description?.message}
            </Text>
          )}
        </View>

        <View>
          <Button
            mode="contained"
            disabled={loading}
            style={styles.mt20}
            onPress={handleSubmit(async (data) => {
              if (!user) throw new Error("Usuário não autenticado");

              await updateSkill({
                id: skillId,
                name: data.name,
                description: data.description || "",
                id_admin: user.id,
              });
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

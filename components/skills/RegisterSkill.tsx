import { yupResolver } from "@hookform/resolvers/yup";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useContext } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import { Controller, useForm } from "react-hook-form";

import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, TextInput } from "react-native-paper";
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

async function createSkill(name: string, description: string, userId: string) {
  try {
    const { error } = await supabase.from("skills").insert([
      {
        name,
        description,
        id_admin: userId,
        created_at: new Date(),
      },
    ]);

    if (error) {
      throw new Error(translateError(error.code));
    }
    Alert.alert("Habilidade adicionada com sucesso!");
  } catch (error) {
    Alert.alert("Erro ao criar habilidade", String(error));
  }
}

export default function RegisterSkill() {
  const { loading } = useContext(AuthContext);
  const { user } = useUser();

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

  useFocusEffect(
    useCallback(() => {
      reset({
        name: "",
        description: "",
      });
    }, [reset])
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Adicionar habilidade",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/skills")}
              style={{ marginLeft: 16 }}
            >
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 30,
                  lineHeight: 30,
                  color: "#000",
                }}
              >
                arrow_back
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView edges={[]} style={styles.safeArea}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: 60 }}
          enableOnAndroid={true}
        >
          <View style={styles.container}>
            <View style={styles.sectionForm}>
              <View style={styles.inputsContainer}>
                <View>
                  <Text style={styles.inputTitle}>Nome</Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        mode="outlined"
                        placeholderTextColor="#7f13ecab"
                        outlineColor="#979797"
                        activeOutlineColor="#979797"
                        textColor="#7F13EC"
                        theme={{ roundness: 100 }}
                        onChangeText={onChange}
                        value={value}
                        style={{ backgroundColor: "#FCFCFC" }}
                        activeUnderlineColor="#6200ee"
                        placeholder="Digite o nome da habilidade"
                      />
                    )}
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name?.message}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.inputTitle}>Descrição (opcional)</Text>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#7f13ecab"
                        outlineColor="#979797"
                        activeOutlineColor="#979797"
                        textColor="#7F13EC"
                        theme={{ roundness: 15 }}
                        onChangeText={onChange}
                        value={value || ""}
                        style={{
                          backgroundColor: "#FCFCFC",
                          paddingVertical: 12,
                        }}
                        placeholder="Digite uma descrição para a habilidade"
                      />
                    )}
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>
                      {errors.description?.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.button_submit}
                disabled={loading}
                onPress={handleSubmit(async (data) => {
                  if (!user) throw new Error("Usuário não autenticado");

                  await createSkill(data.name, data.description || "", user.id);
                  router.push("/(tabs)/skills");
                })}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Salvando" : "Salvar informações"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F6F8",
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    gap: 16,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 144,
    height: 144,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  selectPhotoText: {
    color: "#B83FCF",
    fontSize: 16,
  },
  sectionForm: {
    backgroundColor: "#fcfcfc",
    paddingHorizontal: 16,
    paddingVertical: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  inputsContainer: {
    display: "flex",
    gap: 18,
  },

  inputTitle: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#1D1127",
    lineHeight: 20,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button_submit: {
    alignSelf: "flex-end",
    marginTop: 30,
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
  labelInfoBasics: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 20,
    color: "#1D1127",
  },
});

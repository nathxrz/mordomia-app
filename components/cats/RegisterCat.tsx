import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useContext } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Controller, useForm } from "react-hook-form";

import { AuthContext } from "@/context/AuthProvider";
import { useTutor } from "@/hooks/useTutor";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { TextInput } from "react-native-paper";
import Picker from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    avatar_url: yup.string().required("Selecione uma foto do seu felino"),
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
    gender: yup.string().required(requiredMessage),
    age_stage: yup.string().required(requiredMessage),
  })
  .required();

async function createCat(
  name: string,
  age_stage: string,
  gender: string,
  breed: string,
  isCastrated: boolean,
  avatar_url: string,
  userTutor: string
) {
  try {
    const { error } = await supabase.from("cats").insert([
      {
        name,
        age_stage,
        gender,
        breed,
        castrated: isCastrated,
        avatar_url,
        id_tutor: userTutor,
      },
    ]);

    if (error) throw new Error(translateError(error.code));

    Alert.alert("Sucesso", "Felino adicionado com sucesso!");
    router.push("/(tabs)/cats");
  } catch (error) {
    Alert.alert("Erro ao criar pet", String(error));
  }
}

async function pickImageAndSet(onChange: (uri: string) => void) {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) onChange(uri);
    }
  } catch (error) {
    console.error("Erro ao selecionar imagem:", error);
  }
}

export default function RegisterCat() {
  const { loading: authLoading } = useContext(AuthContext);
  const { userTutor, loading: tutorLoading, error: tutorError } = useTutor();

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
      age_stage: "",
      castrated: false,
      gender: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useFocusEffect(
    useCallback(() => {
      if (!tutorLoading) {
        reset({
          avatar_url: "",
          name: "",
          breed: "",
          age_stage: "",
          castrated: false,
          gender: "",
        });
      }
    }, [reset, tutorLoading])
  );

  if (!userTutor) return <Text>Carregando usuário...</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Adicionar felino",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/cats")}
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
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={20}
        >
          <View style={styles.container}>
            <View style={styles.sectionForm}>
              <Text style={styles.labelInfoBasics}>Informações básicas</Text>

              <Controller
                control={control}
                name="avatar_url"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.avatarContainer}>
                    <Image
                      style={styles.profileImage}
                      source={
                        value && value.length > 0
                          ? { uri: value }
                          : require("../../assets/images/avatar.png")
                      }
                    />
                    <TouchableOpacity onPress={() => pickImageAndSet(onChange)}>
                      <Text style={styles.selectPhotoText}>
                        Selecionar foto de perfil
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.avatar_url && (
                <Text
                  style={[
                    styles.errorText,
                    { textAlign: "center", marginTop: -8 },
                  ]}
                >
                  {errors.avatar_url.message}
                </Text>
              )}

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
                        placeholder="Digite o nome do seu felino"
                      />
                    )}
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.inputTitle}>Idade</Text>
                  <Controller
                    control={control}
                    name="age_stage"
                    render={({ field: { value, onChange } }) => (
                      <View style={styles.pickerWrapper}>
                        <Picker
                          placeholder={{
                            label: "Selecione a idade do felino",
                            value: "",
                          }}
                          items={[
                            { label: "Filhote — até 1 ano", value: "filhote" },
                            { label: "Jovem — 1 a 3 anos", value: "jovem" },
                            { label: "Adulto — 3 a 7 anos", value: "adulto" },
                            {
                              label: "Idoso — acima de 7 anos",
                              value: "idoso",
                            },
                          ]}
                          onValueChange={(v) => onChange(v)}
                          value={value || ""}
                          style={{
                            inputIOS: { fontSize: 16, color: "#7F13EC" },
                            inputAndroid: { fontSize: 16, color: "#7F13EC" },
                          }}
                        />
                      </View>
                    )}
                  />
                  {errors.age_stage && (
                    <Text style={styles.errorText}>
                      {errors.age_stage.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Text style={styles.inputTitle}>Gênero</Text>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field: { value, onChange } }) => (
                      <View style={styles.pickerWrapper}>
                        <Picker
                          placeholder={{
                            label: "Selecione o gênero do felino",
                            value: "",
                          }}
                          items={[
                            { label: "Macho", value: "Macho" },
                            { label: "Fêmea", value: "Fêmea" },
                          ]}
                          onValueChange={(v) => onChange(v)}
                          value={value || ""}
                          style={{
                            inputIOS: { fontSize: 16, color: "#7F13EC" },
                            inputAndroid: { fontSize: 16, color: "#7F13EC" },
                          }}
                        />
                      </View>
                    )}
                  />
                  {errors.gender && (
                    <Text style={styles.errorText}>
                      {errors.gender.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Text style={styles.inputTitle}>Raça</Text>
                  <Controller
                    control={control}
                    name="breed"
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
                        placeholder="Digite a raça do seu felino"
                      />
                    )}
                  />
                  {errors.breed && (
                    <Text style={styles.errorText}>{errors.breed.message}</Text>
                  )}
                </View>

                <View>
                  <Controller
                    control={control}
                    name="castrated"
                    render={({ field: { value, onChange } }) => (
                      <View style={styles.switchContainer}>
                        <Text style={styles.inputTitle}>
                          Seu felino é castrado?
                        </Text>
                        <Switch
                          value={!!value}
                          onValueChange={onChange}
                          thumbColor={value ? "#fff" : "#7F13EC"}
                          trackColor={{
                            false: "#D1D1D1",
                            true: "#7F13EC",
                          }}
                          ios_backgroundColor="#D1D1D1"
                          style={{
                            transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                          }}
                        />
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button_submit,
                (authLoading || tutorLoading) && { opacity: 0.5 },
              ]}
              disabled={authLoading || tutorLoading}
              onPress={handleSubmit(async (data) => {
                if (!userTutor) {
                  Alert.alert(
                    "Erro",
                    "Informações do tutor não carregadas. Tente novamente."
                  );
                  return;
                }

                try {
                  await createCat(
                    data.name,
                    data.age_stage || "",
                    data.gender || "",
                    data.breed,
                    data.castrated,
                    data.avatar_url || "",
                    userTutor.id
                  );
                } catch (error) {
                  console.error("Erro ao criar gato:", error);
                  Alert.alert(
                    "Erro",
                    "Falha ao salvar o gato. Tente novamente."
                  );
                }
              })}
            >
              <Text style={styles.buttonText}>
                {authLoading || tutorLoading
                  ? "Carregando..."
                  : "Salvar alterações"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7F6F8", flex: 1 },
  container: { flex: 1, paddingTop: 32, paddingHorizontal: 16, gap: 16 },
  avatarContainer: { alignItems: "center", gap: 20, marginBottom: 10 },
  profileImage: {
    width: 144,
    height: 144,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  selectPhotoText: { color: "#B83FCF", fontSize: 16 },
  sectionForm: {
    backgroundColor: "#fcfcfc",
    paddingHorizontal: 16,
    paddingVertical: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  inputsContainer: { display: "flex", gap: 18 },
  inputTitle: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#1D1127",
    lineHeight: 20,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 100,
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 8,
  },
  button_submit: {
    alignSelf: "flex-end",
    marginTop: 30,
    backgroundColor: "#7F13EC",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, textAlign: "center" },
  errorText: { color: "#EE0101", fontSize: 13, marginTop: 4 },
  labelInfoBasics: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 20,
    color: "#1D1127",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

import { Controller, useForm } from "react-hook-form";

import { AuthContext } from "@/context/AuthProvider";
import { useCat } from "@/hooks/useCat";
import { router, Stack } from "expo-router";
import { Text, TextInput } from "react-native-paper";
import Picker from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
    castrated: yup.boolean().required(requiredMessage),
    gender: yup.string().nullable().required(requiredMessage),
    age_stage: yup.string().nullable().required(requiredMessage),
    feeling: yup.string().required(requiredMessage),
    litter_box: yup.string().required(requiredMessage),
    sociability_humans: yup.string().required(requiredMessage),
    sociability_animals: yup.string().required(requiredMessage),
    activity_level: yup.string().required(requiredMessage),
    rabies_vaccine: yup.boolean().required(requiredMessage),
    health_notes: yup.string(),
    special_needs: yup.string(),
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

export default function EditCat({ catId }: { catId: string }) {
  const { cat, updateCat, updateCatExtraInfo, getCatExtraInfo } = useCat(
    catId as string
  );
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
      breed: "",
      age_stage: undefined,
      castrated: false,
      gender: undefined,
      feeling: "",
      litter_box: "",
      sociability_humans: "",
      sociability_animals: "",
      activity_level: "",
      rabies_vaccine: false,
      health_notes: "",
      special_needs: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const loadData = async () => {
      if (cat) {
        const catExtraInfo = await getCatExtraInfo();

        reset({
          avatar_url: cat.avatar_url,
          name: cat.name,
          breed: cat.breed,
          age_stage: cat.age_stage,
          castrated: !!cat.castrated,
          gender: cat.gender,

          feeling: catExtraInfo?.feeling ?? "",
          litter_box: catExtraInfo?.litter_box ?? "",
          sociability_humans: catExtraInfo?.sociability_humans ?? "",
          sociability_animals: catExtraInfo?.sociability_animals ?? "",
          activity_level: catExtraInfo?.activity_level ?? "",
          rabies_vaccine: !!catExtraInfo?.rabies_vaccine,
          health_notes: catExtraInfo?.health_notes ?? "",
          special_needs: catExtraInfo?.special_needs ?? "",
        });
      }
    };

    loadData();
  }, [cat, getCatExtraInfo, reset]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar informações",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push(`/(tabs)/cats/${catId}`)}
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
              <Text style={styles.labelInfoBasics}>Informações básicas</Text>

              <View>
                <Controller
                  control={control}
                  name="avatar_url"
                  render={({ field: { value, onChange } }) => (
                    <View style={styles.avatarContainer}>
                      <Image
                        style={styles.profileImage}
                        source={
                          value
                            ? { uri: value }
                            : require("../../assets/images/avatar.png")
                        }
                      />
                      <TouchableOpacity
                        onPress={() => pickImageAndSet(onChange)}
                      >
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
                    {errors.avatar_url?.message}
                  </Text>
                )}
              </View>

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
                        placeholder="Digite o nome do seu felino"
                      />
                    )}
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name?.message}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.inputTitle}>Idade</Text>
                  <View>
                    <Controller
                      control={control}
                      name="age_stage"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Picker
                            placeholder={{
                              label: "Selecione a idade do felino",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              {
                                label: "Filhote — até 1 ano de idade",
                                value: "filhote",
                              },
                              {
                                label: "Jovem — entre 1 e 3 anos",
                                value: "jovem",
                              },
                              {
                                label: "Adulto — entre 3 e 7 anos",
                                value: "adulto",
                              },
                              {
                                label: "Idoso — acima de 7 anos",
                                value: "idoso",
                              },
                            ]}
                            onValueChange={(value) => onChange(value)}
                            value={value}
                            style={{
                              inputIOS: {
                                fontSize: 16,
                                color: "#7F13EC",
                              },
                              inputAndroid: {
                                fontSize: 16,
                                color: "#7F13EC",
                              },
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
                </View>

                <View>
                  <Text style={styles.inputTitle}>Gênero</Text>
                  <View>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Picker
                            placeholder={{
                              label: "Selecione o gênero do felino",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              { label: "Macho", value: "Macho" },
                              { label: "Fêmea", value: "Fêmea" },
                            ]}
                            onValueChange={(value) => onChange(value)}
                            value={value}
                            style={{
                              inputIOS: {
                                fontSize: 16,
                                color: "#7F13EC",
                              },
                              inputAndroid: {
                                fontSize: 16,
                                color: "#7F13EC",
                              },
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
                        activeUnderlineColor="#6200ee"
                        placeholder="Digite a raça do seu felino"
                      />
                    )}
                  />
                  {errors.breed && (
                    <Text style={styles.errorText}>
                      {errors.breed?.message}
                    </Text>
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

            <View style={styles.sectionForm}>
              <Text style={styles.labelInfoBasics}>Rotina e comportamento</Text>
              <View style={styles.inputsContainer}>
                <View>
                  <Text style={styles.inputTitle}>
                    Estado emocional do seu gato(a)
                  </Text>
                  <View>
                    <Controller
                      control={control}
                      name="feeling"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Picker
                            placeholder={{
                              label: "Selecione o estado emocional do felino",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              { label: "Feliz", value: "Feliz" },
                              { label: "Brincalhão", value: "Brincalhão" },
                              { label: "Afetuoso", value: "Afetuoso" },
                              { label: "Estressado", value: "Estressado" },
                              { label: "Ansioso", value: "Ansioso" },
                              { label: "Medroso", value: "Medroso" },
                              { label: "Agressivo", value: "Agressivo" },
                            ]}
                            onValueChange={(value) => onChange(value)}
                            value={value}
                            style={{
                              inputIOS: { fontSize: 16, color: "#7F13EC" },
                              inputAndroid: { fontSize: 16, color: "#7F13EC" },
                            }}
                          />
                        </View>
                      )}
                    />
                    {errors.feeling && (
                      <Text style={styles.errorText}>
                        {errors.feeling.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text style={styles.inputTitle}>
                    Hábitos na caixa de areia
                  </Text>
                  <View>
                    <Controller
                      control={control}
                      name="litter_box"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Picker
                            placeholder={{
                              label:
                                "Selecione o comportamento na caixa de areia",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              {
                                label: "Usa a caixa de areia",
                                value: "Usa a caixa de areia",
                              },
                              {
                                label: "Não usa a caixa de areia",
                                value: "Não usa a caixa de areia",
                              },
                              {
                                label: "Urina ou faz cocô fora da caixa",
                                value: "Urina ou faz cocô fora da caixa",
                              },
                            ]}
                            onValueChange={(value) => onChange(value)}
                            value={value}
                            style={{
                              inputIOS: { fontSize: 16, color: "#7F13EC" },
                              inputAndroid: { fontSize: 16, color: "#7F13EC" },
                            }}
                          />
                        </View>
                      )}
                    />
                    {errors.litter_box && (
                      <Text style={styles.errorText}>
                        {errors.litter_box.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text style={styles.inputTitle}>Relação com humanos</Text>
                  <View>
                    <Controller
                      control={control}
                      name="sociability_humans"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Picker
                            placeholder={{
                              label: "Selecione o comportamento com humanos",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              { label: "Sociável", value: "Sociável" },
                              { label: "Tímido", value: "Tímido" },
                              { label: "Agressivo", value: "Agressivo" },
                              { label: "Medroso", value: "Medroso" },
                              { label: "Indiferente", value: "Indiferente" },
                            ]}
                            onValueChange={(value) => onChange(value)}
                            value={value}
                            style={{
                              inputIOS: { fontSize: 16, color: "#7F13EC" },
                              inputAndroid: { fontSize: 16, color: "#7F13EC" },
                            }}
                          />
                        </View>
                      )}
                    />
                    {errors.sociability_humans && (
                      <Text style={styles.errorText}>
                        {errors.sociability_humans.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text style={styles.inputTitle}>
                    Relação com outros animais
                  </Text>
                  <View>
                    <Controller
                      control={control}
                      name="sociability_animals"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Picker
                            placeholder={{
                              label:
                                "Selecione o comportamento com outros animais",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              { label: "Sociável", value: "Sociável" },
                              { label: "Tímido", value: "Tímido" },
                              { label: "Agressivo", value: "Agressivo" },
                              { label: "Medroso", value: "Medroso" },
                              { label: "Indiferente", value: "Indiferente" },
                            ]}
                            onValueChange={(value) => onChange(value)}
                            value={value}
                            style={{
                              inputIOS: { fontSize: 16, color: "#7F13EC" },
                              inputAndroid: { fontSize: 16, color: "#7F13EC" },
                            }}
                          />
                        </View>
                      )}
                    />
                    {errors.sociability_animals && (
                      <Text style={styles.errorText}>
                        {errors.sociability_animals.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text style={styles.inputTitle}>Atividade diária</Text>
                  <View>
                    <Controller
                      control={control}
                      name="activity_level"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Picker
                            placeholder={{
                              label: "Selecione o nível de atividade",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              { label: "Baixo", value: "Baixo" },
                              { label: "Médio", value: "Médio" },
                              { label: "Alto", value: "Alto" },
                            ]}
                            onValueChange={(value) => onChange(value)}
                            value={value}
                            style={{
                              inputIOS: { fontSize: 16, color: "#7F13EC" },
                              inputAndroid: { fontSize: 16, color: "#7F13EC" },
                            }}
                          />
                        </View>
                      )}
                    />
                    {errors.activity_level && (
                      <Text style={styles.errorText}>
                        {errors.activity_level.message}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionForm}>
              <Text style={styles.labelInfoBasics}>
                Saúde e informações especiais
              </Text>
              <View style={styles.inputsContainer}>
                <View>
                  <Text style={styles.inputTitle}>
                    Observações gerais de saúde
                  </Text>
                  <Controller
                    control={control}
                    name="health_notes"
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
                        value={value}
                        style={{
                          backgroundColor: "#FCFCFC",
                          paddingVertical: 12,
                        }}
                        placeholder="Descreva quaisquer observações gerais de saúde"
                      />
                    )}
                  />
                  {errors.health_notes && (
                    <Text style={styles.errorText}>
                      {errors.health_notes?.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Text style={styles.inputTitle}>
                    Cuidados ou necessidades especiais
                  </Text>
                  <Controller
                    control={control}
                    name="special_needs"
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
                        value={value}
                        style={{
                          backgroundColor: "#FCFCFC",
                          paddingVertical: 12,
                        }}
                        placeholder="Descreva quaisquer cuidados ou necessidades especiais"
                      />
                    )}
                  />
                  {errors.special_needs && (
                    <Text style={styles.errorText}>
                      {errors.special_needs?.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Controller
                    control={control}
                    name="rabies_vaccine"
                    render={({ field: { value, onChange } }) => (
                      <View style={styles.switchContainer}>
                        <Text style={styles.inputTitle}>
                          Vacina antirrábica em dia?
                        </Text>
                        <Switch
                          value={!!value}
                          onValueChange={onChange}
                          thumbColor={value ? "#fff" : "#7F13EC"}
                          trackColor={{ false: "#D1D1D1", true: "#7F13EC" }}
                          ios_backgroundColor="#D1D1D1"
                          style={{
                            transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                          }}
                        />
                      </View>
                    )}
                  />
                  {errors.rabies_vaccine && (
                    <Text style={styles.errorText}>
                      {errors.rabies_vaccine.message}
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
                  const updated = await updateCat(
                    data.name,
                    data.age_stage,
                    data.gender,
                    data.breed,
                    data.castrated,
                    data.avatar_url
                  );

                  const extraUpdated = await updateCatExtraInfo(
                    data.feeling,
                    data.litter_box,
                    data.sociability_humans,
                    data.sociability_animals,
                    data.activity_level,
                    data.rabies_vaccine,
                    data.health_notes,
                    data.special_needs
                  );

                  if (updated && extraUpdated) {
                    Alert.alert("Sucesso!", "Felino atualizado com sucesso!");
                    router.push(`/(tabs)/cats/${catId}`);
                  }
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

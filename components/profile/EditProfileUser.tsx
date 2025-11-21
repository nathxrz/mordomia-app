import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import formatDate from "@/scripts/format-date";
import maskPhone from "@/scripts/mask-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskInput from "react-native-mask-input";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    avatar_url: yup.string().required("Selecione uma foto de perfil"),
    name: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        "O nome deve conter apenas letras e espaços"
      ),
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
    <>
      <Stack.Screen
        options={{
          title: "Editar perfil",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
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
            <View>
              <Controller
                control={control}
                name="avatar_url"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.avatarContainer}>
                    {value && (
                      <Image
                        style={styles.profileImage}
                        source={{ uri: value }}
                      />
                    )}
                    <TouchableOpacity onPress={() => pickImageAndSet(onChange)}>
                      <Text style={styles.selectPhotoText}>
                        Selecionar foto de perfil
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.avatar_url && (
                <Text style={styles.messageAlert}>
                  {errors.avatar_url?.message}
                </Text>
              )}
            </View>

            <View style={styles.inputsContainer}>
              <Text style={styles.labelInfoBasics}>Informações básicas</Text>
              <View>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      mode="outlined"
                      placeholderTextColor="#7F13EC"
                      outlineColor="#979797"
                      activeOutlineColor="#979797"
                      textColor="#7F13EC"
                      theme={{ roundness: 100 }}
                      onChangeText={onChange}
                      value={value}
                      activeUnderlineColor="#6200ee"
                      placeholder="Nome completo"
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.messageAlert}>
                    {errors.name?.message}
                  </Text>
                )}
              </View>

              <View>
                <Controller
                  control={control}
                  name="birthDate"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      mode="outlined"
                      placeholderTextColor="#7F13EC"
                      outlineColor="#979797"
                      activeOutlineColor="#979797"
                      textColor="#7F13EC"
                      theme={{ roundness: 100 }}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Data de nascimento (dd/mm/aaaa)"
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <Icon
                              name="calendar-month"
                              size={20}
                              color="#B434CC"
                            />
                          )}
                        />
                      }
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
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      mode="outlined"
                      placeholderTextColor="#7F13EC"
                      outlineColor="#979797"
                      activeOutlineColor="#979797"
                      textColor="#7F13EC"
                      theme={{ roundness: 100 }}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Telefone"
                      render={(props) => (
                        <MaskInput
                          {...props}
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
                        />
                      )}
                    />
                  )}
                />
                {errors.phone && (
                  <Text style={styles.messageAlert}>
                    {errors.phone?.message}
                  </Text>
                )}
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={styles.button_submit}
                disabled={loading}
                onPress={handleSubmit((data) => {
                  const [day, month, year] = data.birthDate.split("/");
                  const birthDate = new Date(
                    `${year}-${month}-${day}T00:00:00`
                  );

                  updateProfile(
                    data.avatar_url,
                    data.name,
                    data.phone.replace(/\D/g, ""),
                    birthDate
                  );
                })}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Salvando..." : "Salvar alterações"}
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
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
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
  inputRadioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  textButtonRadio: {
    color: "#4A4459",
    fontSize: 18,
    fontWeight: "600",
  },
  radioSelected: {
    backgroundColor: "#DFD2FF",
    borderColor: "#7F13EC",
  },
  textButtonRadioSelected: {
    color: "#000000",
    fontWeight: "700",
  },
  inputsContainer: {
    display: "flex",
    gap: 10,
  },
  labelInfoBasics: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    marginTop: 30,
    color: "#1D1127",
  },
  button_submit: {
    alignSelf: "flex-end",
    marginTop: 50,
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
  messageAlert: { color: "red" },
});

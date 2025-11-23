import { AuthContext } from "@/context/AuthProvider";
import { useCatSitter } from "@/hooks/useCatSitter";
import { useUser } from "@/hooks/useUser";
import formatDate from "@/scripts/format-date";
import maskPhone from "@/scripts/mask-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskInput from "react-native-mask-input";
import { TextInput } from "react-native-paper";
import Picker from "react-native-picker-select";
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
    cep: yup.string().trim().required(requiredMessage),
    street: yup.string().trim().required(requiredMessage),
    state: yup.string().trim().required(requiredMessage),
    city: yup.string().trim().required(requiredMessage),
    neighborhood: yup.string().trim().required(requiredMessage),
    number: yup.string().trim().required(requiredMessage),
    complement: yup.string().trim().optional(),
    biography: yup
      .string()
      .max(2000, "Biografia deve ter no máximo 2000 caracteres")
      .nullable(),
    portfolio_url: yup.string().url("URL inválida").nullable(),
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
  const { user, updateProfile, getAddressUser, updateAddressUser } = useUser();
  const { userCatSitter, updatePortfolio } = useCatSitter();

  const { loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar_url: "",
      name: "",
      phone: "",
      birthDate: "",
      cep: "",
      street: "",
      state: "",
      city: "",
      neighborhood: "",
      number: "",
      complement: "",
      biography: "",
      portfolio_url: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const fetchAddress = useCallback(async () => {
    const address = await getAddressUser();
    if (address) {
      setValue("cep", address.cep);
      setValue("street", address.street);
      setValue("state", address.state);
      setValue("city", address.city);
      setValue("neighborhood", address.neighborhood);
      setValue("number", address.number);
      setValue("complement", address.complement);
    }
  }, [getAddressUser, setValue]);

  // Carregar dados do endereço apenas quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      fetchAddress();
    }, [user])
  );

  // Resetar o formulário sempre que user ou userCatSitter mudar
  useEffect(() => {
    if (!user) return;

    reset({
      avatar_url: user.avatar_url,
      name: user.name,
      phone: maskPhone(user.phone),
      birthDate: formatDate(user.date_birth),
      biography: userCatSitter?.biography || "",
      portfolio_url: userCatSitter?.portfolio_url || "",
      cep: "",
      street: "",
      state: "",
      city: "",
      neighborhood: "",
      number: "",
      complement: "",
    });

    fetchAddress(); // depois que resetar, preenche endereço
  }, [user, userCatSitter, reset, fetchAddress]);

  // Controle único para botão físico de voltar
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)/profile");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove(); // <-- correção definitiva
    }, [])
  );

  const getCepFromApi = (cep: string) => {
    if (cep.length !== 8) {
      return;
    }

    const endpoint = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((json) => {
        const addressApi = {
          street: json.logradouro,
          neighborhood: json.bairro,
          city: json.localidade,
          state: json.uf,
        };
        setValue("street", addressApi.street || "");
        setValue("neighborhood", addressApi.neighborhood || "");
        setValue("city", addressApi.city || "");
        setValue("state", addressApi.state || "");
      })
      .catch(() => {
        Alert.alert("Erro ao buscar CEP.");
      });
  };
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
                        activeUnderlineColor="#6200ee"
                        placeholder="Nome completo"
                        style={{
                          backgroundColor: "#FCFCFC",
                        }}
                      />
                    )}
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name?.message}</Text>
                  )}
                </View>

                <View>
                  <Controller
                    control={control}
                    name="birthDate"
                    render={({ field: { onChange, value } }) => (
                      <View style={{ position: "relative" }}>
                        <MaskInput
                          value={value}
                          onChangeText={(masked) => onChange(masked)}
                          keyboardType="numeric"
                          placeholder="Data de nascimento (dd/mm/aaaa)"
                          placeholderTextColor="#7f13ecab"
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
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            fontSize: 16,
                            color: "#7F13EC",
                            backgroundColor: "#FCFCFC",
                          }}
                        />
                        <Icon
                          name="calendar-month"
                          size={20}
                          color="#B434CC"
                          style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: [{ translateY: -10 }],
                          }}
                        />
                      </View>
                    )}
                  />
                  {errors.birthDate && (
                    <Text style={styles.errorText}>
                      {errors.birthDate?.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                      <MaskInput
                        value={value}
                        onChangeText={(masked) => onChange(masked)}
                        keyboardType="numeric"
                        placeholder="(99) 99999-9999"
                        placeholderTextColor="#7f13ecab"
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
                          borderWidth: 1,
                          borderColor: "#979797",
                          borderRadius: 100,
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          fontSize: 16,
                          color: "#7F13EC",
                          backgroundColor: "#FCFCFC",
                        }}
                      />
                    )}
                  />
                  {errors.phone && (
                    <Text style={styles.errorText}>
                      {errors.phone?.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.sectionForm}>
              <View style={styles.inputsContainer}>
                <View style={styles.cepStateContainer}>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="cep"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <MaskInput
                          value={value}
                          onChangeText={(masked, unmasked) => onChange(masked)}
                          onBlur={() => getCepFromApi(value.replace(/\D/g, ""))}
                          mask={[
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                            "-",
                            /\d/,
                            /\d/,
                            /\d/,
                          ]}
                          keyboardType="numeric"
                          placeholder="00000-000"
                          placeholderTextColor="#7f13ecab"
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            fontSize: 16,
                            color: "#7F13EC",
                            backgroundColor: "#fcfcfc",
                          }}
                        />
                      )}
                    />
                    {errors.cep && (
                      <Text style={styles.errorText}>
                        {errors.cep?.message}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="state"
                      render={({ field: { value, onChange } }) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                          }}
                        >
                          <Picker
                            placeholder={{
                              label: "Estado",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              { label: "AC", value: "AC" },
                              { label: "AL", value: "AL" },
                              { label: "AP", value: "AP" },
                              { label: "AM", value: "AM" },
                              { label: "BA", value: "BA" },
                              { label: "CE", value: "CE" },
                              { label: "DF", value: "DF" },
                              { label: "ES", value: "ES" },
                              { label: "GO", value: "GO" },
                              { label: "MA", value: "MA" },
                              { label: "MT", value: "MT" },
                              { label: "MS", value: "MS" },
                              { label: "MG", value: "MG" },
                              { label: "PA", value: "PA" },
                              { label: "PB", value: "PB" },
                              { label: "PR", value: "PR" },
                              { label: "PE", value: "PE" },
                              { label: "PI", value: "PI" },
                              { label: "RJ", value: "RJ" },
                              { label: "RN", value: "RN" },
                              { label: "RS", value: "RS" },
                              { label: "RO", value: "RO" },
                              { label: "RR", value: "RR" },
                              { label: "SC", value: "SC" },
                              { label: "SP", value: "SP" },
                              { label: "SE", value: "SE" },
                              { label: "TO", value: "TO" },
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
                    {errors.state && (
                      <Text style={styles.errorText}>
                        {errors.state.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputsContainer}>
                  <View>
                    <Controller
                      control={control}
                      name="street"
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
                          activeUnderlineColor="#6200ee"
                          placeholder="Rua"
                          style={{
                            backgroundColor: "#FCFCFC",
                          }}
                        />
                      )}
                    />
                    {errors.street && (
                      <Text style={styles.errorText}>
                        {errors.street?.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputsContainer}>
                  <View>
                    <Controller
                      control={control}
                      name="neighborhood"
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
                          activeUnderlineColor="#6200ee"
                          placeholder="Bairro"
                          style={{
                            backgroundColor: "#FCFCFC",
                          }}
                        />
                      )}
                    />
                    {errors.neighborhood && (
                      <Text style={styles.errorText}>
                        {errors.neighborhood?.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputsContainer}>
                  <View>
                    <Controller
                      control={control}
                      name="city"
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
                          activeUnderlineColor="#6200ee"
                          placeholder="Cidade"
                          style={{
                            backgroundColor: "#FCFCFC",
                          }}
                        />
                      )}
                    />
                    {errors.city && (
                      <Text style={styles.errorText}>
                        {errors.city?.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputsContainer}>
                  <View style={styles.cepStateContainer}>
                    <View style={{ width: "30%" }}>
                      <Controller
                        control={control}
                        name="number"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            mode="outlined"
                            placeholderTextColor="#7f13ecab"
                            outlineColor="#979797"
                            activeOutlineColor="#979797"
                            textColor="#7F13EC"
                            theme={{ roundness: 100 }}
                            style={{ backgroundColor: "#fcfcfc" }}
                            onChangeText={onChange}
                            value={value}
                            activeUnderlineColor="#6200ee"
                            placeholder="Número"
                          />
                        )}
                      />
                      {errors.number && (
                        <Text style={styles.errorText}>
                          {errors.number?.message}
                        </Text>
                      )}
                    </View>
                    <View style={{ width: "70%" }}>
                      <Controller
                        control={control}
                        name="complement"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            mode="outlined"
                            placeholderTextColor="#7f13ecab"
                            outlineColor="#979797"
                            activeOutlineColor="#979797"
                            style={{ backgroundColor: "#fcfcfc" }}
                            textColor="#7F13EC"
                            theme={{ roundness: 100 }}
                            onChangeText={onChange}
                            value={value}
                            activeUnderlineColor="#6200ee"
                            placeholder="Complemento (Ex: Apt, Casa, Bloco)"
                          />
                        )}
                      />
                      {errors.complement && (
                        <Text style={styles.errorText}>
                          {errors.complement?.message}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {user?.roles?.includes("catsitter") && (
              <View style={styles.sectionForm}>
                <Text style={styles.labelInfoBasics}>
                  Portfólio profissional
                </Text>
                <View style={styles.inputsContainer}>
                  <View>
                    <Controller
                      control={control}
                      name="biography"
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
                          placeholder="Descreva sua biografia"
                        />
                      )}
                    />
                    {errors.biography && (
                      <Text style={styles.errorText}>
                        {errors.biography?.message}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Controller
                      control={control}
                      name="portfolio_url"
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
                          placeholder="Link do seu portfólio profissional (opcional)"
                        />
                      )}
                    />
                    {errors.portfolio_url && (
                      <Text style={styles.errorText}>
                        {errors.portfolio_url?.message}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
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

                  updateAddressUser(
                    data.cep.replace(/\D/g, ""),
                    data.street,
                    data.state,
                    data.city,
                    data.neighborhood,
                    data.number,
                    data.complement
                  );

                  if (user?.roles?.includes("catsitter")) {
                    updatePortfolio(
                      data.biography || "",
                      data.portfolio_url || ""
                    );
                  }

                  router.push("/(tabs)/profile");
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
    paddingTop: 25,
    paddingBottom: 30,
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
  cepStateContainer: {
    flexDirection: "row",
    gap: 10,
  },
});

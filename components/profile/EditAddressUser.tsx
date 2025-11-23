import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useContext } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Alert,
  BackHandler,
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
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    cep: yup.string().trim().required(requiredMessage),
    street: yup.string().trim().required(requiredMessage),
    state: yup.string().trim().required(requiredMessage),
    city: yup.string().trim().required(requiredMessage),
    neighborhood: yup.string().trim().required(requiredMessage),
    number: yup.string().trim().required(requiredMessage),
    complement: yup.string().trim().optional(),
  })
  .required();

export default function EditAddressUser() {
  const { getAddressUser, updateAddressUser } = useUser();
  const { loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cep: "",
      street: "",
      state: "",
      city: "",
      neighborhood: "",
      number: "",
      complement: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const fetchAddress = useCallback(async () => {
    const address = await getAddressUser();
    if (address) {
      reset({
        cep: address.cep,
        street: address.street,
        state: address.state,
        city: address.city,
        neighborhood: address.neighborhood,
        number: address.number,
        complement: address.complement,
      });
    }
  }, [getAddressUser, reset]);

  useFocusEffect(
    useCallback(() => {
      fetchAddress();

      const onBackPress = () => {
        router.push("/(tabs)/profile");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        subscription.remove();
      };
    }, [fetchAddress])
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
          title: "Editar Endereço",
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

            <View>
              <TouchableOpacity
                style={styles.button_submit}
                disabled={loading}
                onPress={handleSubmit((data) => {
                  updateAddressUser(
                    data.cep.replace(/\D/g, ""),
                    data.street,
                    data.state,
                    data.city,
                    data.neighborhood,
                    data.number,
                    data.complement
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
  errorText: {
    color: "#EE0101",
    fontSize: 13,
    marginTop: 4,
  },
  cepStateContainer: {
    flexDirection: "row",
    gap: 10,
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
});

import { yupResolver } from "@hookform/resolvers/yup";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

import { Controller, useForm } from "react-hook-form";

import Picker from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

import { useTutor } from "@/hooks/useTutor";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    service_type: yup.string().required(requiredMessage),
    address: yup.string().required(requiredMessage),
    cats: yup
      .array()
      .min(1, "Selecione pelo menos um gato")
      .required(requiredMessage),
  })
  .required();

async function fetchCats(userTutor: string) {
  try {
    const { data: cats, error } = await supabase
      .from("cats")
      .select("id, avatar_url, name")
      .eq("id_tutor", userTutor);

    if (error) {
      throw new Error(translateError(error.code));
    }
    return cats;
  } catch (error) {
    Alert.alert("Erro ao buscar pets", String(error));
  }
}

export default function FormSchedule() {
  const { getAddressUser } = useUser();
  const { userTutor, loading: tutorLoading, error: tutorError } = useTutor();

  const [addressesUser, setAddressesUser] = useState<any[]>([]);
  const [catsUser, setCatsUser] = useState<any[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      service_type: "",
      address: "",
      cats: [],
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useFocusEffect(
    useCallback(() => {
      if (!userTutor?.id) return;
      async function fetchAddress() {
        const address = await getAddressUser();
        if (address) setAddressesUser(address);
      }
      fetchAddress();

      async function loadCats() {
        const cats = await fetchCats(userTutor.id);
        if (cats) setCatsUser(cats);
      }
      loadCats();

      if (!tutorLoading) {
        reset({
          service_type: "",
          address: "",
          cats: [],
        });
      }
    }, [reset, tutorLoading])
  );

  if (!userTutor) return <Text>Carregando usuário...</Text>;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Novo agendamento",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home")}
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
                  <Text style={styles.inputTitle}>Tipo de serviço</Text>
                  <View>
                    <Controller
                      control={control}
                      name="service_type"
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
                              label: "Selecione o tipo de serviço",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={[
                              {
                                label: "Visita domiciliar",
                                value: "Visita domiciliar",
                              },
                              { label: "Transporte", value: "Transporte" },
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
                    {errors.service_type && (
                      <Text style={styles.errorText}>
                        {errors.service_type.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text style={styles.inputTitle}>Endereço</Text>
                  <View>
                    <Controller
                      control={control}
                      name="address"
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
                              label: "Selecione o endereço",
                              value: null,
                              color: "#7F13EC",
                            }}
                            items={addressesUser.map((address) => ({
                              label: `${address.street}, ${address.number} - ${address.neighborhood}`,
                              value: address.id,
                            }))}
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
                    {errors.service_type && (
                      <Text style={styles.errorText}>
                        {errors.service_type.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text style={styles.inputTitle}>Felinos</Text>
                  <View>
                    <Controller
                      control={control}
                      name="cats"
                      render={({ field: { value, onChange } }) => (
                        <MultiSelect
                          style={{
                            borderWidth: 1,
                            borderColor: "#979797",
                            borderRadius: 100,
                            backgroundColor: "#FCFCFC",
                            paddingHorizontal: 8,
                          }}
                          placeholder="Selecione os felinos"
                          data={catsUser.map((cat) => ({
                            label: cat.name,
                            value: cat.id,
                          }))}
                          value={value}
                          onChange={onChange}
                          labelField="label"
                          valueField="value"
                          selectedStyle={{
                            borderRadius: 12,
                          }}
                        />
                      )}
                    />
                    {errors.cats && (
                      <Text style={styles.errorText}>
                        {errors.cats.message}
                      </Text>
                    )}

                    {errors.service_type && (
                      <Text style={styles.errorText}>
                        {errors.service_type.message}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
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
});

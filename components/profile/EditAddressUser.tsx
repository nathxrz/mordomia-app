import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useContext } from "react";
import { Controller, useForm } from "react-hook-form";

import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import MaskInput from "react-native-mask-input";
import { Button, TextInput } from "react-native-paper";
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

  useFocusEffect(() => {
    fetchAddress();
  });

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <>
          <View style={{ marginBottom: 16 }}>
            <Text>CEP</Text>
            <Controller
              control={control}
              name="cep"
              render={({ field: { onChange, onBlur, value } }) => (
                <MaskInput
                  value={value}
                  onChangeText={(masked, unmasked) => onChange(masked)}
                  onBlur={() => getCepFromApi(value.replace(/\D/g, ""))}
                  mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    paddingVertical: 8,
                    fontSize: 16,
                  }}
                  keyboardType="numeric"
                  placeholder="00000-000"
                />
              )}
            />
            {errors.cep && (
              <Text style={styles.messageAlert}>{errors.cep?.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text>Rua</Text>
            <Controller
              control={control}
              name="street"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Digite o nome da rua"}
                />
              )}
            />
            {errors.street && (
              <Text style={styles.messageAlert}>{errors.street?.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text>Bairro</Text>
            <Controller
              control={control}
              name="neighborhood"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Digite o nome do bairro"}
                />
              )}
            />
            {errors.neighborhood && (
              <Text style={styles.messageAlert}>
                {errors.neighborhood?.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 16, marginTop: 16 }}>
            <Text>Cidade</Text>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Digite o nome da cidade"}
                />
              )}
            />
            {errors.city && (
              <Text style={styles.messageAlert}>{errors.city?.message}</Text>
            )}
          </View>

          <View>
            <Text>Estado</Text>
            <Controller
              control={control}
              name="state"
              render={({ field: { value, onChange } }) => (
                <View style={{ marginTop: 20 }}>
                  <Picker
                    placeholder={{ label: "Selecione o estado", value: null }}
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
                  />
                  {errors.state && (
                    <Text style={styles.messageAlert}>
                      {errors.state.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={{ marginBottom: 16, marginTop: 16 }}>
            <Text>Número</Text>
            <Controller
              control={control}
              name="number"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Digite o número"}
                />
              )}
            />
            {errors.number && (
              <Text style={styles.messageAlert}>{errors.number?.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16, marginTop: 16 }}>
            <Text>Complemento</Text>
            <Controller
              control={control}
              name="complement"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Complemento (opcional)"}
                />
              )}
            />
            {errors.complement && (
              <Text style={styles.messageAlert}>
                {errors.complement?.message}
              </Text>
            )}
          </View>

          <View>
            <Button
              mode="contained"
              disabled={loading}
              style={styles.mt20}
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

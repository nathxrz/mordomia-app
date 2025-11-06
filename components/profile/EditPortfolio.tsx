import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";

import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useCatSitter } from "@/hooks/useCatSitter";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    biography: yup
      .string()
      .min(10, "Biografia deve ter no mínimo 10 caracteres")
      .max(2000, "Biografia deve ter no máximo 2000 caracteres")
      .required(requiredMessage),
    portfolio_url: yup.string().url("URL inválida").nullable(),
  })
  .required();

export default function EditPortfolio() {
  const { userCatSitter, updatePortfolio } = useCatSitter();

  const { loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      biography: "",
      portfolio_url: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (userCatSitter) {
      reset({
        biography: userCatSitter.biography,
        portfolio_url: userCatSitter.portfolio_url,
      });
    }
  }, [userCatSitter, reset]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <>
          <View>
            <Text>Descreva como você cuida dos gatos</Text>
            <Controller
              control={control}
              name="biography"
              render={({ field: { value, onChange } }) => (
                <View style={{ marginTop: 20 }}>
                  <TextInput
                    placeholder="Descreva como você cuida dos gatos, suas experiências e qualquer informação relevante."
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 4,
                      padding: 8,
                    }}
                  />
                  {errors.biography && (
                    <Text style={styles.messageAlert}>
                      {errors.biography.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View>
            <Text style={styles.verticallySpaced}>
              Link do portfólio (opcional)
            </Text>
            <Controller
              control={control}
              name="portfolio_url"
              render={({ field: { value, onChange } }) => (
                <View style={{ marginTop: 20 }}>
                  <TextInput
                    placeholder="https://meuportfólio.com"
                    value={value || ""}
                    onChangeText={onChange}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 4,
                      padding: 8,
                    }}
                  />
                  {errors.portfolio_url && (
                    <Text style={styles.messageAlert}>
                      {errors.portfolio_url.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View>
            <Button
              mode="contained"
              disabled={loading}
              style={styles.mt20}
              onPress={handleSubmit((data) => {
                updatePortfolio(data.biography, data.portfolio_url);
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

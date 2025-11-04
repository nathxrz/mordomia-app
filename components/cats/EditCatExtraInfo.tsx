import { router, useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Switch, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import React, { useCallback } from "react";

import { useCat } from "@/hooks/useCat";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Picker from "react-native-picker-select";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
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

export default function EditCatExtraInfo({ catId }: { catId: string }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
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

  const { loading, updateCatExtraInfo, getCatExtraInfo } = useCat(catId);

  const fetchExtraInfo = useCallback(async () => {
    const catExtraInfo = await getCatExtraInfo();
    if (catExtraInfo) {
      reset({
        feeling: catExtraInfo.feeling,
        litter_box: catExtraInfo.litter_box,
        sociability_humans: catExtraInfo.sociability_humans,
        sociability_animals: catExtraInfo.sociability_animals,
        activity_level: catExtraInfo.activity_level,
        rabies_vaccine: !!catExtraInfo.rabies_vaccine,
        health_notes: catExtraInfo.health_notes,
        special_needs: catExtraInfo.special_needs,
      });
    }
  }, [getCatExtraInfo, reset]);

  useFocusEffect(() => {
    fetchExtraInfo();
  });

  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Text>Informações adicionais</Text>

        <View>
          <Text>Humor ou estado emocional do seu gato(a)</Text>
          <Controller
            control={control}
            name="feeling"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{ label: "Selecione o humor", value: null }}
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
                />
                {errors.feeling && (
                  <Text style={styles.messageAlert}>
                    {errors.feeling.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Text>Hábitos e comportamento na caixa de areia</Text>
          <Controller
            control={control}
            name="litter_box"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{
                    label: "Selecione o comportamento",
                    value: null,
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
                />
                {errors.litter_box && (
                  <Text style={styles.messageAlert}>
                    {errors.litter_box.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Text>Relação com humanos</Text>
          <Controller
            control={control}
            name="sociability_humans"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{
                    label: "Selecione o comportamento com humanos",
                    value: null,
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
                />
                {errors.sociability_humans && (
                  <Text style={styles.messageAlert}>
                    {errors.sociability_humans.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Text>Relação com outros animais</Text>
          <Controller
            control={control}
            name="sociability_animals"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{
                    label: "Selecione o comportamento com outros animais",
                    value: null,
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
                />
                {errors.sociability_animals && (
                  <Text style={styles.messageAlert}>
                    {errors.sociability_animals.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Text>Nível de energia e atividade diária</Text>
          <Controller
            control={control}
            name="activity_level"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{
                    label: "Selecione o nível de atividade",
                    value: null,
                  }}
                  items={[
                    { label: "Baixo", value: "Baixo" },
                    { label: "Médio", value: "Médio" },
                    { label: "Alto", value: "Alto" },
                  ]}
                  onValueChange={(value) => onChange(value)}
                  value={value}
                />
                {errors.activity_level && (
                  <Text style={styles.messageAlert}>
                    {errors.activity_level.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Vacina antirrábica está em dia?</Text>
          <Controller
            control={control}
            name="rabies_vaccine"
            render={({ field: { value, onChange } }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Switch
                  value={!!value}
                  onValueChange={onChange}
                  thumbColor={value ? "#fff" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
                <Text style={{ marginLeft: 8 }}>
                  {value ? "Sim, está em dia" : "Não ou não sei"}
                </Text>
              </View>
            )}
          />
          {errors.rabies_vaccine && (
            <Text style={styles.messageAlert}>
              {errors.rabies_vaccine.message}
            </Text>
          )}
        </View>

        <View>
          <Text>Observações gerais de saúde</Text>
          <Controller
            control={control}
            name="health_notes"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <TextInput
                  placeholder="Observações gerais de saúde"
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
                {errors.health_notes && (
                  <Text style={styles.messageAlert}>
                    {errors.health_notes.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Text>Cuidados especiais que exigem atenção</Text>
          <Controller
            control={control}
            name="special_needs"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <TextInput
                  placeholder="Cuidados especiais"
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
                {errors.special_needs && (
                  <Text style={styles.messageAlert}>
                    {errors.special_needs.message}
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
            onPress={handleSubmit(async (data) => {
              await updateCatExtraInfo(
                data.feeling,
                data.litter_box,
                data.sociability_humans,
                data.sociability_animals,
                data.activity_level,
                data.rabies_vaccine,
                data.health_notes,
                data.special_needs
              );
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

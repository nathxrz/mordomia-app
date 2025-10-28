import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import React, { useEffect } from "react";

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
    active_level: yup.string().required(requiredMessage),
    health_notes: yup.string().required(requiredMessage),
    special_needs: yup.string().required(requiredMessage),
  })
  .required();

export default function EditCatExtraInfo({ catId }: { catId: string }) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      feeling: "",
      litter_box: "",
      sociability_humans: "",
      sociability_animals: "",
      active_level: "",
      health_notes: "",
      special_needs: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { loading, updateCatExtraInfo, catExtraInfo } = useCat(catId);

  useEffect(() => {
    if (catExtraInfo) {
      reset({
        feeling: catExtraInfo.feeling,
        litter_box: catExtraInfo.litter_box,
        sociability_humans: catExtraInfo.sociability_humans,
        sociability_animals: catExtraInfo.sociability_animals,
        active_level: catExtraInfo.active_level,
        health_notes: catExtraInfo.health_notes,
        special_needs: catExtraInfo.special_needs,
      });
    }
  }, [catExtraInfo, reset]);

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
                    { label: "Feliz", value: "happy" },
                    { label: "Brincalhão", value: "playful" },
                    { label: "Afetuoso", value: "affectionate" },
                    { label: "Estressado", value: "stressed" },
                    { label: "Ansioso", value: "anxious" },
                    { label: "Medroso", value: "scared" },
                    { label: "Agressivo", value: "aggressive" },
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
                    { label: "Usa a caixa de areia", value: "uses_litter_box" },
                    {
                      label: "Não usa a caixa de areia",
                      value: "does_not_use_litter_box",
                    },
                    {
                      label: "Urina ou faz cocô fora da caixa",
                      value: "pees_or_poops_outside_box",
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
                    { label: "Sociável", value: "sociable" },
                    { label: "Tímido", value: "shy" },
                    { label: "Agressivo", value: "aggressive" },
                    { label: "Medroso", value: "scared" },
                    { label: "Indiferente", value: "indifferent" },
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
                    { label: "Sociável", value: "sociable" },
                    { label: "Tímido", value: "shy" },
                    { label: "Agressivo", value: "aggressive" },
                    { label: "Medroso", value: "scared" },
                    { label: "Indiferente", value: "indifferent" },
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
            name="active_level"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{
                    label: "Selecione o nível de atividade",
                    value: null,
                  }}
                  items={[
                    { label: "Baixo", value: "low" },
                    { label: "Médio", value: "medium" },
                    { label: "Alto", value: "high" },
                  ]}
                  onValueChange={(value) => onChange(value)}
                  value={value}
                />
                {errors.active_level && (
                  <Text style={styles.messageAlert}>
                    {errors.active_level.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Text>Observações gerais de saúde</Text>
          <Controller
            control={control}
            name="health_notes"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{
                    label: "Selecione o nível de atividade",
                    value: null,
                  }}
                  items={[
                    { label: "Baixo", value: "low" },
                    { label: "Médio", value: "medium" },
                    { label: "Alto", value: "high" },
                  ]}
                  onValueChange={(value) => onChange(value)}
                  value={value}
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
                <Picker
                  placeholder={{
                    label: "Selecione o nível de atividade",
                    value: null,
                  }}
                  items={[
                    { label: "Baixo", value: "low" },
                    { label: "Médio", value: "medium" },
                    { label: "Alto", value: "high" },
                  ]}
                  onValueChange={(value) => onChange(value)}
                  value={value}
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
                data.active_level,
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

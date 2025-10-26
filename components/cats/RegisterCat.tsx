import { AuthContext } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useContext } from "react";
import Picker from "react-native-picker-select";

import { Controller, useForm } from "react-hook-form";

import { useTutor } from "@/hooks/useTutor";
import { router } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
const schema = yup
  .object({
    avatar_url: yup.string().required("Selecione uma foto do seu gato(a)"),
    name: yup
      .string()
      .trim()
      .required("Campo obrigatório")
      .min(2, "Nome deve ter no mínimo 2 caracteres"),
    knowBirthDate: yup.boolean(),
    birthDate: yup
      .date()
      .nullable()
      .when("knowBirthDate", {
        is: true,
        then: (schema) => schema.required("Selecione a data de nascimento"),
        otherwise: (schema) => schema.nullable(),
      }),
    breed: yup
      .string()
      .trim()
      .required("Selecione a raça do gato(a)")
      .min(3, "Raça deve ter no mínimo 3 caracteres"),
    castrated: yup.boolean().required("Campo obrigatório"),
    gender: yup.string().nullable().required("Selecione o gênero do gato(a)"),
  })
  .required();

async function createCat(
  name: string,
  date_birth: Date | null | undefined,
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
        date_birth,
        gender,
        breed,
        castrated: isCastrated,
        avatar_url,
        id_tutor: userTutor,
      },
    ]);

    if (error) {
      throw new Error(translateError(error.code));
    }
    Alert.alert("Felino adicionado com sucesso!");
    router.back();
  } catch (error) {
    Alert.alert("Erro ao criar pet", String(error));
  }
}

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
export default function RegisterCat() {
  const [open, setOpen] = React.useState(false);
  const userTutor = useTutor();
  const { loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar_url: "",
      name: "",
      breed: "",
      birthDate: undefined,
      knowBirthDate: false,
      castrated: false,
      gender: undefined,
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Text>Cadastro de Pet</Text>
        <View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nome"
                onChangeText={onChange}
                value={value}
                placeholder="Digite o nome do gato(a)"
              />
            )}
          />
          {errors.name && (
            <Text style={styles.messageAlert}>{errors.name?.message}</Text>
          )}
        </View>

        <View>
          <Controller
            control={control}
            name="knowBirthDate"
            render={({ field: { value, onChange } }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Switch
                  value={!!value}
                  onValueChange={onChange}
                  thumbColor={value ? "#fff" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
                <Text style={{ marginLeft: 8 }}>Sei a data de nascimento</Text>
              </View>
            )}
          />

          {watch("knowBirthDate") && (
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <>
                  {open && (
                    <DateTimePicker
                      value={value || new Date()}
                      onChange={(event, selectedDate) => {
                        if (event.type === "dismissed" || !selectedDate) {
                          setOpen(false);
                          return;
                        }

                        onChange(selectedDate || value);
                        setOpen(false);
                      }}
                      maximumDate={new Date()}
                    />
                  )}

                  <TouchableOpacity onPress={() => setOpen(true)}>
                    <TextInput
                      editable={false}
                      label="Data de nascimento"
                      pointerEvents="none"
                      value={value ? value.toLocaleDateString() : "dd/mm/aaaa"}
                      placeholder="Selecione sua data de nascimento"
                    />
                  </TouchableOpacity>
                </>
              )}
            />
          )}
          {errors.birthDate && (
            <Text style={styles.messageAlert}>{errors.birthDate.message}</Text>
          )}
        </View>

        <View>
          <Controller
            control={control}
            name="gender"
            render={({ field: { value, onChange } }) => (
              <View style={{ marginTop: 20 }}>
                <Picker
                  placeholder={{ label: "Selecione o gênero", value: null }}
                  items={[
                    { label: "Masculino", value: "male" },
                    { label: "Feminino", value: "female" },
                  ]}
                  onValueChange={(value) => onChange(value)}
                  value={value}
                />
                {errors.gender && (
                  <Text style={styles.messageAlert}>
                    {errors.gender.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View>
          <Controller
            control={control}
            name="breed"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Raça"
                onChangeText={onChange}
                value={value}
                placeholder="Digite a raça do gato(a)"
              />
            )}
          />
          {errors.breed && (
            <Text style={styles.messageAlert}>{errors.breed?.message}</Text>
          )}
        </View>

        <View>
          <Controller
            control={control}
            name="castrated"
            render={({ field: { value, onChange } }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Switch
                  value={!!value}
                  onValueChange={onChange}
                  thumbColor={value ? "#fff" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                />
                <Text style={{ marginLeft: 8 }}>Castrado?</Text>
              </View>
            )}
          />
        </View>

        <View>
          <Controller
            control={control}
            name="avatar_url"
            render={({ field: { value, onChange } }) => (
              <View style={styles.container}>
                <Button onPress={() => pickImageAndSet(onChange)}>
                  Selecionar foto do gato(a)
                </Button>

                {value && (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                    source={{ uri: value }}
                  />
                )}
              </View>
            )}
          />
          {errors.avatar_url && (
            <Text style={styles.messageAlert}>
              {errors.avatar_url?.message}
            </Text>
          )}
        </View>

        <View>
          <Button
            mode="contained"
            disabled={loading}
            style={styles.mt20}
            onPress={handleSubmit(async (data) => {
              if (!userTutor) throw new Error("Usuário não autenticado");

              const birthDateToUpdate = data.knowBirthDate
                ? data.birthDate
                : null;

              await createCat(
                data.name,
                birthDateToUpdate,
                data.gender,
                data.breed,
                data.castrated,
                data.avatar_url,
                userTutor.id
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

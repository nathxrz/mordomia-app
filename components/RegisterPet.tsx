import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useContext } from "react";

import { Controller, useForm } from "react-hook-form";

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

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(3, "Nome deve ter no mínimo 3 caracteres"),
    birthDate: yup
      .date()
      .nullable()
      .when("$isEnabled", {
        is: true,
        then: (schema) => schema.required("Campo obrigatório"),
        otherwise: (schema) => schema.nullable(),
      }),
    gender: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(3, "Gênero deve ter no mínimo 3 caracteres"),
    breed: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(3, "Raça deve ter no mínimo 3 caracteres"),
    avatar_url: yup.string().required(requiredMessage),
  })
  .required();

async function createPet(
  name: string,
  birthDate: Date | null | undefined,
  gender: string,
  breed: string,
  isCastrated: boolean,
  image: string,
  userId: string
) {
  try {
    const { error: insertPet } = await supabase.from("cats").insert([
      {
        name: name,
        birth_date: birthDate,
        gender: gender,
        breed: breed,
        is_castrated: isCastrated,
        avatar_url: image,
        id_user: userId,
      },
    ]);

    if (insertPet) throw translateError(insertPet.code);

    Alert.alert("Pet adicionado com sucesso!");
  } catch (error) {
    console.log("Erro ao criar pet:", error);
  }
}

export default function RegisterPet({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isCastrated, setIsCastrated] = React.useState(false);
  const { user } = useUser();

  const [image, setImage] = React.useState<string>("");

  const { loading } = useContext(AuthContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      breed: "",
      gender: "",
      birthDate: undefined,
      avatar_url: "",
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
          {isEnabled && (
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
            <Text style={styles.messageAlert}>{errors.birthDate?.message}</Text>
          )}

          <View>
            <Switch
              style={styles.mt20}
              value={isEnabled}
              onValueChange={setIsEnabled}
              thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
            <Text style={{ marginLeft: 8 }}>Sei a data de nascimento</Text>
          </View>
        </View>

        <View>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Gênero"
                onChangeText={onChange}
                value={value}
                placeholder="Digite o gênero do gato(a)"
              />
            )}
          />
          {errors.gender && (
            <Text style={styles.messageAlert}>{errors.gender?.message}</Text>
          )}
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
          <Switch
            style={styles.mt20}
            value={isCastrated}
            onValueChange={setIsCastrated}
            thumbColor={isCastrated ? "#fff" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
          <Text style={{ marginLeft: 8 }}>Castrado?</Text>
        </View>

        <View style={styles.container}>
          <Button onPress={pickImage}>
            Escolher uma foto de perfil
            {image && <Image source={{ uri: image }} />}
          </Button>
        </View>
        <View>
          <Button
            mode="contained"
            disabled={loading}
            style={styles.mt20}
            onPress={handleSubmit(async (data) => {
              await createPet(
                data.name,
                data.birthDate,
                data.gender,
                data.breed,
                isCastrated,
                image,
                user!.id
              );
              onClose();
            })}
          >
            Salvar alterações
          </Button>

          <Button
            onPress={() => {
              onClose();
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

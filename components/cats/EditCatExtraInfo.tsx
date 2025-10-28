import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import React from "react";

import { useCat } from "@/hooks/useCat";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup.object({}).required();

export default function EditCatExtraInfo({ catId }: { catId: string }) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { loading } = useCat(catId);

  // useEffect(() => {
  //   if (cat) {
  //     reset({
  //       avatar_url: cat.avatar_url,
  //       name: cat.name,
  //       breed: cat.breed,
  //       birthDate: cat.date_birth ? new Date(cat.date_birth) : undefined,
  //       knowBirthDate: !!cat.date_birth,
  //       castrated: !!cat.castrated,
  //       gender: cat.gender,
  //     });
  //   }
  // }, [cat, reset]);

  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Text>Informações adicionais</Text>

        {/* <View>
          <Controller
            control={control}
            name="avatar_url"
            render={({ field: { value, onChange } }) => (
              <View style={styles.container}>
                <Button onPress={() => pickImageAndSet(onChange)}>
                  {value && "Trocar foto do gato"}
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
        </View> */}

        <View>
          <Button
            mode="contained"
            disabled={loading}
            style={styles.mt20}
            onPress={handleSubmit(async (data) => {
              // if (!userTutor) throw new Error("Usuário não autenticado");
              // const birthDateToUpdate = data.knowBirthDate
              //   ? data.birthDate
              //   : null;
              // await updateCat(
              //   catId as string,
              //   data.name,
              //   birthDateToUpdate,
              //   data.gender,
              //   data.breed,
              //   data.castrated,
              //   data.avatar_url
              // );
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

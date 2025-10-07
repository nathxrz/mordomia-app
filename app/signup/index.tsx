import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import MaskInput from "react-native-mask-input";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    type: yup.string().required(requiredMessage).default("tutor"),
    name: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(3, "Nome deve ter no mínimo 3 caracteres"),
    phone: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^\([1-9]{2}\)\s9[0-9]{4}-[0-9]{4}$/,
        "Telefone inválido. Formato esperado: (99) 99999-9999"
      ),
    birthDate: yup.date().required(requiredMessage).nullable(),
    email: yup.string().email("E-mail inválido").required(requiredMessage),
    password: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Use letra maiúscula, minúscula, número e símbolo"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "As senhas não conferem")
      .required(requiredMessage),
  })
  .required();

export default function SignUp() {
  const [open, setOpen] = useState(false);

  const { signUpWithEmail, loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "tutor",
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: undefined,
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <>
          <View>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <RadioButton
                  value="tutor"
                  status={value === "tutor" ? "checked" : "unchecked"}
                  onPress={() => onChange("tutor")}
                />
              )}
            />
            <Text>Tutor</Text>

            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <RadioButton
                  value="catsitter"
                  status={value === "catsitter" ? "checked" : "unchecked"}
                  onPress={() => onChange("catsitter")}
                />
              )}
            />
            <Text>Cat sitter</Text>
          </View>

          <View>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Nome completo"
                  onChangeText={onChange}
                  value={value}
                  placeholder="Digite seu nome completo"
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
              name="phone"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Telefone"
                  onChangeText={onChange}
                  value={value}
                  placeholder="Digite seu telefone"
                  render={(props) => (
                    <MaskInput
                      {...props}
                      value={value}
                      onChangeText={(masked) => onChange(masked)}
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
                    />
                  )}
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.messageAlert}>{errors.phone?.message}</Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <>
                  {open && (
                    <DateTimePicker
                      value={value || new Date()}
                      onChange={(event, selectedDate) => {
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
            {errors.birthDate && (
              <Text style={styles.messageAlert}>
                {errors.birthDate?.message}
              </Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label={"Email"}
                  onChangeText={onChange}
                  value={value}
                  activeUnderlineColor="#6200ee"
                  placeholder="Digite seu email"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.messageAlert}>{errors.email?.message}</Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Senha"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  placeholder="Digite sua senha"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.messageAlert}>
                {errors.password?.message}
              </Text>
            )}
          </View>
        </>

        <View>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Confirmar senha"
                onChangeText={onChange}
                value={value}
                secureTextEntry
                placeholder="Confirme sua senha"
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.messageAlert}>
              {errors.confirmPassword?.message}
            </Text>
          )}
        </View>

        <View>
          <Button
            mode="contained"
            disabled={loading}
            style={styles.mt20}
            onPress={handleSubmit((data) => {
              signUpWithEmail(
                data.email,
                data.password,
                data.name,
                data.phone.replace(/\D/g, ""),
                data.birthDate as Date,
                data.type
              );
            })}
          >
            Criar conta
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

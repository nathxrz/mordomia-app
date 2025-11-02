import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";

import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ScrollView, StyleSheet, View } from "react-native";
import MaskInput from "react-native-mask-input";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
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
    birthDate: yup
      .string()
      .required(requiredMessage)
      .test("valid-date", "Data inválida", (value) => {
        if (!value || value.length < 10) return false;

        const [dayStr, monthStr, yearStr] = value.split("/");
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);

        if (day === 0 || month === 0 || year === 0) return false;

        const parsed = new Date(`${year}-${month}-${day}`);
        if (isNaN(parsed.getTime())) return false;

        const today = new Date();
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(today.getFullYear() - 100);

        return parsed <= today && parsed >= hundredYearsAgo;
      })
      .test("valid-format", "Data deve estar no formato dd/mm/aaaa", (value) =>
        /^\d{2}\/\d{2}\/\d{4}$/.test(value || "")
      ),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp, loading } = useContext(AuthContext);

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
      birthDate: "",
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
                <TextInput
                  label="Data de nascimento"
                  onChangeText={onChange}
                  value={value}
                  placeholder="dd/mm/aaaa"
                  render={(props) => (
                    <MaskInput
                      {...props}
                      value={value}
                      onChangeText={(masked) => onChange(masked)}
                      mask={[
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        "/",
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
                  right={
                    <TextInput.Icon
                      icon={() =>
                        showPassword ? (
                          <Icon name="visibility" size={20} color="#888" />
                        ) : (
                          <Icon name="visibility-off" size={20} color="#888" />
                        )
                      }
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
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

          <View>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Confirmar senha"
                  right={
                    <TextInput.Icon
                      icon={() =>
                        showConfirmPassword ? (
                          <Icon name="visibility" size={20} color="#888" />
                        ) : (
                          <Icon name="visibility-off" size={20} color="#888" />
                        )
                      }
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showConfirmPassword}
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
                const [day, month, year] = data.birthDate.split("/");
                const birthDate = new Date(`${year}-${month}-${day}T00:00:00`);

                signUp(
                  data.email,
                  data.password,
                  data.name,
                  data.phone.replace(/\D/g, ""),
                  birthDate,
                  data.type
                );
              })}
            >
              Criar conta
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

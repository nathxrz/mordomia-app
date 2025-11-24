import { AuthContext } from "@/context/AuthProvider";
import { yupResolver } from "@hookform/resolvers/yup";

import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaskInput from "react-native-mask-input";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object({
    type: yup
      .string()
      .required(requiredMessage)
      .oneOf(["tutor", "catsitter"], "Tipo de usuário inválido")
      .default("tutor"),
    name: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        "O nome deve conter apenas letras e espaços"
      ),
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
    email: yup
      .string()
      .trim()
      .email("E-mail inválido")
      .required(requiredMessage)
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Informe um e-mail válido"),
    password: yup
      .string()
      .trim()
      .required(requiredMessage)
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .max(50, "Senha muito longa")
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
  const [selectedType, setSelectedType] = useState<"tutor" | "catsitter">(
    "tutor"
  );

  const { signUp, loading } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "tutor" as "tutor" | "catsitter",
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
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        enableOnAndroid={true}
      >
        <View style={styles.container}>
          <View style={styles.typeContainer}>
            <Text style={styles.labelType}>Quem é você?</Text>
            <View style={styles.inputRadioContainer}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedType === "tutor" && styles.radioSelected,
                ]}
                onPress={() => {
                  setSelectedType("tutor");

                  setValue("type", "tutor");
                }}
              >
                <Text
                  style={[
                    styles.textButtonRadio,
                    selectedType === "tutor" && styles.textButtonRadioSelected,
                  ]}
                >
                  Tutor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedType === "catsitter" && styles.radioSelected,
                ]}
                onPress={() => {
                  setSelectedType("catsitter");
                  setValue("type", "catsitter");
                }}
              >
                <Text
                  style={[
                    styles.textButtonRadio,
                    selectedType === "catsitter" &&
                      styles.textButtonRadioSelected,
                  ]}
                >
                  Cat sitter
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <View>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Nome completo"
                    style={{ backgroundColor: "#fcfcfc" }}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name?.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Data de nascimento (dd/mm/aaaa)"
                    style={{ backgroundColor: "#fcfcfc" }}
                    right={
                      <TextInput.Icon
                        icon={() => (
                          <Icon
                            name="calendar-month"
                            size={20}
                            color="#B434CC"
                          />
                        )}
                      />
                    }
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
                <Text style={styles.errorText}>
                  {errors.birthDate?.message}
                </Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    style={{ backgroundColor: "#fcfcfc" }}
                    theme={{ roundness: 100 }}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Telefone"
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
                <Text style={styles.errorText}>{errors.phone?.message}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <Text style={styles.labelCredentials}>Credenciais</Text>
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    style={{ backgroundColor: "#fcfcfc" }}
                    onChangeText={onChange}
                    value={value}
                    activeUnderlineColor="#6200ee"
                    placeholder="E-mail"
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email?.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    style={{ backgroundColor: "#fcfcfc" }}
                    right={
                      <TextInput.Icon
                        icon={() =>
                          showPassword ? (
                            <Icon name="visibility" size={20} color="#B434CC" />
                          ) : (
                            <Icon
                              name="visibility-off"
                              size={20}
                              color="#B434CC"
                            />
                          )
                        }
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    placeholder="Senha"
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password?.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholderTextColor="#7f13ecab"
                    outlineColor="#979797"
                    activeOutlineColor="#979797"
                    textColor="#7F13EC"
                    theme={{ roundness: 100 }}
                    style={{ backgroundColor: "#fcfcfc" }}
                    right={
                      <TextInput.Icon
                        icon={() =>
                          showConfirmPassword ? (
                            <Icon name="visibility" size={20} color="#B434CC" />
                          ) : (
                            <Icon
                              name="visibility-off"
                              size={20}
                              color="#B434CC"
                            />
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
                    placeholder="Confirmação de senha"
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword?.message}
                </Text>
              )}
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.button_submit}
              disabled={loading}
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
              <Text style={styles.buttonText}>
                {loading ? "Cadastrando..." : "Cadastrar-se"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FCFCFC",
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  typeContainer: {
    marginBottom: 30,
  },
  labelType: {
    fontSize: 25,
    fontFamily: "Inter",
    fontWeight: "bold",
    lineHeight: 24,
    marginBottom: 12,
  },
  inputRadioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    marginRight: 8,
  },
  textButtonRadio: {
    color: "#4A4459",
    fontSize: 18,
    fontWeight: "600",
  },
  radioSelected: {
    backgroundColor: "#DFD2FF",
    borderColor: "#7F13EC",
  },
  textButtonRadioSelected: {
    color: "#000000",
    fontWeight: "700",
  },
  inputsContainer: {
    marginBottom: 10,
  },
  labelCredentials: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    marginTop: 30,
    color: "#1D1127",
  },
  button_submit: {
    alignSelf: "flex-end",
    marginTop: 50,
    backgroundColor: "#7F13EC",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
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
});

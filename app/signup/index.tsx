import { AuthContext } from "@/context/AuthProvider";
import { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StyleSheet, View } from "react-native";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";

export default function SignUp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [type, setType] = useState("tutor");
  const [date, setDate] = useState(new Date());

  const { signUpWithEmail, loading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <RadioButton
          value="tutor"
          status={type === "tutor" ? "checked" : "unchecked"}
          onPress={() => setType("tutor")}
        />
        <Text>Sou um tutor</Text>
        <RadioButton
          value="catsitter"
          status={type === "catsitter" ? "checked" : "unchecked"}
          onPress={() => setType("catsitter")}
        />
        <Text>Sou um catsitter</Text>
        <TextInput
          label="Nome completo"
          onChangeText={setName}
          value={name}
          placeholder="Digite seu nome completo"
        />
        <TextInput
          label="Telefone"
          onChangeText={setPhone}
          value={phone}
          placeholder="Digite seu telefone"
        />

        <DatePicker selected={date} onChange={() => setDate(date)} />

        {/* <TextInput
          label="Data de nascimento"
          onChangeText={setBirthDate}
          value={birthDate}
          placeholder="Digite sua data de nascimento"
        /> */}
        <TextInput
          label={"Email"}
          onChangeText={setEmail}
          value={email}
          activeUnderlineColor="#6200ee"
          placeholder="Digite seu email"
        />
        <TextInput
          label="Senhaa"
          onChangeText={setpassword}
          value={password}
          secureTextEntry
          placeholder="Digite sua senha"
        />
        <TextInput
          label="Confirmar senha"
          onChangeText={setconfirmPassword}
          value={confirmPassword}
          secureTextEntry
          placeholder="Confirme sua senha"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          mode="contained"
          disabled={loading}
          onPress={() => {
            signUpWithEmail(
              email,
              password,
              confirmPassword,
              name,
              phone,
              birthDate,
              type
            );
          }}
          style={styles.mt20}
        >
          Cadastrar
        </Button>
      </View>
    </View>
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
});

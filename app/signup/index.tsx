import { AuthContext } from "@/context/AuthProvider";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useContext, useState } from "react";

import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";

export default function SignUp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [type, setType] = useState("tutor");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

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

        {open && (
          <DateTimePicker
            value={date || new Date()}
            onChange={(event, selectedDate) => {
              setDate(selectedDate || date);
              setOpen(false);
            }}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity onPress={() => setOpen(true)}>
          <TextInput
            editable={false}
            label={"Data de nascimento"}
            pointerEvents="none"
            value={date ? date.toLocaleDateString() : "dd/mm/aaaa"}
            placeholder="Selecione sua data de nascimento"
          />
        </TouchableOpacity>
        <TextInput
          label={"Email"}
          onChangeText={setEmail}
          value={email}
          activeUnderlineColor="#6200ee"
          placeholder="Digite seu email"
        />
        <TextInput
          label="Senha"
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
              date as Date,
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

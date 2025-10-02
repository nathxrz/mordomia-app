import React, { useState } from "react";
import { Alert, AppState, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "../lib/supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateBirth, setDateBirth] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    try {
      setLoading(true);
      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Não foi possível criar o usuário.");

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          name: name,
          phone: phone,
          date_birth: dateBirth,
          photo_url: null,
          created_at: new Date(),
        },
      ]);

      if (insertError) throw insertError;

      Alert.alert(
        "Conta criada!",
        "Verifique seu email para confirmar o cadastro."
      );
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* --- LOGIN --- */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          label="Email"
          left={
            <TextInput.Icon
              icon={() => <Icon name="envelope" size={20} color="#888" />}
            />
          }
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.verticallySpaced}>
        <TextInput
          label="Password"
          left={
            <TextInput.Icon
              icon={() => <Icon name="lock" size={20} color="#888" />}
            />
          }
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button mode="contained" disabled={loading} onPress={signInWithEmail}>
          Entrar
        </Button>
      </View>

      {/* --- CADASTRO --- */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput label="Nome" value={name} onChangeText={setName} />
        <TextInput label="Telefone" value={phone} onChangeText={setPhone} />
        <TextInput
          label="Data de Nascimento"
          value={dateBirth}
          onChangeText={setDateBirth}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          mode="outlined"
          disabled={loading}
          onPress={signUpWithEmail}
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

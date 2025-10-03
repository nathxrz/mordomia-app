import { AuthContext } from "@/context/AuthProvider";
import { Link } from "expo-router";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithEmail, loading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
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
        <Button
          mode="contained"
          disabled={loading}
          onPress={() => signInWithEmail(email, password)}
        >
          Entrar
        </Button>
      </View>
      <View>
        <Link style={styles.link} href="./signup">
          Criar uma conta
        </Link>
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
  link: {
    marginTop: 20,
  },
});

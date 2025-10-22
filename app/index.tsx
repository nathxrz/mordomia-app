import { AuthContext } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";

export default function App() {
  const { session } = useContext(AuthContext);

  return (
    <View>
      {session && session.user ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/login" />
      )}
      TODO: adicionar a validação de usuário desativado aqui
    </View>
  );
}

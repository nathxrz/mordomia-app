import { AuthContext } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";

export default function App() {
  const { session } = useContext(AuthContext);

  function handleRedirect() {
    if (session && session.user) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/login" />;
    }
  }

  return <View>{handleRedirect()}</View>;
}

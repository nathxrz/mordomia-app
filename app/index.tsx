import { AuthContext } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
import { useContext } from "react";

export default function App() {
  const { session } = useContext(AuthContext);

  function handleRedirect() {
    if (session && session.user) {
      return <Redirect href="./(tabs)" />;
    } else {
      return <Redirect href="./(stack)/login" />;
    }
  }

  return handleRedirect();
}

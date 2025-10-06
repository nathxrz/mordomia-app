import { useRouter } from "expo-router";
import { createContext, useState } from "react";
import { Alert, AppState } from "react-native";
import { supabase } from "../lib/supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const AuthContext = createContext<{
  signInWithEmail: (email: string, password: string) => Promise<void>;
  loading: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    phone: string,
    dateBirth: string,
    type: string
  ) => Promise<void>;
}>({
  signInWithEmail: async () => {},
  loading: false,
  signUpWithEmail: async () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signInWithEmail(email: string, password: string) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    router.navigate("/");
  }

  async function signUpWithEmail(
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    phone: string,
    dateBirth: string,
    type: string
  ) {
    try {
      setLoading(true);

      Alert.alert(password, confirmPassword);

      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem.");
      }

      const { data, error } = await supabase.auth.signUp({
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
        },
      ]);

      if (insertError) throw insertError;

      if (type === "tutor") {
        const { error: insertTutorError } = await supabase
          .from("tutors")
          .insert([
            {
              id_user: data.user.id,
            },
          ]);

        if (insertTutorError) throw insertTutorError;
      } else if (type === "catsitter") {
        const { error: insertCatsitterError } = await supabase
          .from("cat_sitters")
          .insert([
            {
              id_user: data.user.id,
            },
          ]);

        if (insertCatsitterError) throw insertCatsitterError;
      }

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
    <AuthContext.Provider value={{ signInWithEmail, loading, signUpWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

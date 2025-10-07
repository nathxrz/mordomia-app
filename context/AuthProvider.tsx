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
    name: string,
    phone: string,
    dateBirth: Date,
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

    if (error) {
      Alert.alert(error.message);
    } else {
      router.navigate("/");
    }
    setLoading(false);
  }

  async function signUpWithEmail(
    email: string,
    password: string,
    name: string,
    phone: string,
    dateBirth: Date,
    type: string
  ) {
    try {
      setLoading(true);

      Alert.alert("Telefone: " + phone);

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

      const { data: role, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", type)
        .single();

      if (roleError) throw roleError;

      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("id_user", data.user.id)
        .eq("id_role", role.id)
        .maybeSingle();

      if (!existingRole) {
        const { error: insertUserRolesError } = await supabase
          .from("user_roles")
          .insert([{ id_user: data.user.id, id_role: role.id }]);

        if (insertUserRolesError) throw insertUserRolesError;
      }

      if (type === "tutor") {
        const { data: existingTutor } = await supabase
          .from("tutors")
          .select("id")
          .eq("id_user", data.user.id)
          .maybeSingle();

        if (!existingTutor) {
          const { error: insertTutorError } = await supabase
            .from("tutors")
            .insert([
              {
                id_user: data.user.id,
              },
            ]);

          if (insertTutorError) throw insertTutorError;
        }
      } else if (type === "catsitter") {
        const { data: existingCatSitter } = await supabase
          .from("cat_sitters")
          .select("id")
          .eq("id_user", data.user.id)
          .maybeSingle();

        if (!existingCatSitter) {
          const { error: insertCatSitterError } = await supabase
            .from("cat_sitters")
            .insert([
              {
                id_user: data.user.id,
              },
            ]);

          if (insertCatSitterError) throw insertCatSitterError;
        }
      }

      Alert.alert(
        "Conta criada!",
        "Verifique seu email para confirmar o cadastro."
      );
      router.navigate("/");
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

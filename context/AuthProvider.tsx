import { useRouter } from "expo-router";
import { createContext, useState } from "react";
import { Alert, AppState } from "react-native";
import { supabase } from "../lib/supabase";
import translateError from "../scripts/translate-error";

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
      Alert.alert(translateError(error.code));
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

      if (insertError) throw translateError(insertError.code);

      const { data: role, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", type)
        .single();

      if (roleError) throw translateError(roleError.code);

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

        if (insertUserRolesError)
          throw translateError(insertUserRolesError.code);
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

          if (insertTutorError) throw translateError(insertTutorError.code);
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

          if (insertCatSitterError)
            throw translateError(insertCatSitterError.code);
        }
      }

      Alert.alert("Verifique seu email para confirmar o cadastro.");
      router.navigate("/");
    } catch (err: any) {
      Alert.alert("Atenção", translateError(err.code));
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

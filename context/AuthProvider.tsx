import { createClient, Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";
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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone: string,
    dateBirth: Date,
    type: string
  ) => Promise<void>;
  signOut: (userDeletedAt: null | Date) => Promise<void>;
  session: Session | null;
  loading: boolean;
  confirmedPassword: (password: string) => Promise<boolean>;
}>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  session: null,
  loading: false,
  confirmedPassword: async () => {
    return false;
  },
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function signIn(email: string, password: string) {
    setLoading(true);

    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(translateError(error.code));
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data?.user?.id)
      .single();

    if (userError) {
      Alert.alert(translateError(userError.code));
      setLoading(false);
      return;
    }

    if (userData && userData?.deleted_at !== null) {
      router.navigate("/desactiveUser");
    } else if (userData && userData?.deleted_at === null) {
      router.navigate("./(tabs)/");
    } else {
      router.navigate("/");
    }
    setLoading(false);
  }

  async function signUp(
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
          created_at: new Date(),
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
      console.error("Erro no signUp:", err);
      Alert.alert("Atenção", err.message || translateError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function signOut(userDeletedAt: null | Date) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert(translateError(error.code));
        return;
      }
      if (userDeletedAt === null) {
        Alert.alert("Você saiu com sucesso.");
      }
      setSession(null);

      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Atenção", translateError(err.code));
    }
  }

  async function confirmedPassword(password: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user?.email) throw new Error("Usuário não autenticado.");
    if (userError) {
      throw new Error(translateError(userError.code));
    }

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

    const temSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { error: passwordError } = await temSupabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (passwordError) {
      Alert.alert(translateError(passwordError.code));
      return false;
    }

    return true;
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        session,
        loading,
        confirmedPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

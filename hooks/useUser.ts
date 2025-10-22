import { AuthContext } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";

import { Alert } from "react-native";

export const useUser = () => {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id || null;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const { data: user, error } = await supabase
          .from("users")
          .select("*, cat_sitters(id), tutors(id)")
          .eq("id", userId)
          .maybeSingle();

        if (error) throw new Error(translateError(error.code));

        if (user) {
          user.roles = [];
          user.email = session?.user.email;

          if (user.cat_sitters?.length > 0) {
            user.roles.push("catsitter");
          }

          if (user.tutors?.length > 0) {
            user.roles.push("tutor");
          }

          setUser(user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, session]);

  async function updateProfile(
    avatar_url: string | null,
    name: string,
    phone: string,
    dateBirth: Date
  ) {
    try {
      setLoading(true);
      if (!userId) throw new Error("Nenhum usuário na sessão!");

      const updates = {
        id: userId,
        avatar_url,
        name,
        phone,
        date_birth: dateBirth,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("users").upsert(updates);
      if (error) {
        throw new Error(translateError(error.code));
      }
      Alert.alert("Perfil atualizado com sucesso!");
      router.push("/(tabs)/profile");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function desactivateProfile() {
    try {
      setLoading(true);
      if (!userId) throw new Error("Nenhum usuário na sessão!");

      const { error } = await supabase
        .from("users")
        .update({ deleted_at: new Date() })
        .eq("id", userId);
      if (error) {
        throw new Error(translateError(error.code));
      }
      Alert.alert("Perfil excluído com sucesso!");

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw new Error(translateError(signOutError.code));
      }

      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function activeUsers() {
    if (!userId) return;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .is("deleted_at", null);

    if (error) {
      throw new Error(translateError(error.code));
    }

    return data;
  }

  return { user, updateProfile, desactivateProfile, loading, activeUsers };
};

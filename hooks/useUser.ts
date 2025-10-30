import { AuthContext } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";

import { Alert } from "react-native";

export const useUser = ({ id }: { id?: string } = {}) => {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id || id || null;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || !userId) {
      resetUser();
      return;
    }
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
  }, [userId, session?.user?.id, session]);

  const resetUser = () => {
    setUser(null);
  };

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

  const getAddressUser = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) throw new Error("Nenhum usuário na sessão!");

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("id_user", userId)
        .maybeSingle();
      if (error) {
        throw new Error(translateError(error.code));
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  async function updateAddressUser(
    cep: string,
    street: string,
    state: string,
    city: string,
    neighborhood: string,
    number: string,
    complement: string | undefined
  ) {
    try {
      setLoading(true);
      if (!userId) throw new Error("Nenhum usuário na sessão!");

      const hasAddress = await getAddressUser();
      console.log("hasAddress:", hasAddress);

      if (hasAddress) {
        const { error: updateError } = await supabase
          .from("addresses")
          .update({
            cep,
            street,
            state,
            city,
            neighborhood,
            number,
            complement,
            updated_at: new Date(),
          })
          .eq("id_user", userId);

        if (updateError) {
          console.log(updateError);
          throw new Error(translateError(updateError.code));
        }
        Alert.alert("Endereço atualizado com sucesso!");
      } else {
        const { error: insertError } = await supabase.from("addresses").insert({
          id_user: userId,
          cep,
          street,
          city,
          neighborhood,
          state,
          number,
          complement,
          created_at: new Date(),
        });
        if (insertError) {
          throw new Error(translateError(insertError.code));
        }
        Alert.alert("Endereço cadastrado com sucesso!");
      }
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

  return {
    user,
    updateProfile,
    desactivateProfile,
    loading,
    activeUsers,
    resetUser,
    getAddressUser,
    updateAddressUser,
  };
};

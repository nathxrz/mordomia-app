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
          .select("*, cat_sitters(id), tutors(id), admins(id)")
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

          if (user.admins?.length > 0) {
            user.roles.push("admin");
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: user, error } = await supabase
        .from("users")
        .select("*, cat_sitters(id), tutors(id), admins(id)")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw new Error(translateError(error.code));

      if (user) {
        user.roles = [];
        user.email = session?.user.email;

        if (user.cat_sitters?.length > 0) user.roles.push("catsitter");
        if (user.tutors?.length > 0) user.roles.push("tutor");
        if (user.admins?.length > 0) user.roles.push("admin");

        setUser(user); // <------ ESSENCIAL
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

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

      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(translateError(error.code));
      }

      // 🔥 Atualiza o estado global
      setUser((prev: any) => ({ ...prev, ...data }));

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
          throw new Error(translateError(updateError.code));
        }
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

  async function getUserAdmin(id: string) {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(translateError(error.code));
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
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
    getUserAdmin,
    fetchData,
  };
};

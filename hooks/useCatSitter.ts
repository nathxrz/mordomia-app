import { AuthContext } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useCatSitter = ({ id }: { id?: string } = {}) => {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id || id || null;
  const [userCatSitter, setUserCatSitter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const { data: userCatSitter, error } = await supabase
          .from("cat_sitters")
          .select("*")
          .eq("id_user", userId)
          .maybeSingle();

        if (error) throw new Error(translateError(error.code));

        if (userCatSitter) {
          setUserCatSitter(userCatSitter);
        } else {
          setUserCatSitter(null);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  async function updatePortfolio(
    biography: string,
    portfolio_url: string | undefined | null
  ) {
    try {
      setLoading(true);
      if (!userId) throw new Error("Nenhum usuário na sessão!");

      const { error } = await supabase
        .from("cat_sitters")
        .update({
          biography,
          portfolio_url,
        })
        .eq("id", userCatSitter.id);
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

  return {
    userCatSitter,
    loading,
    updatePortfolio,
  };
};

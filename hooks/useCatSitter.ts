import { AuthContext } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useCatSitter = ({ id }: { id?: string } = {}) => {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id || id || null;
  const [userCatSitter, setUserCatSitter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Definindo fetchData fora do useEffect para poder exportar
  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data: catSitterData, error } = await supabase
        .from("cat_sitters")
        .select("*")
        .eq("id_user", userId)
        .maybeSingle();

      if (error) throw new Error(translateError(error.code));

      setUserCatSitter(catSitterData || null);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Chama fetchData automaticamente ao montar ou mudar userId
  useEffect(() => {
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
        .eq("id_user", userId);

      if (error) {
        throw new Error(translateError(error.code));
      }

      // 🔹 Atualiza o estado local após salvar
      await fetchData();
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
    fetchData, // ✅ Agora é exportável
  };
};

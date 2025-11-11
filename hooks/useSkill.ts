import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useSkill = (skillId: string) => {
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchSkill = useCallback(async () => {
    if (!skillId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("skills")
        .select("*, users (name)")
        .eq("id", skillId)
        .maybeSingle();

      if (error) throw new Error(translateError(error.code));

      setSkill(data || null);
    } catch (error) {
      Alert.alert("Erro ao buscar habilidade", String(error));
    } finally {
      setLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  const deleteSkill = useCallback(async (skillId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skillId);

      if (error) {
        throw new Error(translateError(error.code));
      }
      return true;
    } catch (error) {
      Alert.alert("Erro ao excluir habilidade", String(error));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSkill = useCallback(
    async (updatedSkill: {
      id: string;
      name: string;
      description: string;
      id_admin: string;
    }) => {
      try {
        setLoading(true);
        const { error } = await supabase
          .from("skills")
          .update({
            name: updatedSkill.name,
            description: updatedSkill.description,
            id_admin: updatedSkill.id_admin,
            updated_at: new Date(),
          })
          .eq("id", updatedSkill.id);

        if (error) {
          throw new Error(translateError(error.code));
        }
        Alert.alert("Habilidade atualizada com sucesso!");
        router.back();
      } catch (error) {
        Alert.alert("Erro ao atualizar habilidade", String(error));
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    skill,
    deleteSkill,
    updateSkill,
    fetchSkill,
  };
};

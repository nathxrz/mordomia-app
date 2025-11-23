import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useCat = (catId: string) => {
  const [cat, setCat] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCat = useCallback(async () => {
    if (!catId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("cats")
        .select("*")
        .eq("id", catId)
        .maybeSingle();

      if (error) throw new Error(translateError(error.code));

      setCat(data || null);
    } catch (error) {
      Alert.alert("Erro ao buscar gato", String(error));
    } finally {
      setLoading(false);
    }
  }, [catId]);

  useEffect(() => {
    fetchCat();
  }, [fetchCat]);

  const deleteCat = useCallback(async () => {
    try {
      setLoading(true);

      const { error } = await supabase.from("cats").delete().eq("id", catId);
      if (error) throw new Error(translateError(error.code));

      return true;
    } catch (error) {
      Alert.alert("Erro ao excluir pet", String(error));
      return false;
    } finally {
      setLoading(false);
    }
  }, [catId]);

  const updateCat = useCallback(
    async (
      name: string,
      age_stage: string,
      gender: string,
      breed: string,
      isCastrated: boolean,
      image: string
    ) => {
      try {
        setLoading(true);

        if (!catId) throw new Error("ID do gato não fornecido.");

        const updates = {
          name,
          age_stage,
          gender,
          breed,
          castrated: isCastrated,
          avatar_url: image,
          updated_at: new Date(),
        };

        const { error } = await supabase
          .from("cats")
          .update(updates)
          .eq("id", catId);

        if (error) throw new Error(translateError(error.code));

        return true;
      } catch (error) {
        Alert.alert("Erro ao atualizar pet", String(error));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [catId]
  );

  // BUSCA INFO EXTRA
  const getCatExtraInfo = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("care_profiles")
        .select("*")
        .eq("id_cat", catId)
        .maybeSingle();

      if (error) throw new Error(translateError(error.code));

      return data;
    } catch (error) {
      Alert.alert("Erro ao buscar informações extras do gato", String(error));
      return null;
    }
  }, [catId]);

  const updateCatExtraInfo = useCallback(
    async (
      feeling: string,
      litter_box: string,
      sociability_humans: string,
      sociability_animals: string,
      activity_level: string,
      rabies_vaccine: boolean,
      health_notes: string | undefined,
      special_needs: string | undefined
    ) => {
      try {
        setLoading(true);
        if (!catId) throw new Error("ID do gato não fornecido.");

        const existing = await getCatExtraInfo();

        const payload = {
          feeling,
          litter_box,
          sociability_humans,
          sociability_animals,
          activity_level,
          health_notes,
          rabies_vaccine,
          special_needs,
          updated_at: new Date(),
        };

        if (existing) {
          const { error } = await supabase
            .from("care_profiles")
            .update(payload)
            .eq("id_cat", catId);

          if (error) throw new Error(translateError(error.code));
        } else {
          const { error } = await supabase.from("care_profiles").insert({
            id_cat: catId,
            ...payload,
            created_at: new Date(),
          });

          if (error) throw new Error(translateError(error.code));
        }

        return true;
      } catch (error) {
        Alert.alert("Erro ao atualizar informações extras", String(error));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [catId, getCatExtraInfo]
  );

  return {
    cat,
    loading,
    fetchCat,
    deleteCat,
    updateCat,
    updateCatExtraInfo,
    getCatExtraInfo,
  };
};

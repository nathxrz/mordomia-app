import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useCat = (catId: string) => {
  const [cat, setCat] = useState<any>(null);
  const [catExtraInfo, setCatExtraInfo] = useState<any>(null);
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

  const fetchCatExtraInfo = useCallback(async () => {
    if (!catId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("care_profiles")
        .select("*")
        .eq("id_cat", catId)
        .maybeSingle();

      if (error) throw new Error(translateError(error.code));

      setCatExtraInfo(data || null);
    } catch (error) {
      Alert.alert("Erro ao buscar gato", String(error));
    } finally {
      setLoading(false);
    }
  }, [catId]);

  useEffect(() => {
    fetchCat();
    fetchCatExtraInfo();
  }, [fetchCat, fetchCatExtraInfo]);

  async function deleteCat(catId: string) {
    try {
      setLoading(true);
      const { error } = await supabase.from("cats").delete().eq("id", catId);

      if (error) {
        throw new Error(translateError(error.code));
      }

      Alert.alert("Gato excluído com sucesso!");
      router.back();
      return true;
    } catch (error) {
      Alert.alert("Erro ao excluir pet", String(error));
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function updateCat(
    catId: string,
    name: string,
    birthDate: Date | null | undefined,
    gender: string,
    breed: string,
    isCastrated: boolean,
    image: string
  ) {
    try {
      setLoading(true);
      if (!catId) {
        throw new Error("Erro ao atualizar felino: ID do gato não fornecido.");
      }

      const updates = {
        name,
        date_birth: birthDate,
        gender,
        breed,
        castrated: isCastrated,
        avatar_url: image,
      };

      const { error } = await supabase
        .from("cats")
        .update(updates)
        .eq("id", catId);

      if (error) {
        throw new Error(translateError(error.code));
      }
      Alert.alert("Felino atualizado com sucesso!");
      setLoading(false);
      router.back();
    } catch (error) {
      Alert.alert("Erro: ao atualizar pet", String(error));
    } finally {
      setLoading(false);
    }
  }

  async function updateCatExtraInfo(
    feeling: string,
    litter_box: string,
    sociability_humans: string,
    sociability_animals: string,
    active_level: string,
    health_notes: string,
    special_needs: string
  ) {
    try {
      setLoading(true);
      if (!catId) {
        throw new Error("Erro ao atualizar pet: ID do gato não fornecido.");
      }

      const updates = {
        feeling,
        litter_box,
        sociability_humans,
        sociability_animals,
        active_level,
        health_notes,
        special_needs,
      };

      const { error } = await supabase
        .from("care_profiles")
        .update(updates)
        .eq("id_cat", catId);

      if (error) {
        throw new Error(translateError(error.code));
      }
      Alert.alert("Informações extras do felino atualizadas com sucesso!");
      setLoading(false);
      router.back();
    } catch (error) {
      Alert.alert("Erro: ao atualizar felino", String(error));
    } finally {
      setLoading(false);
    }
  }

  async function getCatExtraInfo() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("care_profiles")
        .select("*")
        .eq("id_cat", catId)
        .maybeSingle();

      if (error) {
        throw new Error(translateError(error.code));
      }

      return data;
    } catch (error) {
      Alert.alert("Erro ao buscar informações extras do gato", String(error));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    cat,
    deleteCat,
    updateCat,
    fetchCat,
    getCatExtraInfo,
    loading,
    updateCatExtraInfo,
    catExtraInfo,
  };
};

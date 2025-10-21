import { AuthContext } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useUser = () => {
  const { session } = useContext(AuthContext);
  const userId = session?.user.id || null;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const { data: user, error } = await supabase
        .from("users")
        .select("*, cat_sitters(id), tutors(id)")
        .eq("id", userId)
        .maybeSingle();

      user.roles = [];
      user.email = session?.user.email;

      if (user?.cat_sitters?.length > 0) {
        user.roles.push("catsitter");
      }

      if (user?.tutors?.length > 0) {
        user.roles.push("tutor");
      }

      setUser(user);
      if (error) {
        throw new Error(translateError(error.code));
      }
    };
    fetchData();
  }, [userId, session]);

  async function updateProfile({
    name,
    phone,
    dateBirth,
  }: {
    name: string;
    phone: string;
    dateBirth: Date;
  }) {
    try {
      setLoading(true);
      if (!userId) throw new Error("Nenhum usuário na sessão!");

      const updates = {
        id: userId,
        name,
        phone,
        dateBirth,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("users").upsert(updates);
      if (error) {
        throw new Error(translateError(error.code));
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return { user, updateProfile, loading };
};

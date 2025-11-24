import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export const useTutor = () => {
  const { user } = useUser();
  const [userTutor, setUserTutor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setUserTutor(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: tutor, error } = await supabase
          .from("tutors")
          .select("*")
          .eq("id_user", user?.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar tutor:", error);
          setError(translateError(error.code));
          return;
        }

        setUserTutor(tutor);
      } catch (err) {
        console.error("Erro no useTutor:", err);
        setError("Erro ao carregar informações do tutor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return { userTutor, loading, error };
};

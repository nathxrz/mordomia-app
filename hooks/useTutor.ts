import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export const useTutor = () => {
  const { user } = useUser();
  const [userTutor, setUserTutor] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const { data: tutor, error } = await supabase
        .from("tutors")
        .select("*")
        .eq("id_user", user?.id)
        .maybeSingle();

      if (error) throw translateError(error.code);
      setUserTutor(tutor);
    };
    fetchData();
  }, [user?.id]);

  return userTutor;
};

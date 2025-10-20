import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useEffect, useState } from "react";

export const useTutor = ({ userId }: { userId: string }) => {
  const [tutorData, setTutorData] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const { data: tutor, error } = await supabase
        .from("tutors")
        .select("*")
        .eq("id_user", userId)
        .maybeSingle();

      if (error) throw translateError(error.code);
      setTutorData(tutor);
    };
    fetchData();
  }, [userId]);

  return tutorData;
};

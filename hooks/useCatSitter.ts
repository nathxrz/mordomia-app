import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export const useCatSitter = () => {
  const { user } = useUser();
  const [userCatSitter, setUserCatSitter] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const { data: catSitter, error } = await supabase
        .from("cat_sitters")
        .select("*")
        .eq("id_user", user?.id)
        .maybeSingle();

      if (error) throw translateError(error.code);
      setUserCatSitter(catSitter);
    };
    fetchData();
  }, [user?.id]);

  return userCatSitter;
};

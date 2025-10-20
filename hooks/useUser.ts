import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const useUser = ({ userId }: { userId: string }) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      setUserData(user);
    };
    fetchData();
  }, [userId]);

  return userData;
};

import Profile from "@/components/Profile";
import { Session } from "@supabase/supabase-js";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { supabase } from "../lib/supabase";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      {session && session.user ? (
        <Profile session={session} />
      ) : (
        <Redirect href="/signin" />
      )}
    </View>
  );
}

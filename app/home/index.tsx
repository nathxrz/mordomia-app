import CatSitterHome from "@/components/CatSitterHome";
import TutorHome from "@/components/TutorHome";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function Home({ session }: { session: Session }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile(): Promise<void> {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Nenhum usuário na sessão!");

      const {
        data: userData,
        error,
        status,
      } = await supabase
        .from("users")
        .select("id, name")
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) throw error;
      if (!userData) throw new Error("Usuário não encontrado!");

      setName(userData.name);

      // const { data: catsitterData, error: catsitterError } = await supabase
      //   .from("cat_sitters")
      //   .select("id")
      //   .eq("id_user", userData.id)
      //   .maybeSingle();

      // if (catsitterError) throw catsitterError;

      // const { data: tutorData, error: tutorError } = await supabase
      //   .from("tutors")
      //   .select("id")
      //   .eq("id_user", userData.id)
      //   .maybeSingle();

      // if (tutorError) throw tutorError;

      // if (catsitterData?.id) {
      //   setRole("catsitter");
      // } else if (tutorData?.id) {
      //   setRole("tutor");
      // } else {
      //   setRole("");
      // }

      // Alert.alert("Seu papel é: " + role);
    } catch (error) {
      console.log("Erro getProfile:", error);
      if (error instanceof Error)
        Alert.alert("Erro ao carregar perfil", error.message);
      setRole("");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#7F13EC" />
        <Text style={{ marginTop: 10, color: "#7F13EC" }}>
          Carregando perfil...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {role === "catsitter" ? (
        <CatSitterHome name={name} />
      ) : role === "tutor" ? (
        <TutorHome name={name} />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: "#7F13EC",
              fontSize: 16,
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            Seu perfil ainda não foi configurado. Acesse seu cadastro para
            definir se deseja atuar como{" "}
            <Text style={{ fontWeight: "bold" }}>Tutor</Text> ou{" "}
            <Text style={{ fontWeight: "bold" }}>Cat Sitter</Text>.
          </Text>
          <Text>Seja bem-vindo {name}!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

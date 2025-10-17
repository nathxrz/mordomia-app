import TutorProfile from "@/components/TutorProfile";
import { AuthContext } from "@/context/AuthProvider";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { session, getUserById, getCatSitterByUserId } =
    useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function getProfile(): Promise<void> {
      try {
        setLoading(true);
        if (!session?.user) throw new Error("Nenhum usuário na sessão!");

        // const { data: userData, error } = await supabase
        //   .from("users")
        //   .select("*")
        //   .eq("id", session.user.id)
        //   .maybeSingle();

        // if (error) throw translateError(error.code);

        const dataCatSitter = await getCatSitterByUserId(session.user.id);
        const dataTutor = await getUserById(session.user.id);

        if (dataCatSitter) {
          setRole("catsitter");
          setUserId(dataCatSitter.id_user);
        } else if (dataTutor) {
          setRole("tutor");
          setUserId(dataTutor.id_user);
        } else {
          setRole("");
        }

        // const { data: catsitterData, error: catsitterError } = await supabase
        //   .from("cat_sitters")
        //   .select("*")
        //   .eq("id_user", userData.id)
        //   .maybeSingle();

        // if (catsitterError) throw catsitterError;

        // const { data: tutorData, error: tutorError } = await supabase
        //   .from("tutors")
        //   .select("*")
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
      } catch (error) {
        console.log("Erro getProfile:", error);
        if (error instanceof Error)
          Alert.alert("Erro ao carregar perfil", error.message);
        setRole("");
      } finally {
        setLoading(false);
      }
    }

    if (session) getProfile();
  }, [session]);

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
      {/* {role === "catsitter" ? (
        <ProfileCatSitterHome catsitterId={userId} />
      ) : (
        <ProfileTutorHome tutorId={userId} />
      )} */}
      {role === "tutor" && <TutorProfile tutorId={userId} />}
    </SafeAreaView>
  );
}

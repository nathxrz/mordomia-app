import { useTutor } from "@/hooks/useTutor";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TutorProfile({ userId }: { userId: string }) {
  const userData = useUser({ userId: userId });
  const tutorData = useTutor({ userId: userId });
  return (
    <SafeAreaView>
      <Text>Tutor Profile Screen</Text>
      {tutorData ? (
        <Text>Welcome, {userData.name}!</Text>
      ) : (
        <Text>Carregando informações...</Text>
      )}
    </SafeAreaView>
  );
}

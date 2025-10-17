import { AuthContext } from "@/context/AuthProvider";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TutorProfile({ tutorId }: { tutorId: string }) {
  const { getUserById } = useContext(AuthContext);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserById(tutorId);
      setUserData(user);
    };

    if (tutorId) {
      fetchData();
    }
  }, [tutorId, getUserById]);

  return (
    <SafeAreaView>
      <Text>Tutor Profile Screen</Text>
      {userData ? (
        <Text>Welcome, {userData.name}!</Text>
      ) : (
        <Text>Carregando informações...</Text>
      )}
    </SafeAreaView>
  );
}

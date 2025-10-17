import { AuthContext } from "@/context/AuthProvider";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CatsS({ catsitterId }: { catsitterId: string }) {
  const { getUserById } = useContext(AuthContext);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserById(catsitterId);
      setUserData(user);
    };

    if (catsitterId) {
      fetchData();
    }
  }, [catsitterId, getUserById]);

  return (
    <SafeAreaView>
      <Text>Cat Sitter Home Screen</Text>
      {userData ? (
        <Text>Welcome, {userData.name}!</Text>
      ) : (
        <Text>Carregando informações...</Text>
      )}
    </SafeAreaView>
  );
}

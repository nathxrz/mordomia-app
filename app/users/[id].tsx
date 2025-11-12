import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { Button } from "react-native-paper";

async function fetchUser(id: string) {
  try {
    const { data: userData, error } = await supabase
      .from("user_with_email_and_address")
      .select("*")
      .eq("id", id)
      .order("name", { ascending: true });

    if (error) {
      throw new Error(translateError(error.code));
    }

    return userData;
  } catch (error) {
    Alert.alert("Erro ao buscar os usuários", String(error));
  }
}

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const [userData, setUserData] = useState<{
    id: string;
    name: string;
    avatar_url: string;
    phone: string;
    date_birth: Date;
    email: string;
    created_at: Date;
    deleted_at: Date | null;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement: string;
  } | null>(null);
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      fetchUser(id as string).then((data) => {
        if (data && data.length > 0) setUserData(data[0]);
      });
    }, [user, id])
  );

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <View style={{ marginBottom: 20 }}>
        <Image
          source={
            userData?.avatar_url
              ? { uri: userData?.avatar_url }
              : require("../../assets/images/avatar.png")
          }
          style={{ width: 100, height: 100 }}
        />
        <Text>{userData?.name}</Text>
        <Text>{userData?.email}</Text>
        <Text>{userData?.phone}</Text>
        <Text>{userData?.date_birth.toString()}</Text>
        <Text>{userData?.created_at.toString()}</Text>
        <Text>{userData?.deleted_at?.toString()}</Text>
        {userData?.cep && (
          <View>
            <Text>
              {userData?.street}, {userData?.number} - {userData?.neighborhood}
            </Text>
            <Text>
              {userData?.city} - {userData?.state}
            </Text>
            <Text>{userData?.cep}</Text>
            <Text>{userData?.complement}</Text>
          </View>
        )}
      </View>

      <Button
        mode="contained"
        onPress={() => {
          router.back();
        }}
      >
        voltar
      </Button>
    </View>
  );
}

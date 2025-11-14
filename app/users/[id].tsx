import ConfirmedModal from "@/components/modais/ConfirmedModal";
import { supabase } from "@/lib/supabase";
import translateError from "@/scripts/translate-error";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

async function fetchUser(id: string) {
  try {
    const { data: userData, error } = await supabase
      .from("user_with_email_address_and_roles")
      .select("*")
      .eq("id", id);

    if (error) {
      throw new Error(translateError(error.code));
    }

    return userData;
  } catch (error) {
    Alert.alert("Erro ao buscar o usuário", String(error));
  }
}

async function toggleUserStatus(id: string, deleted_at: Date | null) {
  try {
    const deletedAt = deleted_at ? null : new Date();
    const { error } = await supabase
      .from("users")
      .update({ deleted_at: deletedAt })
      .eq("id", id);
    if (error) {
      throw new Error(translateError(error.code));
    }
  } catch (error) {
    Alert.alert("Erro ao atualizar o status do usuário", String(error));
  }
}

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const [modalVisibleConfirmed, setModalVisibleConfirmed] = useState(false);
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
    roles: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      fetchUser(id as string).then((data) => {
        if (data && data.length > 0) setUserData(data[0]);
      });
    }, [id])
  );

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <TouchableOpacity onPress={() => setModalVisibleConfirmed(true)}>
        <Icon
          name={userData?.deleted_at ? "person-off" : "person"}
          size={24}
          color="#000"
        />
        <Text>
          {userData?.deleted_at ? "Ativar usuário" : "Desativar usuário"}
        </Text>
      </TouchableOpacity>
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
        <Text>{userData?.roles}</Text>
        <Text>{userData?.email}</Text>
        <Text>{userData?.phone}</Text>
        <Text>
          Data de nascimento:{" "}
          {userData?.date_birth
            ? new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
              }).format(new Date(userData.date_birth))
            : "Data não informada"}
        </Text>

        <Text>
          Criado em:{" "}
          {new Intl.DateTimeFormat("pt-BR").format(
            new Date(userData?.created_at || new Date())
          )}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            color: userData?.deleted_at ? "red" : "green",
          }}
        >
          {userData?.deleted_at
            ? "Desativado em: " +
              new Intl.DateTimeFormat("pt-BR").format(
                new Date(userData.deleted_at)
              )
            : "Ativo"}
        </Text>
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
        <ConfirmedModal
          modalVisible={modalVisibleConfirmed}
          onConfirm={() => {
            toggleUserStatus(id as string, userData?.deleted_at || null);
            setUserData((prev) =>
              prev
                ? { ...prev, deleted_at: prev.deleted_at ? null : new Date() }
                : prev
            );
            setModalVisibleConfirmed(false);
          }}
          onCancel={() => setModalVisibleConfirmed(false)}
          message={
            userData?.deleted_at ? "Ativar usuário?" : "Desativar usuário?"
          }
        />
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

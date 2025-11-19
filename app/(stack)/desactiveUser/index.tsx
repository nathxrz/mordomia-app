import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { useContext } from "react";
import { Button, Text, View } from "react-native";

export default function DesactivatedProfilePage() {
  const { user } = useUser();
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, textAlign: "center", marginHorizontal: 20 }}>
        Seu perfil foi desativado. Por favor, entre em contato com o suporte
        para mais informações.
      </Text>
      <Button title="Sair" onPress={() => signOut(user?.deleted_at)} />
    </View>
  );
}

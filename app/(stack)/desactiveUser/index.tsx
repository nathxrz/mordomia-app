import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DesactivatedProfilePage() {
  const { user } = useUser();
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil desativado</Text>

        <Text style={styles.message}>
          Seu perfil foi desativado. Entre em contato com o suporte para mais
          informações.
        </Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => signOut(user?.deleted_at)}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F7FB",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFF",
    width: "100%",
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#B83FCF",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  message: {
    fontSize: 16,
    color: "#605A6D",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Roboto",
  },
  logoutButton: {
    backgroundColor: "#B83FCF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
});

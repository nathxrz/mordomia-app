import ConfirmedModal from "@/components/modais/ConfirmedModal";
import { supabase } from "@/lib/supabase";
import { formatPhone } from "@/scripts/format-phone";
import translateError from "@/scripts/translate-error";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const rolesArray = userData?.roles.split(",").map((r) => r.trim()) || [];

  const roleLabels = rolesArray.map((role) =>
    role === "admin"
      ? "Administrador"
      : role === "catsitter"
      ? "Cat Sitter"
      : role === "tutor"
      ? "Tutor"
      : role
  );

  const displayRoles = roleLabels.join(" - ");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cat Sitter",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/users/usersList")}
              style={{ marginLeft: 16 }}
            >
              <Text
                style={{
                  fontFamily: "MaterialSymbolsOutlined",
                  fontSize: 30,
                  lineHeight: 30,
                  color: "#000",
                }}
              >
                arrow_back
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.profileHeader}>
              <Image
                style={styles.profileImage}
                source={
                  userData?.avatar_url
                    ? { uri: userData?.avatar_url }
                    : require("../../../../assets/images/avatar.png")
                }
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData?.name}</Text>
                <Text>{displayRoles}</Text>
                <Text style={styles.profileEmail}>{userData?.email}</Text>
                {(userData?.roles.includes("cat_sitter") ||
                  userData?.roles.includes("tutor")) && (
                  <View style={styles.ratingContainer}>
                    <Text
                      style={{
                        fontFamily: "MaterialSymbolsOutlined",
                        fontSize: 14,
                        lineHeight: 14,
                        color: "#F08000",
                        marginRight: 4,
                      }}
                    >
                      star
                    </Text>

                    <Text style={styles.profileReviews}>4.9 (23 reviews)</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.basicInfoContainer}>
              <Text style={styles.titleSection}>Informações básicas</Text>
              <View style={styles.cardContainer}>
                <Text
                  style={{
                    fontFamily: "MaterialSymbolsOutlined",
                    fontSize: 25,
                    lineHeight: 25,
                    color: "#B434CC",
                    backgroundColor: "#FAE5FF",
                    padding: 14,
                    borderRadius: 13,
                  }}
                >
                  phone
                </Text>
                <Text style={styles.titleCard}>
                  {formatPhone(userData?.phone)}
                </Text>
              </View>
              <View style={styles.cardContainer}>
                <Text
                  style={{
                    fontFamily: "MaterialSymbolsOutlined",
                    fontSize: 25,
                    lineHeight: 25,
                    color: "#B434CC",
                    backgroundColor: "#FAE5FF",
                    padding: 14,
                    borderRadius: 13,
                  }}
                >
                  location_on
                </Text>
                <View>
                  {userData?.city || userData?.state ? (
                    <View>
                      <Text style={styles.titleCard}>
                        {userData.city} - {userData.state}
                      </Text>
                      <Text style={styles.subtitleCard}>
                        {userData?.street ||
                        userData?.number ||
                        userData?.neighborhood
                          ? `${userData?.street}, ${userData?.number}, ${userData?.neighborhood}.`
                          : "Nenhum detalhe cadastrado."}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.titleCard}>Endereço</Text>
                      <Text style={{ fontSize: 16 }}>
                        Nenhum detalhe cadastrado.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.cardContainer}>
                <Text
                  style={{
                    fontFamily: "MaterialSymbolsOutlined",
                    fontSize: 25,
                    lineHeight: 25,
                    color: "#B434CC",
                    backgroundColor: "#FAE5FF",
                    padding: 14,
                    borderRadius: 13,
                  }}
                >
                  cake
                </Text>
                <View>
                  <Text style={styles.titleCard}>Data de nascimento</Text>
                  <Text style={styles.subtitleCard}>
                    {userData?.date_birth
                      ? new Intl.DateTimeFormat("pt-BR", {
                          dateStyle: "short",
                        }).format(new Date(userData.date_birth))
                      : "Data não informada"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.aboutContainer}>
              <View style={styles.cardExpansiveContainer}>
                <View style={styles.metaContainer}>
                  <Text style={styles.metaText}>Criado em: </Text>
                  <Text style={styles.metaValue}>
                    {new Intl.DateTimeFormat("pt-BR").format(
                      new Date(userData?.created_at || new Date())
                    )}
                  </Text>
                </View>

                <View style={styles.metaContainer}>
                  <Text
                    style={[
                      styles.metaText,
                      userData?.deleted_at
                        ? styles.statusInactive
                        : styles.statusActive,
                    ]}
                  >
                    {userData?.deleted_at ? "Desativado em:" : "Ativo"}
                  </Text>

                  {userData?.deleted_at && (
                    <Text style={[styles.metaValue, styles.statusInactive]}>
                      {new Intl.DateTimeFormat("pt-BR").format(
                        new Date(userData.deleted_at)
                      )}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.button_submit,
                userData?.deleted_at
                  ? styles.button_submit_active
                  : styles.button_submit_desactive,
              ]}
              onPress={() => setModalVisibleConfirmed(true)}
            >
              <Text
                style={[
                  styles.buttonText,
                  userData?.deleted_at
                    ? styles.button_submit_active
                    : styles.button_submit_desactive,
                ]}
              >
                {userData?.deleted_at ? "Ativar usuário" : "Desativar usuário"}
              </Text>
            </TouchableOpacity>
          </View>
          <ConfirmedModal
            modalVisible={modalVisibleConfirmed}
            onConfirm={() => {
              toggleUserStatus(id as string, userData?.deleted_at || null);
              setUserData((prev) =>
                prev
                  ? {
                      ...prev,
                      deleted_at: prev.deleted_at ? null : new Date(),
                    }
                  : prev
              );
              setModalVisibleConfirmed(false);
            }}
            onCancel={() => setModalVisibleConfirmed(false)}
            message={
              userData?.deleted_at
                ? "Você deseja ativar o usuário?"
                : "Você deseja desativar o usuário?"
            }
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F6F8",
    flex: 1,
  },
  container: {
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 30,
  },
  profileHeader: {
    alignItems: "center",
    gap: 20,
  },
  profileImage: {
    width: 144,
    height: 144,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  profileInfo: {
    alignItems: "center",
    gap: 4,
  },
  profileName: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
  },
  profileEmail: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#B83FCF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileReviews: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#4A4459",
  },
  basicInfoContainer: {
    gap: 10,
  },
  titleSection: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FCFCFC",
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  titleCard: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#000000",
    fontWeight: "700",
    lineHeight: 20,
  },
  subtitleCard: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#B83FCF",
  },
  aboutContainer: {
    gap: 10,
  },
  cardExpansiveContainer: {
    backgroundColor: "#FCFCFC",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 16,
    gap: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#000",
    marginVertical: 2,
    fontWeight: "bold",
  },
  metaValue: {
    fontSize: 16,
    color: "#605A6D",
  },
  statusActive: {
    fontWeight: "700",
    color: "#008000",
  },
  statusInactive: {
    fontWeight: "700",
    color: "#EE0101",
  },
  button_submit: {
    alignSelf: "center",
    backgroundColor: "#fcfcfc",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 30,
  },
  button_submit_active: {
    color: "#008000",
    borderColor: "#008000",
  },
  button_submit_desactive: {
    color: "#EE0101",
    borderColor: "#EE0101",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
  },
});

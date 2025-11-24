import { AuthContext } from "@/context/AuthProvider";
import { useUser } from "@/hooks/useUser";
import { formatPhone } from "@/scripts/format-phone";

import formatDate from "@/scripts/format-date";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddressUser from "../AddressUser";
import ConfirmedModal from "../modais/ConfirmedModal";
import ConfirmedModalPassword from "../modais/ConfirmedModalPassword";

export default function AdminProfile() {
  const { user: userData, fetchData } = useUser();
  const { signOut } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleConfirmedPassword, setModalVisibleConfirmedPassword] =
    useState(false);
  const [refresh, setRefresh] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const updateData = async () => {
        await fetchData();
        setRefresh((prev) => prev + 1);
      };
      updateData();
    }, [])
  );

  if (!userData) {
    return <Text>Carregando informações...</Text>;
  }
  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {userData ? (
          <View style={styles.container}>
            <View style={styles.profileHeader}>
              <Image
                style={styles.profileImage}
                source={
                  userData?.avatar_url
                    ? { uri: userData?.avatar_url }
                    : require("../../assets/images/avatar.png")
                }
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData?.name}</Text>
                <Text style={styles.profileEmail}>{userData?.email}</Text>
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
                <View style={styles.cardTextContainer}>
                  <Text style={styles.titleCard}>Telefone</Text>
                  <Text style={styles.subtitleCard}>
                    {formatPhone(userData?.phone)}
                  </Text>
                </View>
              </View>

              <AddressUser refresh={refresh} />

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
                <View style={styles.cardTextContainer}>
                  <Text style={styles.titleCard}>Data de nascimento</Text>
                  <Text style={styles.subtitleCard}>
                    {formatDate(userData?.date_birth)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.basicInfoContainer}>
              <Text style={styles.titleSection}>Configurações</Text>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
              >
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
                    person_cancel
                  </Text>

                  <View style={styles.cardPetContainer}>
                    <View>
                      <Text style={styles.titleCard}>Excluir conta</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  signOut(userData.deleted_at);
                }}
              >
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
                    logout
                  </Text>

                  <View style={styles.cardPetContainer}>
                    <View>
                      <Text style={[styles.titleCard, styles.Alert]}>Sair</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <ConfirmedModal
                modalVisible={modalVisible}
                onConfirm={() => {
                  setModalVisible(false);
                  setModalVisibleConfirmedPassword(true);
                }}
                onCancel={() => setModalVisible(false)}
                message="Tem certeza que deseja suspender sua conta?"
              />

              <ConfirmedModalPassword
                modalVisible={modalVisibleConfirmedPassword}
                onConfirm={() => setModalVisibleConfirmedPassword(false)}
                onCancel={() => setModalVisibleConfirmedPassword(false)}
              />
            </View>
          </View>
        ) : (
          <Text>Carregando informações...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
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
  cardTextContainer: {
    gap: 2,
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
  cardPetContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Alert: {
    color: "#EE0101",
  },
});
